"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

export interface D20DiceProps {
  size?: number;
  numberColor?: string;
  edgeColor?: string;
  edgeWidth?: number;
  faceColor?: string;
  faceTexture?: string;
  backgroundColor?: string;
  backgroundTexture?: string;
  faceOpacity?: number;
  metalness?: number;
  roughness?: number;
  /** Seconds after settling before idle spin resumes. Default: 4 */
  idleDelay?: number;
  onRollComplete?: (result: number) => void;
  className?: string;
}

interface DiceState {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  mesh: THREE.Mesh;
  animId: number;
  phase: "idle" | "rolling" | "snapping" | "settled";
  spinDecay: number;
  velX: number;
  velY: number;
  velZ: number;
  snapTarget: THREE.Quaternion | null;
  idleTimeout: ReturnType<typeof setTimeout> | null;
  rollTimeout: ReturnType<typeof setTimeout> | null;
}

// ─── Face normals ─────────────────────────────────────────────────────────────

function computeFaceNormals(): THREE.Vector3[] {
  const indexed = new THREE.IcosahedronGeometry(1, 0);
  const geo = indexed.toNonIndexed();
  indexed.dispose();
  const pos = geo.attributes.position;
  const normals: THREE.Vector3[] = [];
  for (let i = 0; i < 20; i++) {
    const b = i * 3;
    normals.push(
      new THREE.Vector3(
        (pos.getX(b) + pos.getX(b + 1) + pos.getX(b + 2)) / 3,
        (pos.getY(b) + pos.getY(b + 1) + pos.getY(b + 2)) / 3,
        (pos.getZ(b) + pos.getZ(b + 1) + pos.getZ(b + 2)) / 3,
      ).normalize()
    );
  }
  geo.dispose();
  return normals;
}

const FACE_NORMALS = computeFaceNormals();

// ─── Texture ──────────────────────────────────────────────────────────────────

function makeNumberTexture(num: number, numberColor: string, faceColor: string): THREE.CanvasTexture {
  const S = 512;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = faceColor;
  ctx.fillRect(0, 0, S, S);

  const cx = S * 0.5;
  const cy = S * 0.62;
  const fontSize = Math.round(S * 0.35);

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = numberColor;
  ctx.font = `bold ${fontSize}px Georgia, 'Times New Roman', serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(num.toString(), cx, cy);
  ctx.restore();

  if (num === 6 || num === 9) {
    ctx.font = `bold ${fontSize}px Georgia, 'Times New Roman', serif`;
    const hw = ctx.measureText(num.toString()).width / 2;
    const uy = cy + fontSize * 0.6;
    ctx.strokeStyle = numberColor;
    ctx.lineWidth = Math.max(2, fontSize * 0.07);
    ctx.beginPath();
    ctx.moveTo(cx - hw, uy);
    ctx.lineTo(cx + hw, uy);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ─── Geometry ─────────────────────────────────────────────────────────────────

function buildGeometry(radius: number): THREE.BufferGeometry {
  const indexed = new THREE.IcosahedronGeometry(radius, 0);
  const geo = indexed.toNonIndexed();
  indexed.dispose();
  geo.computeVertexNormals();
  for (let i = 0; i < 20; i++) geo.addGroup(i * 3, 3, i);
  const uv = new Float32Array(60 * 2);
  for (let i = 0; i < 20; i++) {
    const b = i * 6;
    uv[b]     = 0.0; uv[b + 1] = 0.0;
    uv[b + 2] = 1.0; uv[b + 3] = 0.0;
    uv[b + 4] = 0.5; uv[b + 5] = 1.0;
  }
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return geo;
}

// ─── Snap quaternion (face → camera) ─────────────────────────────────────────

function computeSnapQuaternion(mesh: THREE.Mesh): THREE.Quaternion {
  const camDir = new THREE.Vector3(0, 0, 1);

  let bestDot = -Infinity;
  let bestNormal = FACE_NORMALS[0].clone();
  for (const fn of FACE_NORMALS) {
    const wn  = fn.clone().applyQuaternion(mesh.quaternion);
    const dot = wn.dot(camDir);
    if (dot > bestDot) { bestDot = dot; bestNormal = wn.clone(); }
  }

  const Q1 = new THREE.Quaternion().setFromUnitVectors(bestNormal, camDir);
  return Q1.multiply(mesh.quaternion);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function D20Dice({
  size            = 300,
  numberColor     = "#ffffff",
  edgeColor       = "#8b5cf6",
  edgeWidth       = 1.5,
  faceColor       = "#1e1b4b",
  faceTexture,
  backgroundColor = "transparent",
  backgroundTexture,
  faceOpacity     = 1,
  metalness       = 0.3,
  roughness       = 0.4,
  idleDelay       = 4,
  onRollComplete,
  className,
}: D20DiceProps) {
  const mountRef          = useRef<HTMLDivElement>(null);
  const stateRef          = useRef<DiceState | null>(null);
  const onRollCompleteRef = useRef(onRollComplete);
  useEffect(() => { onRollCompleteRef.current = onRollComplete; }, [onRollComplete]);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;

    // ── Camera + radius tuned so die fills ~85% of canvas ──────────────────
    // FOV 22° at distance 5 → visible half-height = 5 * tan(11°) ≈ 0.975
    // radius 0.9 fills ~92% of that → perfect snug fit with room for edges
    const FOV    = 22;
    const DIST   = 5;
    const RADIUS = 0.9;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: backgroundColor === "transparent" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    if (backgroundColor !== "transparent") scene.background = new THREE.Color(backgroundColor);
    if (backgroundTexture) new THREE.TextureLoader().load(backgroundTexture, (t) => { scene.background = t; });

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dir = new THREE.DirectionalLight(0xffffff, 1.4);
    dir.position.set(5, 8, 5);
    dir.castShadow = true;
    scene.add(dir);
    const rim = new THREE.PointLight(0x7c3aed, 1.0, 20);
    rim.position.set(-4, -3, 2);
    scene.add(rim);

    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
    camera.position.set(0, 0, DIST);

    const diceNumbers = [1,19,3,17,7,9,13,15,10,16,4,18,2,20,14,11,5,12,8,6];
    const geo = buildGeometry(RADIUS);
    const materials = diceNumbers.map((n) =>
      new THREE.MeshStandardMaterial({
        map: makeNumberTexture(n, numberColor, faceColor),
        transparent: faceOpacity < 1,
        opacity: faceOpacity,
        metalness,
        roughness,
        side: THREE.FrontSide,
      })
    );
    const mesh = new THREE.Mesh(geo, materials);
    scene.add(mesh);

    if (edgeWidth > 0) {
      const eg = new THREE.EdgesGeometry(geo);
      const em = new THREE.LineBasicMaterial({ color: new THREE.Color(edgeColor), transparent: true, opacity: 0.9 });
      mesh.add(new THREE.LineSegments(eg, em));
    }

    const state: DiceState = {
      renderer, scene, camera, mesh,
      animId: -1,
      phase: "idle",
      spinDecay: 1,
      velX: 0.003, velY: 0.005, velZ: 0.002,
      snapTarget: null,
      idleTimeout: null,
      rollTimeout: null,
    };
    stateRef.current = state;

    const SNAP_SPEED = 0.08;

    const animate = () => {
      state.animId = requestAnimationFrame(animate);
      const s = state;

      if (s.phase === "snapping" && s.snapTarget) {
        mesh.quaternion.slerp(s.snapTarget, SNAP_SPEED);
        if (mesh.quaternion.angleTo(s.snapTarget) < 0.004) {
          mesh.quaternion.copy(s.snapTarget);
          s.snapTarget = null;
          s.phase = "settled";

          // Schedule idle resume
          if (s.idleTimeout) clearTimeout(s.idleTimeout);
          s.idleTimeout = setTimeout(() => {
            if (stateRef.current?.phase === "settled") {
              stateRef.current.velX = 0.003;
              stateRef.current.velY = 0.005;
              stateRef.current.velZ = 0.002;
              stateRef.current.phase = "idle";
            }
          }, idleDelay * 1000);
        }

      } else if (s.phase === "rolling") {
        mesh.rotation.x += s.velX;
        mesh.rotation.y += s.velY;
        mesh.rotation.z += s.velZ;

        s.velX *= s.spinDecay;
        s.velY *= s.spinDecay;
        s.velZ *= s.spinDecay;
        s.spinDecay *= 0.9925;

        const speed = Math.abs(s.velX) + Math.abs(s.velY) + Math.abs(s.velZ);
        if (speed < 0.001) {
          s.velX = 0; s.velY = 0; s.velZ = 0;
          s.snapTarget = computeSnapQuaternion(mesh);
          s.phase = "snapping";
        }

      } else if (s.phase === "idle") {
        mesh.rotation.x += s.velX;
        mesh.rotation.y += s.velY;
      }
      // phase === "settled" → nothing moves

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(state.animId);
      if (state.rollTimeout) clearTimeout(state.rollTimeout);
      if (state.idleTimeout) clearTimeout(state.idleTimeout);
      mesh.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => { (m as THREE.MeshStandardMaterial).map?.dispose(); m.dispose(); });
          obj.geometry.dispose();
        }
      });
      renderer.dispose();
      el.innerHTML = "";
      stateRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, numberColor, faceColor, edgeColor, edgeWidth, faceTexture, faceOpacity, metalness, roughness, backgroundColor, backgroundTexture, idleDelay]);

  const roll = useCallback(() => {
    const s = stateRef.current;
    if (!s || s.phase === "rolling" || s.phase === "snapping") return;

    const result = Math.ceil(Math.random() * 20);

    // Cancel any pending idle resume
    if (s.idleTimeout) { clearTimeout(s.idleTimeout); s.idleTimeout = null; }

    s.snapTarget = null;

    const sign = () => (Math.random() > 0.5 ? 1 : -1);
    s.velX      = sign() * (0.25 + Math.random() * 0.25);
    s.velY      = sign() * (0.25 + Math.random() * 0.25);
    s.velZ      = sign() * (0.10 + Math.random() * 0.15);
    s.spinDecay = 0.997;
    s.phase     = "rolling";

    if (s.rollTimeout) clearTimeout(s.rollTimeout);
    s.rollTimeout = setTimeout(() => {
      onRollCompleteRef.current?.(result);
    }, 3200);
  }, []);

  return (
    <div
      ref={mountRef}
      onClick={roll}
      className={className}
      style={{ width: size, height: size, cursor: "pointer", userSelect: "none", display: "inline-block" }}
      title="Click to roll!"
    />
  );
}