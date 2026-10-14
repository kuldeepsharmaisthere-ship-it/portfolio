import * as THREE from 'three';

export class ScrollChoreographer {
  constructor(sceneManager, worldBuilder) {
    this.sceneManager = sceneManager;
    this.worldBuilder = worldBuilder;

    // Define 3D keyframe stages corresponding to page sections
    this.stages = [
      {
        id: 'overview',
        threshold: 0.0,
        pos: new THREE.Vector3(-14, 15, 58),
        look: new THREE.Vector3(0, 5, -15),
        sunTilt: 0.0,
        highwaySpeed: 0.12
      },
      {
        id: 'skills',
        threshold: 0.20,
        pos: new THREE.Vector3(-24, 9, 14),
        look: new THREE.Vector3(-33, 6, -8),
        sunTilt: 0.05,
        highwaySpeed: 0.18
      },
      {
        id: 'projects',
        threshold: 0.42,
        pos: new THREE.Vector3(-6, 11, -8),
        look: new THREE.Vector3(-11, 6, -32),
        sunTilt: -0.05,
        highwaySpeed: 0.24
      },
      {
        id: 'services',
        threshold: 0.64,
        pos: new THREE.Vector3(18, 14, -5),
        look: new THREE.Vector3(28, 11, -25),
        sunTilt: 0.1,
        highwaySpeed: 0.20
      },
      {
        id: 'experience',
        threshold: 0.82,
        pos: new THREE.Vector3(0, 48, 18),
        look: new THREE.Vector3(0, 0, -25),
        sunTilt: 0.0,
        highwaySpeed: 0.30
      },
      {
        id: 'contact',
        threshold: 1.0,
        pos: new THREE.Vector3(0, 16, -30),
        look: new THREE.Vector3(0, 18, -95),
        sunTilt: 0.15,
        highwaySpeed: 0.15
      }
    ];

    // Current interpolation targets
    this.targetPos = new THREE.Vector3().copy(this.stages[0].pos);
    this.targetLook = new THREE.Vector3().copy(this.stages[0].look);
    this.currentLook = new THREE.Vector3().copy(this.stages[0].look);

    // Mouse parallax offsets
    this.mouseOffset = new THREE.Vector2(0, 0);
    this.parallaxStrength = 3.5;

    // Scroll state
    this.scrollProgress = 0;
    this.isManualOrbit = false;

    this.initScrollListener();
    this.initMouseParallax();
  }

  initScrollListener() {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      this.scrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll));

      // If user scrolls, resume scroll-driven choreography
      this.isManualOrbit = false;
      this.sceneManager.controls.autoRotate = false;

      this.updateCameraTargets(this.scrollProgress);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial call
    onScroll();
  }

  initMouseParallax() {
    window.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      this.mouseOffset.x = nx * this.parallaxStrength;
      this.mouseOffset.y = ny * (this.parallaxStrength * 0.6);
    });
  }

  updateCameraTargets(progress) {
    // Find surrounding stages
    let i = 0;
    while (i < this.stages.length - 1 && progress > this.stages[i + 1].threshold) {
      i++;
    }

    const stageA = this.stages[i];
    const stageB = this.stages[Math.min(this.stages.length - 1, i + 1)];

    const span = stageB.threshold - stageA.threshold;
    const localT = span > 0 ? (progress - stageA.threshold) / span : 0;
    const clampedT = Math.min(1, Math.max(0, localT));

    // Smooth cubic ease
    const ease = clampedT < 0.5 ? 4 * clampedT * clampedT * clampedT : 1 - Math.pow(-2 * clampedT + 2, 3) / 2;

    this.targetPos.lerpVectors(stageA.pos, stageB.pos, ease);
    this.targetLook.lerpVectors(stageA.look, stageB.look, ease);
  }

  update(delta) {
    if (this.isManualOrbit) {
      return;
    }

    // Apply mouse parallax to camera position
    const desiredPos = this.targetPos.clone();
    desiredPos.x += this.mouseOffset.x;
    desiredPos.y += this.mouseOffset.y;

    // Smooth lerp camera position and controls target
    this.sceneManager.camera.position.lerp(desiredPos, 0.055);
    this.currentLook.lerp(this.targetLook, 0.055);
    this.sceneManager.controls.target.copy(this.currentLook);
  }
}
