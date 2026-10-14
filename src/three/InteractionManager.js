import * as THREE from 'three';

export class InteractionManager {
  constructor(sceneManager, worldBuilder, soundManager, openDossierFn, scrollChoreographer) {
    this.sceneManager = sceneManager;
    this.worldBuilder = worldBuilder;
    this.soundManager = soundManager;
    this.openDossier = openDossierFn;
    this.scrollChoreographer = scrollChoreographer;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.tooltip = document.getElementById('landmarkTooltip');
    this.tooltipTitle = document.getElementById('tooltipTitle');
    this.tooltipDesc = document.getElementById('tooltipDesc');

    this.hoveredLandmark = null;

    this.setupMouseEvents();
    this.setupHUDButtons();
  }

  setupMouseEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      // Only check 3D intersection if not hovering over interactive UI element
      if (!e.target.closest('.content-section, .global-header, .floating-hud-bottom-left, .floating-hud-bottom-right, .terminal-modal, .dossier-modal')) {
        this.checkIntersection(e.clientX, e.clientY);
      } else {
        this.hideTooltip();
      }
    });

    window.addEventListener('click', (e) => {
      if (this.hoveredLandmark && !e.target.closest('.content-section, .global-header, .floating-hud-bottom-left, .floating-hud-bottom-right, .terminal-modal, .dossier-modal')) {
        if (this.soundManager) this.soundManager.playBlip(780, 'sine', 0.12);
        
        const data = this.hoveredLandmark.userData;
        if (data.targetCamPos && data.targetLookAt) {
          if (this.scrollChoreographer) this.scrollChoreographer.isManualOrbit = true;
          this.sceneManager.transitionCamera(data.targetCamPos, data.targetLookAt, 1.2);
          this.sceneManager.controls.autoRotate = false;
          this.updateRotateBtnState(false);
        }

        if (this.openDossier) {
          this.openDossier({
            tag: '3D ARCHITECTURE LANDMARK',
            title: data.title,
            meta: 'COORDINATES: VIRTUAL SYNTHWAVE MATRIX // 60 FPS',
            body: `
              <p>${data.desc}</p>
              <h4>ENGINEERING RELEVANCE:</h4>
              <p>This virtual landmark anchors core architectural foundations in Kuldeep Sharma's portfolio: declarative graphics pipelines, sub-millisecond execution budgets, and resilient systems.</p>
            `,
            techTags: ['Three.js', 'WebGL', 'GLSL Shaders', 'Spatial Computing', 'Math & Trigonometry'],
            anchor: data.sectionAnchor
          });
        }
      }
    });
  }

  checkIntersection(pixelX, pixelY) {
    this.raycaster.setFromCamera(this.mouse, this.sceneManager.camera);

    const interactiveObjects = [];
    for (const lm of this.worldBuilder.landmarks) {
      if (lm.isGroup) {
        interactiveObjects.push(...lm.children);
      } else {
        interactiveObjects.push(lm);
      }
    }

    const intersects = this.raycaster.intersectObjects(interactiveObjects, false);

    if (intersects.length > 0) {
      let target = intersects[0].object;
      while (target && !target.userData?.landmarkId && target.parent) {
        target = target.parent;
      }

      if (target && target.userData?.landmarkId) {
        if (this.hoveredLandmark !== target) {
          this.hoveredLandmark = target;
          this.showTooltip(target.userData, pixelX, pixelY);
          if (this.soundManager) this.soundManager.playTick();
        }
        return;
      }
    }

    if (this.hoveredLandmark) {
      this.hoveredLandmark = null;
      this.hideTooltip();
    }
  }

  showTooltip(data, x, y) {
    if (!this.tooltip) return;
    this.tooltipTitle.textContent = data.title;
    this.tooltipDesc.textContent = data.desc;
    this.tooltip.classList.add('visible');
  }

  hideTooltip() {
    if (!this.tooltip) return;
    this.tooltip.classList.remove('visible');
  }

  setupHUDButtons() {
    // 1. Rotate Button (Auto-orbit toggle)
    const rotateBtn = document.getElementById('hudRotateBtn');
    if (rotateBtn) {
      rotateBtn.addEventListener('click', () => {
        const newState = !this.sceneManager.controls.autoRotate;
        this.sceneManager.controls.autoRotate = newState;
        this.sceneManager.isAutoOrbiting = newState;
        if (this.scrollChoreographer) this.scrollChoreographer.isManualOrbit = newState;
        this.updateRotateBtnState(newState);
        if (this.soundManager) this.soundManager.playClick();
      });
    }

    // 2. Pan Button (Shift camera horizontally)
    const panBtn = document.getElementById('hudPanBtn');
    if (panBtn) {
      panBtn.addEventListener('click', () => {
        if (this.scrollChoreographer) this.scrollChoreographer.isManualOrbit = true;
        const curTarget = this.sceneManager.controls.target.clone();
        curTarget.x += 12;
        if (curTarget.x > 35) curTarget.x = -35;
        const curCam = this.sceneManager.camera.position.clone();
        curCam.x += 12;
        if (curCam.x > 35) curCam.x = -35;
        this.sceneManager.transitionCamera(curCam, curTarget, 0.9);
        if (this.soundManager) this.soundManager.playClick();
      });
    }

    // 3. Zoom Button (Toggle Zoom level)
    const zoomBtn = document.getElementById('hudZoomBtn');
    let isZoomedIn = false;
    if (zoomBtn) {
      zoomBtn.addEventListener('click', () => {
        if (this.scrollChoreographer) this.scrollChoreographer.isManualOrbit = true;
        isZoomedIn = !isZoomedIn;
        const dist = isZoomedIn ? 30 : 60;
        const dir = new THREE.Vector3().subVectors(this.sceneManager.camera.position, this.sceneManager.controls.target).normalize();
        const newPos = this.sceneManager.controls.target.clone().add(dir.multiplyScalar(dist));
        this.sceneManager.transitionCamera(newPos, this.sceneManager.controls.target, 0.8);
        zoomBtn.classList.toggle('active', isZoomedIn);
        if (this.soundManager) this.soundManager.playClick();
      });
    }

    // 4. Reset Button
    const resetBtn = document.getElementById('hudResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (this.scrollChoreographer) this.scrollChoreographer.isManualOrbit = false;
        this.sceneManager.resetView();
        this.updateRotateBtnState(false);
        if (this.soundManager) this.soundManager.playClick();
      });
    }
  }

  updateRotateBtnState(isActive) {
    const rotateBtn = document.getElementById('hudRotateBtn');
    if (rotateBtn) {
      rotateBtn.classList.toggle('active', isActive);
    }
  }
}
