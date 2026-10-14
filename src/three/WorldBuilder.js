import * as THREE from 'three';

export class WorldBuilder {
  constructor(scene, sceneManager) {
    this.scene = scene;
    this.sceneManager = sceneManager;
    this.landmarks = []; // Raycastable interactive objects

    this.buildLighting();
    this.buildSkyBackdrop();
    this.buildGroundGrid();
    this.buildCelestialSunAndRings();
    this.buildTemple();
    this.buildPyramids();
    this.buildCyberCity();
    this.buildLaserHighway();
    this.buildDistantMountains();
  }

  buildLighting() {
    // Ambient synthwave violet fill
    const ambientLight = new THREE.AmbientLight(0x351654, 1.2);
    this.scene.add(ambientLight);

    // Warm sun directional light
    const sunLight = new THREE.DirectionalLight(0xffaa44, 2.4);
    sunLight.position.set(0, 30, -80);
    this.scene.add(sunLight);

    // Accent colored point lights for cyber highlights
    const templeLight = new THREE.PointLight(0xff7733, 2.5, 50);
    templeLight.position.set(-30, 8, -10);
    this.scene.add(templeLight);

    const cityLight = new THREE.PointLight(0x00f0ff, 3.0, 60);
    cityLight.position.set(28, 12, -25);
    this.scene.add(cityLight);

    const pyramidLight = new THREE.PointLight(0xffaa00, 2.2, 50);
    pyramidLight.position.set(-8, 10, -32);
    this.scene.add(pyramidLight);
  }

  buildSkyBackdrop() {
    // Synthwave Sunset Sky Cylinder / Dome
    const skyGeo = new THREE.CylinderGeometry(180, 180, 140, 32, 1, true);
    
    // Shader with horizontal gradient from deep indigo -> magenta -> neon orange -> amber horizon
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        colorTop: { value: new THREE.Color(0x0a0318) },
        colorMidHigh: { value: new THREE.Color(0x3a0c54) },
        colorMid: { value: new THREE.Color(0xd92676) },
        colorLow: { value: new THREE.Color(0xff6e30) },
        colorBottom: { value: new THREE.Color(0xffaa00) }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vWorldPosition;
        uniform vec3 colorTop;
        uniform vec3 colorMidHigh;
        uniform vec3 colorMid;
        uniform vec3 colorLow;
        uniform vec3 colorBottom;

        void main() {
          float h = clamp((vWorldPosition.y + 10.0) / 90.0, 0.0, 1.0);
          vec3 col;
          if (h < 0.25) {
            col = mix(colorBottom, colorLow, h / 0.25);
          } else if (h < 0.55) {
            col = mix(colorLow, colorMid, (h - 0.25) / 0.30);
          } else if (h < 0.8) {
            col = mix(colorMid, colorMidHigh, (h - 0.55) / 0.25);
          } else {
            col = mix(colorMidHigh, colorTop, (h - 0.8) / 0.20);
          }
          // Subtle scanline pattern
          float scanline = sin(vWorldPosition.y * 1.8) * 0.04;
          gl_FragColor = vec4(col + scanline, 1.0);
        }
      `
    });

    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    skyMesh.position.set(0, 35, 0);
    this.scene.add(skyMesh);
  }

  buildGroundGrid() {
    // Custom neon perspective grid
    const gridHelper = new THREE.GridHelper(260, 65, 0xff7733, 0x481b66);
    gridHelper.position.set(0, 0, 0);
    this.scene.add(gridHelper);

    // Glowing base plane under grid for subtle neon sheen
    const groundGeo = new THREE.PlaneGeometry(260, 260);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x090414,
      roughness: 0.3,
      metalness: 0.7
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    this.scene.add(ground);
  }

  buildCelestialSunAndRings() {
    const sunGroup = new THREE.Group();
    sunGroup.position.set(0, 18, -95);

    // 1. Wireframe Sun Sphere (Warm amber/golden neon)
    const sunGeo = new THREE.SphereGeometry(22, 28, 20);
    const sunWireMat = new THREE.MeshBasicMaterial({
      color: 0xffaa22,
      wireframe: true,
      transparent: true,
      opacity: 0.88
    });
    const sunWire = new THREE.Mesh(sunGeo, sunWireMat);
    sunGroup.add(sunWire);

    // 2. Inner Glowing Sun Core
    const sunCoreGeo = new THREE.SphereGeometry(21.4, 32, 32);
    const sunCoreMat = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0xff8800) },
        innerColor: { value: new THREE.Color(0xffe600) }
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 glowColor;
        uniform vec3 innerColor;
        void main() {
          float intensity = pow(0.75 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          vec3 col = mix(innerColor, glowColor, intensity);
          gl_FragColor = vec4(col, 0.92);
        }
      `,
      transparent: true
    });
    const sunCore = new THREE.Mesh(sunCoreGeo, sunCoreMat);
    sunGroup.add(sunCore);

    // 3. Planetary Rings (Outrun Saturn-style)
    const ringGroup = new THREE.Group();
    ringGroup.rotation.x = 0.55;
    ringGroup.rotation.z = -0.25;

    // Outer wireframe ring
    const ringGeo = new THREE.RingGeometry(27, 36, 48, 4);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff4da6,
      wireframe: true,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ringGroup.add(ring);

    // Secondary inner bright ring strip
    const innerRingGeo = new THREE.RingGeometry(38, 41, 64);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = Math.PI / 2;
    ringGroup.add(innerRing);

    // Planetary Dust Particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 28 + Math.random() * 14;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffe066,
      size: 0.6,
      transparent: true,
      opacity: 0.8
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    ringGroup.add(particles);

    sunGroup.add(ringGroup);
    this.scene.add(sunGroup);

    // Landmark metadata
    sunWire.userData = {
      landmarkId: 'sun',
      title: 'Creative Engineering Core',
      desc: '3D WebGL, custom GLSL shaders, and visual computing innovations.',
      targetCamPos: new THREE.Vector3(0, 16, -45),
      targetLookAt: new THREE.Vector3(0, 18, -95),
      sectionAnchor: '#services'
    };
    this.landmarks.push(sunWire);

    // Animate rotation in render loop
    this.sceneManager.addUpdatable((delta, time) => {
      sunWire.rotation.y = time * 0.05;
      ringGroup.rotation.y = time * 0.08;
    });
  }

  buildTemple() {
    // Greco-Roman Classical Temple on the left
    const templeGroup = new THREE.Group();
    templeGroup.position.set(-33, 0, -8);

    const wireMatAmber = new THREE.MeshBasicMaterial({
      color: 0xffaa33,
      wireframe: true
    });
    const wireMatOrange = new THREE.MeshBasicMaterial({
      color: 0xff6622,
      wireframe: true
    });
    const edgeColor = 0xffaa33;

    // 1. Stepped Base (Stylobate)
    const base1 = new THREE.Mesh(new THREE.BoxGeometry(22, 1.2, 34), wireMatOrange);
    base1.position.y = 0.6;
    templeGroup.add(base1);

    const base2 = new THREE.Mesh(new THREE.BoxGeometry(20, 1.2, 32), wireMatAmber);
    base2.position.y = 1.8;
    templeGroup.add(base2);

    // 2. Colonnade Columns (Peristyle)
    const columnGeo = new THREE.CylinderGeometry(0.7, 0.7, 10, 8);
    const colZPositions = [-12, -7.2, -2.4, 2.4, 7.2, 12];
    const colXPositions = [-8, 8];

    // Perimeter columns
    for (const x of colXPositions) {
      for (const z of colZPositions) {
        const col = new THREE.Mesh(columnGeo, wireMatAmber);
        col.position.set(x, 7.4, z);
        templeGroup.add(col);

        // Column Capital and Base blocks
        const cap = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.4, 1.8), wireMatAmber);
        cap.position.set(x, 12.4, z);
        templeGroup.add(cap);
      }
    }
    // Front and back interior row columns
    for (const x of [-3.2, 3.2]) {
      for (const z of [-12, 12]) {
        const col = new THREE.Mesh(columnGeo, wireMatAmber);
        col.position.set(x, 7.4, z);
        templeGroup.add(col);
      }
    }

    // 3. Entablature (Horizontal Architrave beam)
    const beam = new THREE.Mesh(new THREE.BoxGeometry(19.6, 1.4, 31.6), wireMatAmber);
    beam.position.y = 13.3;
    templeGroup.add(beam);

    // 4. Triangular Pediment Roof
    // Use a custom prism geometry for triangular pediment
    const roofGeo = new THREE.ConeGeometry(12, 4.5, 4);
    const roof = new THREE.Mesh(roofGeo, wireMatOrange);
    roof.rotation.y = Math.PI / 4;
    roof.scale.set(1.2, 1, 2.2);
    roof.position.set(0, 16.2, 0);
    templeGroup.add(roof);

    // Internal cella / sanctuary chamber
    const cella = new THREE.Mesh(new THREE.BoxGeometry(10, 8.5, 18), new THREE.MeshBasicMaterial({
      color: 0x240d3a,
      wireframe: true
    }));
    cella.position.set(0, 6.8, 0);
    templeGroup.add(cella);

    this.scene.add(templeGroup);

    // Register interactive landmark
    templeGroup.userData = {
      landmarkId: 'temple',
      title: 'Greco-Roman Architecture Temple',
      desc: 'Solid software foundations, resilient system designs, and classical computational principles.',
      targetCamPos: new THREE.Vector3(-24, 12, 14),
      targetLookAt: new THREE.Vector3(-33, 7, -8),
      sectionAnchor: '#skills'
    };
    this.landmarks.push(templeGroup);
  }

  buildPyramids() {
    // 1. Central Stepped Pyramid (Matches screenshot center-left pyramid)
    const pyrGroup = new THREE.Group();
    pyrGroup.position.set(-11, 0, -32);

    const wireMatGold = new THREE.MeshBasicMaterial({
      color: 0xffb833,
      wireframe: true
    });
    const wireMatAmber = new THREE.MeshBasicMaterial({
      color: 0xff7722,
      wireframe: true
    });

    // Stepped tiers
    const tiers = [
      { w: 20, h: 2.2, y: 1.1 },
      { w: 16, h: 2.2, y: 3.3 },
      { w: 12, h: 2.2, y: 5.5 },
      { w: 8,  h: 2.2, y: 7.7 }
    ];

    for (const t of tiers) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(t.w, t.h, t.w), wireMatAmber);
      step.position.y = t.y;
      pyrGroup.add(step);
    }

    // Smooth pyramid atop tiers
    const capGeo = new THREE.ConeGeometry(5, 5, 4);
    const cap = new THREE.Mesh(capGeo, wireMatGold);
    cap.rotation.y = Math.PI / 4;
    cap.position.y = 11.2;
    pyrGroup.add(cap);

    // Levitating glowing capstone
    const apexGeo = new THREE.ConeGeometry(1.6, 2.2, 4);
    const apexMat = new THREE.MeshBasicMaterial({
      color: 0xfff066,
      wireframe: true
    });
    const apex = new THREE.Mesh(apexGeo, apexMat);
    apex.rotation.y = Math.PI / 4;
    apex.position.y = 14.8;
    pyrGroup.add(apex);

    this.scene.add(pyrGroup);

    // Landmark definition
    pyrGroup.userData = {
      landmarkId: 'pyramid',
      title: 'Featured Projects Monolith',
      desc: 'Proven monuments of full-cycle engineering: distributed SaaS, real-time pipelines, and 3D graphics.',
      targetCamPos: new THREE.Vector3(-4, 11, -12),
      targetLookAt: new THREE.Vector3(-11, 7, -32),
      sectionAnchor: '#projects'
    };
    this.landmarks.push(pyrGroup);

    // 2. Secondary smooth pyramid (in the middle ground)
    const pyr2Group = new THREE.Group();
    pyr2Group.position.set(7, 0, -26);

    const smoothPyrGeo = new THREE.ConeGeometry(6.5, 9.5, 4);
    const smoothPyr = new THREE.Mesh(smoothPyrGeo, wireMatGold);
    smoothPyr.rotation.y = Math.PI / 4;
    smoothPyr.position.y = 4.75;
    pyr2Group.add(smoothPyr);

    // Stepped platform base
    const pyr2Base = new THREE.Mesh(new THREE.BoxGeometry(11, 1.0, 11), wireMatAmber);
    pyr2Base.position.y = 0.5;
    pyr2Group.add(pyr2Base);

    this.scene.add(pyr2Group);

    // Animate levitating apex
    this.sceneManager.addUpdatable((delta, time) => {
      apex.position.y = 14.8 + Math.sin(time * 2.2) * 0.45;
      apex.rotation.y = time * 0.8;
    });
  }

  buildCyberCity() {
    // Cyberpunk Skyscrapers & High-Rise Monoliths on the Right (Matches screenshot)
    const cityGroup = new THREE.Group();
    cityGroup.position.set(28, 0, -25);

    const buildingsData = [
      { x: 0,   z: 0,   w: 5,  d: 6,  h: 24, col: 0xffaa00, accent: 0xff007f },
      { x: 8,   z: -8,  w: 6,  d: 6,  h: 32, col: 0x38bdf8, accent: 0xffaa00 },
      { x: -5,  z: 5,   w: 4,  d: 4,  h: 16, col: 0xff2d87, accent: 0x38bdf8 },
      { x: 10,  z: 4,   w: 5,  d: 5,  h: 20, col: 0xffaa00, accent: 0xff2d87 },
      { x: 2,   z: -14, w: 7,  d: 7,  h: 36, col: 0x38bdf8, accent: 0x00f0ff },
      { x: -8,  z: -6,  w: 4,  d: 5,  h: 18, col: 0xffaa00, accent: 0xff007f }
    ];

    for (const b of buildingsData) {
      const bGroup = new THREE.Group();
      bGroup.position.set(b.x, 0, b.z);

      // Main tower body
      const towerGeo = new THREE.BoxGeometry(b.w, b.h, b.d);
      const towerMat = new THREE.MeshBasicMaterial({
        color: b.col,
        wireframe: true
      });
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.y = b.h / 2;
      bGroup.add(tower);

      // Lit Cyber Matrix Windows (Stripes of glowing neon rectangles)
      const windowRows = Math.floor(b.h / 2.2);
      for (let r = 2; r < windowRows; r++) {
        // Randomly skip some windows to create authentic occupied skyline pattern
        if (Math.random() > 0.3) {
          const winGeo = new THREE.PlaneGeometry(b.w * 0.82, 0.7);
          const winCol = (r % 3 === 0) ? 0xfff066 : (r % 2 === 0 ? 0x38bdf8 : 0xff2d87);
          const winMat = new THREE.MeshBasicMaterial({
            color: winCol,
            side: THREE.DoubleSide
          });
          const winFront = new THREE.Mesh(winGeo, winMat);
          winFront.position.set(0, r * 2.2, b.d / 2 + 0.05);
          bGroup.add(winFront);
        }
      }

      // Tower Spire / Antennas
      const spireGeo = new THREE.CylinderGeometry(0.08, 0.25, 4.5, 6);
      const spireMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const spire = new THREE.Mesh(spireGeo, spireMat);
      spire.position.set(0, b.h + 2.25, 0);
      bGroup.add(spire);

      // Pulsing beacon on top
      const beaconGeo = new THREE.SphereGeometry(0.35, 8, 8);
      const beaconMat = new THREE.MeshBasicMaterial({ color: b.accent });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(0, b.h + 4.5, 0);
      bGroup.add(beacon);

      cityGroup.add(bGroup);
    }

    this.scene.add(cityGroup);

    // Landmark definition
    cityGroup.userData = {
      landmarkId: 'city',
      title: 'Cloud & Distributed Systems Monolith',
      desc: 'High-availability microservices, Kubernetes clusters, event-driven backends, and low-latency APIs.',
      targetCamPos: new THREE.Vector3(18, 14, -5),
      targetLookAt: new THREE.Vector3(28, 12, -25),
      sectionAnchor: '#projects'
    };
    this.landmarks.push(cityGroup);
  }

  buildLaserHighway() {
    // Sinuous glowing curved laser highway / ribbon path weaving through the landscape
    const points = [
      new THREE.Vector3(-22, 0.4, 25),
      new THREE.Vector3(-14, 0.5, 12),
      new THREE.Vector3(-2, 0.6, 2),
      new THREE.Vector3(6, 0.8, -8),
      new THREE.Vector3(2, 1.2, -18),
      new THREE.Vector3(-4, 1.5, -26),
      new THREE.Vector3(2, 2.0, -38),
      new THREE.Vector3(14, 3.2, -46),
      new THREE.Vector3(22, 4.5, -55)
    ];

    this.highwayCurve = new THREE.CatmullRomCurve3(points);

    // 1. Highway Tube
    const tubeGeo = new THREE.TubeGeometry(this.highwayCurve, 120, 0.45, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      wireframe: false
    });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    this.scene.add(tube);

    // 2. Highway Wireframe Outer Glow Rails
    const outerTubeGeo = new THREE.TubeGeometry(this.highwayCurve, 120, 0.8, 6, false);
    const outerTubeMat = new THREE.MeshBasicMaterial({
      color: 0xff3b77,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const outerTube = new THREE.Mesh(outerTubeGeo, outerTubeMat);
    this.scene.add(outerTube);

    // 3. Animated Energy Photon Orb traveling along the highway!
    const orbGeo = new THREE.SphereGeometry(0.7, 16, 16);
    const orbMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.highwayOrb = new THREE.Mesh(orbGeo, orbMat);
    this.scene.add(this.highwayOrb);

    const orbLight = new THREE.PointLight(0xffea00, 3.5, 16);
    this.highwayOrb.add(orbLight);

    // Update energy orb position on path
    this.sceneManager.addUpdatable((delta, time) => {
      const progress = (time * 0.12) % 1.0;
      const pos = this.highwayCurve.getPointAt(progress);
      this.highwayOrb.position.copy(pos);
      this.highwayOrb.position.y += 0.4;
    });

    tube.userData = {
      landmarkId: 'highway',
      title: 'Streaming Pipeline & Telemetry Highway',
      desc: 'Real-time WebSocket event pipelines, distributed pub-sub messaging, and low-latency data streaming.',
      targetCamPos: new THREE.Vector3(0, 6, 16),
      targetLookAt: new THREE.Vector3(2, 1.2, -18),
      sectionAnchor: '#services'
    };
    this.landmarks.push(tube);
  }

  buildDistantMountains() {
    // Low-poly wireframe mountain silhouettes on the distant horizon
    const mountGeo = new THREE.PlaneGeometry(240, 36, 32, 8);
    const pos = mountGeo.attributes.position;

    // Displace vertices to create jagged peaks
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      if (y > -10) {
        const noise = Math.sin(x * 0.08) * 6 + Math.cos(x * 0.18) * 4 + Math.sin(x * 0.35) * 2;
        pos.setY(i, y + Math.max(0, noise));
      }
    }
    mountGeo.computeVertexNormals();

    const mountMat = new THREE.MeshBasicMaterial({
      color: 0x7c2d99,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });

    const mountains = new THREE.Mesh(mountGeo, mountMat);
    mountains.position.set(0, 10, -98);
    this.scene.add(mountains);
  }
}
