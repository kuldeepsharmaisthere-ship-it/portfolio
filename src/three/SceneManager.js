import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class SceneManager {
  constructor(containerElement) {
    this.container = containerElement;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Core Three.js components
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x1a092c, 0.007);

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(52, this.width / this.height, 0.1, 1200);
    this.defaultCamPos = new THREE.Vector3(-14, 15, 58);
    this.defaultCamTarget = new THREE.Vector3(0, 5, -15);
    this.camera.position.copy(this.defaultCamPos);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;
    this.container.appendChild(this.renderer.domElement);

    // OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.03; // don't go below floor
    this.controls.minDistance = 10;
    this.controls.maxDistance = 160;
    this.controls.target.copy(this.defaultCamTarget);

    // Auto-orbit state (disabled initially in favor of scroll choreography)
    this.isAutoOrbiting = false;
    this.controls.autoRotate = false;
    this.controls.autoRotateSpeed = 0.6;

    // Updatables array for animated objects
    this.updatables = [];

    // Camera animation state
    this.camTransition = null;

    // Setup listeners
    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  addUpdatable(fn) {
    this.updatables.push(fn);
  }

  transitionCamera(targetPos, targetLookAt, duration = 1.2) {
    this.camTransition = {
      startPos: this.camera.position.clone(),
      endPos: targetPos.clone(),
      startLook: this.controls.target.clone(),
      endLook: targetLookAt.clone(),
      progress: 0,
      duration: duration
    };
  }

  resetView() {
    this.transitionCamera(this.defaultCamPos, this.defaultCamTarget, 1.4);
    this.controls.autoRotate = false;
    this.isAutoOrbiting = false;
  }

  render(deltaOrClock, elapsed) {
    let delta = 0.016;
    let elapsedTime = 0;
    if (typeof deltaOrClock === 'number') {
      delta = deltaOrClock;
      elapsedTime = typeof elapsed === 'number' ? elapsed : performance.now() * 0.001;
    } else if (deltaOrClock && typeof deltaOrClock.getDelta === 'function') {
      delta = deltaOrClock.getDelta();
      elapsedTime = deltaOrClock.getElapsedTime();
    }

    // Handle manual transitions
    if (this.camTransition) {
      this.camTransition.progress += delta / this.camTransition.duration;
      const t = Math.min(1, this.camTransition.progress);
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      this.camera.position.lerpVectors(this.camTransition.startPos, this.camTransition.endPos, ease);
      this.controls.target.lerpVectors(this.camTransition.startLook, this.camTransition.endLook, ease);

      if (t >= 1) {
        this.camTransition = null;
      }
    }

    this.controls.update();

    // Update animations
    for (const updateFn of this.updatables) {
      updateFn(delta, elapsedTime);
    }

    this.renderer.render(this.scene, this.camera);
  }
}
