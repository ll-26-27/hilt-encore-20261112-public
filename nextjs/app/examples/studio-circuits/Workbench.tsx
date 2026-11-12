// @ts-nocheck — preserved JavaScript implementation from cv-installation.
'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default function Workbench({ lesson, step, playing, settings, view, resetKey }) {
  const mount = useRef(null);
  const live = useRef({ step, playing, settings });
  const [error, setError] = useState('');
  live.current = { step, playing, settings };

  useEffect(() => {
    const host = mount.current;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false }); }
    catch { setError('3D is unavailable on this device. The numbered wiring steps and connection table below contain the same build instructions.'); return; }
    setError('');
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xf4f4f0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-label', `${lesson.title}: interactive 3D wiring model. Drag to orbit; scroll to zoom. Use the view buttons for fixed camera positions.`);
    renderer.domElement.setAttribute('role', 'img');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
    camera.position.set(...(view === 'top' ? [0, 13, .01] : [7, 9, 11]));
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, .4, 0);
    controls.enableDamping = true;
    controls.minDistance = 6;
    controls.maxDistance = 22;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.enablePan = false;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x9f9f93, 2.8));
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(-3, 8, 5); scene.add(light);
    const grid = new THREE.GridHelper(24, 48, 0xdadad4, 0xe5e5df);
    grid.position.y = -.12; scene.add(grid);
    const stages = Array.from({ length: 5 }, () => new THREE.Group());
    stages.forEach(g => scene.add(g));
    const base = stages[0];
    const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: .65, ...extra });
    function box(group, size, pos, color) {
      const obj = new THREE.Mesh(new THREE.BoxGeometry(...size), mat(color));
      obj.position.set(...pos); group.add(obj); return obj;
    }
    function label(group, text, pos, width = 1.3, color = '#111111') {
      const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 100;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 512, 100);
      ctx.fillStyle = color; ctx.font = '600 42px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(text, 256, 50);
      const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: false }));
      sprite.position.set(...pos); sprite.scale.set(width, width / 5.12, 1); group.add(sprite);
    }
    function wire(group, points, color = 0x202020, radius = .035) {
      const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
      const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, radius, 8, false), mat(color));
      group.add(mesh); return mesh;
    }
    // This is an intentionally spaced schematic, not a dimensional UNO replica.
    box(base, [2.3, .16, 3.1], [-3.1, .12, 0], 0x1947e5);
    box(base, [.68, .28, 1.05], [-3.1, .35, 0], 0x171717);
    box(base, [.8, .45, .65], [-3.1, .35, 1.35], 0xb5b7bb);
    for (let i = 0; i < 10; i++) {
      for (const x of [-4.05, -2.15]) box(base, [.16, .25, .16], [x, .3, -1.15 + i * .24], 0x171717);
    }
    label(base, 'UNO · reference', [-3.1, .3, -1.95], 2.1);
    label(base, 'USB', [-3.1, .25, 2.0], .7);
    const signal = [-2.15, .47, -.65];
    const ground = [-2.15, .47, .8];
    label(base, lesson.id === 'blink' ? 'D9' : 'D6', [-1.82, .65, -.8], .55, '#1645ed');
    label(base, 'GND', [-1.72, .65, 1], .7);
    const pixels = [];
    function pixel(group, pos, radius = .115) {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 12), mat(0xf2f2ed, { emissive: 0x000000 }));
      mesh.position.set(...pos); group.add(mesh); pixels.push(mesh); return mesh;
    }
    if (lesson.id === 'blink') {
      box(base, [4.8, .23, 2.85], [1.1, .14, 0], 0xffffff);
      box(base, [4.5, .015, .16], [1.1, .266, 0], 0xd4d4ce);
      // Thirty numbered rows; a–e and f–j are separated by the trench.
      const hole = (row, col) => [-.9 + (row - 1) * .14, .28, -.87 + col * .16 + (col >= 5 ? .3 : 0)];
      for (let row = 1; row <= 30; row++) for (let col = 0; col < 10; col++) {
        const p = hole(row, col);
        box(base, [.055, .018, .055], p, 0x73736c);
      }
      [8, 12, 16].forEach(row => {
        const p = hole(row, 0);
        label(base, String(row), [p[0], .4, -1.35], .4);
        box(base, [.09, .012, .76], [p[0], .277, -.55], 0xf5d92c);
      });
      for (const z of [-1.25, -1.08, 1.08, 1.25]) for (let row = 1; row <= 30; row++) {
        const x = -.9 + (row - 1) * .14;
        box(base, [.04, .018, .04], [x, .28, z], 0x73736c);
      }
      for (let col = 0; col < 10; col++) {
        const p = hole(1, col);
        label(base, 'abcdefghij'[col], [-1.3, .4, p[2]], .22);
      }
      label(base, 'a–e: each numbered row is connected', [1.1, .2, -2], 3.1);
      label(base, '30-ROW BREADBOARD', [1.1, .2, 1.65], 1.9);
      wire(stages[1], [signal, [-1.5, 1.3, -1], hole(8, 0)], 0x1645ed);
      const r1 = hole(8, 4), r2 = hole(12, 4);
      wire(stages[2], [r1, [r1[0], .55, r1[2]], [r2[0], .55, r2[2]], r2], 0x8c8c84, .018);
      box(stages[2], [.5, .16, .17], [(r1[0] + r2[0]) / 2, .55, r1[2]], 0xdcc5a0);
      label(stages[2], '330 Ω', [.98, 1, -.65], .8);
      const anode = hole(12, 2), cathode = hole(16, 2);
      const center = [(anode[0] + cathode[0]) / 2, .95, anode[2]];
      wire(stages[2], [anode, [anode[0], .7, anode[2]], center], 0x999999, .018);
      wire(stages[2], [cathode, [cathode[0], .7, cathode[2]], center], 0x999999, .018);
      pixel(stages[2], center, .19);
      label(stages[2], 'LED +12 / −16', [2.6, 1.35, -.45], 1.55);
      wire(stages[3], [hole(16, 0), [2.6, .8, -1.55], [-1, .8, -1.65], [-1.3, .8, 1], ground], 0x202020);
    } else {
      const triangle = lesson.id === 'object';
      const vertices = triangle ? [[.2, .55, .7], [2.5, 3.8, .7], [4.8, .55, .7], [.2, .55, .7]] : null;
      let positions = [];
      if (triangle) {
        for (let side = 0; side < 3; side++) {
          wire(base, [vertices[side], vertices[side + 1]], 0x242424, .09);
          for (let i = 0; i < 8; i++) {
            const p = new THREE.Vector3(...vertices[side]).lerp(new THREE.Vector3(...vertices[side + 1]), i / 8);
            p.z += .12; positions.push(p.toArray());
          }
        }
        box(base, [5, .18, 1.25], [2.5, .12, .7], 0xe5e2d9);
      } else {
        box(base, [5.1, .1, .42], [1.85, .35, -.7], 0x222222);
        positions = Array.from({ length: 8 }, (_, i) => [-.3 + i * .61, .45, -.7]);
      }
      positions.forEach(p => pixel(base, p));
      const start = positions[0];
      const din = [start[0] - .12, start[1], start[2] - .18];
      const gnd = [start[0] - .12, start[1], start[2] + .18];
      const plus = [start[0] - .12, start[1], start[2]];
      label(base, 'DIN →', [start[0] + .1, start[1] + .55, start[2] - .3], .85, '#1645ed');
      label(base, triangle ? '24 PIXELS · 8 / SIDE' : '8 ADDRESSABLE PIXELS', [2.2, .25, -2.1], 2.7);
      box(base, [2.2, .55, 1.0], [1.8, .3, 2.8], 0x292929);
      label(base, '5V DC · external supply', [1.8, .95, 2.9], 2.5);
      const supplyMinus = [.95, .6, 2.3], supplyPlus = [2.6, .6, 2.3];
      wire(stages[1], [ground, [-1, .55, 2], supplyMinus], 0x222222);
      wire(stages[1], [supplyMinus, [-.7, .55, 1.8], gnd], 0x222222);
      label(stages[1], 'GND', [-.3, .7, 1.85], .8);
      wire(stages[2], [signal, [-1.2, 1.1, -.8], din], 0x1645ed);
      box(stages[2], [.42, .15, .18], [din[0] - .2, din[1] + .12, din[2]], 0xdcc5a0);
      label(stages[2], '330 Ω → DIN', [-.6, 1.6, -.9], 1.5);
      wire(stages[3], [supplyPlus, [3.8, .6, 1.9], [3.8, .6, -.1], plus], 0xe52b20);
      label(stages[3], '+5V', [3.6, .8, 1.8], .7, '#ba2015');
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(.17, .17, .5, 20), mat(0x202020));
      cap.position.set(.3, .6, 2.4); stages[3].add(cap);
      wire(stages[3], [[.2, .4, 2.4], supplyMinus], 0x222222, .02);
      wire(stages[3], [[.4, .4, 2.4], [.6, .3, 2], supplyPlus], 0xe52b20, .02);
      label(stages[3], '1000 µF · − / +', [.3, 1.15, 2.4], 1.65);
    }
    const resize = new ResizeObserver(() => {
      const w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
    });
    resize.observe(host);
    let frame, time = 0, last = performance.now();
    function animate(now) {
      const { step: active, playing: running, settings: s } = live.current;
      if (running && active === 4) time += Math.min(now - last, 100);
      last = now;
      const phase = (time % s.tempo) / s.tempo;
      stages.forEach((g, i) => { g.visible = i <= active; });
      pixels.forEach((p, i) => {
        const isOn = active === 4 && running;
        const amount = !isOn ? 0 : lesson.id !== 'blink' && s.pattern === 'chase' ? (i === Math.floor(phase * pixels.length) ? 1 : 0) : (1 - Math.cos(phase * Math.PI * 2)) / 2;
        const color = lesson.id === 'blink' ? '#e52b20' : s.color;
        p.material.color.set(amount > .02 ? color : '#e5e5de');
        p.material.emissive.set(color); p.material.emissiveIntensity = amount * s.brightness / 100 * 3;
      });
      controls.update(); renderer.render(scene, camera); frame = requestAnimationFrame(animate);
    }
    const contextLost = event => { event.preventDefault(); setError('The 3D context was interrupted. Try Reset view, or continue with the wiring table.'); };
    renderer.domElement.addEventListener('webglcontextlost', contextLost);
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame); resize.disconnect(); controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      scene.traverse(o => {
        o.geometry?.dispose();
        if (o.material) { const mats = Array.isArray(o.material) ? o.material : [o.material]; mats.forEach(m => { m.map?.dispose(); m.dispose(); }); }
      });
      renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    };
  }, [lesson.id, view, resetKey]);

  return <div className="il-scene-wrap"><div ref={mount} className="il-scene" />{error && <p role="status" className="il-scene-error">{error}</p>}<div className="il-scene-caption"><span className="il-dot" />3D wiring study <span>Illustrative pin positions · follow labels</span></div></div>;
}
