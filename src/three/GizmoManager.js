import * as THREE from 'three';

export class GizmoManager {
  constructor(canvasElement, mainCamera) {
    this.canvas = canvasElement;
    this.mainCamera = mainCamera;
    this.size = 100;

    // Gizmo scene & camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1.8, 1.8, 1.8, -1.8, 0.1, 50);
    this.camera.position.set(0, 0, 10);

    // Renderer for gizmo
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(this.size, this.size);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.buildAxes();
  }

  buildAxes() {
    this.gizmoGroup = new THREE.Group();
    const axisLength = 1.25;

    // X Axis - Red/Orange
    const xGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(axisLength, 0, 0)
    ]);
    const xMat = new THREE.LineBasicMaterial({ color: 0xff7733, linewidth: 2 });
    const xLine = new THREE.Line(xGeo, xMat);
    this.gizmoGroup.add(xLine);

    // Y Axis - Green
    const yGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, axisLength, 0)
    ]);
    const yMat = new THREE.LineBasicMaterial({ color: 0xa3e635, linewidth: 2 });
    const yLine = new THREE.Line(yGeo, yMat);
    this.gizmoGroup.add(yLine);

    // Z Axis - Cyan
    const zGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, axisLength)
    ]);
    const zMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
    const zLine = new THREE.Line(zGeo, zMat);
    this.gizmoGroup.add(zLine);

    // Origin indicator
    const originGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const originMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.gizmoGroup.add(new THREE.Mesh(originGeo, originMat));

    // Axis Arrows
    const arrowX = new THREE.Mesh(
      new THREE.ConeGeometry(0.15, 0.35, 8),
      new THREE.MeshBasicMaterial({ color: 0xff7733 })
    );
    arrowX.rotation.z = -Math.PI / 2;
    arrowX.position.set(axisLength, 0, 0);
    this.gizmoGroup.add(arrowX);

    const arrowY = new THREE.Mesh(
      new THREE.ConeGeometry(0.15, 0.35, 8),
      new THREE.MeshBasicMaterial({ color: 0xa3e635 })
    );
    arrowY.position.set(0, axisLength, 0);
    this.gizmoGroup.add(arrowY);

    const arrowZ = new THREE.Mesh(
      new THREE.ConeGeometry(0.15, 0.35, 8),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    arrowZ.rotation.x = Math.PI / 2;
    arrowZ.position.set(0, 0, axisLength);
    this.gizmoGroup.add(arrowZ);

    this.scene.add(this.gizmoGroup);
  }

  update() {
    // Synchronize rotation with main camera
    this.gizmoGroup.quaternion.copy(this.mainCamera.quaternion).invert();
    this.renderer.render(this.scene, this.camera);
  }
}
