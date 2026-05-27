"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  /** Metalness of the die material (0–1). Default: 0.3 */
  metalness?: number;
  /** Roughness of the die material (0–1). Default: 0.4 */
  roughness?: number;
  onRollComplete?: (result: number) => void;
  className?: string;
}

// ─── Internal state ───────────────────────────────────────────────────────────

interface DiceState {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  mesh: THREE.Mesh;
  animId: number;
  rolling: boolean;
  settled: boolean;
  spinDecay: number;
  velX: number;
  velY: number;
  velZ: number;
  snapping: boolean;         // true while we're slerping to face-up orientation
  snapTarget: THREE.Quaternion | null;
  rollTimeout: ReturnType<typeof setTimeout> | null;
}

// ─── Icosahedron face normals (world space, detail=0) ────────────────────────
// We pre-compute all 20 face normals once so we can find which is closest
// to the camera (+Z) after rolling stops.

function getIcosahedronFaceNormals(): THREE.Vector3[] {
  const geo = new THREE.IcosahedronGeometry(1, 0);
  const nonIndexed = geo.toNonIndexed();
  geo.dispose();
  nonIndexed.computeVertexNormals();

  const pos = nonIndexed.attributes.position;
  const normals: THREE.Vector3[] = [];

  for (let i = 0; i < 20; i++) {
    const base = i * 3;
    // Average of the 3 vertex normals = face normal for a flat triangle
    const n = new THREE.Vector3(
      (pos.getX(base) + pos.getX(base + 1) + pos.getX(base + 2)) / 3,
      (pos.getY(base) + pos.getY(base + 1) + pos.getY(base + 2)) / 3,
      (pos.getZ(base) + pos.getZ(base + 1) + pos.getZ(base + 2)) / 3,
    ).normalize();
    normals.push(n);
  }

  nonIndexed.dispose();
  return normals;
}

const FACE_NORMALS = getIcosahedronFaceNormals();

// ─── Texture ──────────────────────────────────────────────────────────────────
//
// UV layout per face: v0=(0,0) v1=(1,0) v2=(0.5,1)
// Centroid in UV space: (0.5, 0.333)
// Canvas is drawn with Y-axis flipped for Three.js, so centroid in px = (S*0.5, S*(1-0.333)) = (S*0.5, S*0.667)

function makeNumberTexture(
  num: number,
  numberColor: string,
  faceColor: string
): THREE.CanvasTexture {
  const S = 512;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;

  // Flat background — no gradients that fake lighting
  ctx.fillStyle = faceColor;
  ctx.fillRect(0, 0, S, S);

  // Triangle centroid in canvas pixel space
  // UV centroid is (0.5, 0.333). Three.js flips Y for canvas textures,
  // so pixel Y = S * (1 - 0.333) = S * 0.667
  const cx = S * 0.5;
  const cy = S * 0.62;  // slightly above geometric centroid for optical centering

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

  // Underline for 6/9
  if (num === 6 || num === 9) {
    ctx.font = `bold ${fontSize}px Georgia, 'Times New Roman', serif`;
    const metrics = ctx.measureText(num.toString());
    const halfW = metrics.width / 2;
    const underY = cy + fontSize * 0.6;
    ctx.strokeStyle = numberColor;
    ctx.lineWidth = Math.max(2, fontSize * 0.07);
    ctx.beginPath();
    ctx.moveTo(cx - halfW, underY);
    ctx.lineTo(cx + halfW, underY);
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

  for (let i = 0; i < 20; i++) {
    geo.addGroup(i * 3, 3, i);
  }

  // UVs matching the layout the texture is drawn for
  const uvArray = new Float32Array(60 * 2);
  for (let i = 0; i < 20; i++) {
    const b = i * 6;
    uvArray[b + 0] = 0.0; uvArray[b + 1] = 0.0;
    uvArray[b + 2] = 1.0; uvArray[b + 3] = 0.0;
    uvArray[b + 4] = 0.5; uvArray[b + 5] = 1.0;
  }
  geo.setAttribute("uv", new THREE.BufferAttribute(uvArray, 2));

  return geo;
}

// ─── Mesh ─────────────────────────────────────────────────────────────────────

function buildDiceMesh(
  radius: number,
  numberColor: string,
  faceColor: string,
  faceOpacity: number,
  metalness: number,
  roughness: number,
): THREE.Mesh {
  const geo = buildGeometry(radius);

  const materials: THREE.MeshStandardMaterial[] = Array.from({ length: 20 }, (_, i) =>
    new THREE.MeshStandardMaterial({
      map: makeNumberTexture(i + 1, numberColor, faceColor),
      transparent: faceOpacity < 1,
      opacity: faceOpacity,
      metalness,
      roughness,
      side: THREE.FrontSide,
    })
  );
  return new THREE.Mesh(geo, materials);
}

// ─── Snap-to-face helper ──────────────────────────────────────────────────────
//
// After the roll decays, find which face normal (transformed by current mesh
// rotation) points most toward the camera (+Z axis). Then compute the quaternion
// that rotates that normal to align with +Z and slerp to it.

function computeSnapQuaternion(mesh: THREE.Mesh): THREE.Quaternion {
  const camDir = new THREE.Vector3(0, 0, 1);
  let bestDot = -Infinity;
  let bestNormal = FACE_NORMALS[0].clone();

  for (const faceNormal of FACE_NORMALS) {
    // Transform face normal by current mesh world rotation
    const worldNormal = faceNormal.clone().applyQuaternion(mesh.quaternion);
    const dot = worldNormal.dot(camDir);
    if (dot > bestDot) {
      bestDot = dot;
      bestNormal = worldNormal.clone();
    }
  }

  // Quaternion that rotates bestNormal → +Z
  return new THREE.Quaternion().setFromUnitVectors(bestNormal, camDir);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function D20Dice({
  size = 300,
  numberColor = "#ffffff",
  edgeColor = "#8b5cf6",
  edgeWidth = 1.5,
  faceColor = "#1e1b4b",
  faceTexture,
  backgroundColor = "transparent",
  backgroundTexture,
  faceOpacity = 1,
  metalness = 0.3,
  roughness = 0.4,
  onRollComplete,
  className,
}: D20DiceProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<DiceState | null>(null);
  const onRollCompleteRef = useRef(onRollComplete);
  useEffect(() => { onRollCompleteRef.current = onRollComplete; }, [onRollComplete]);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    const radius = 1.4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: backgroundColor === "transparent" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    if (backgroundColor !== "transparent") scene.background = new THREE.Color(backgroundColor);
    if (backgroundTexture) new THREE.TextureLoader().load(backgroundTexture, (t) => { scene.background = t; });

    // Lights for MeshStandardMaterial PBR shading
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dir = new THREE.DirectionalLight(0xffffff, 1.4);
    dir.position.set(5, 8, 5);
    dir.castShadow = true;
    scene.add(dir);
    const rim = new THREE.PointLight(0x7c3aed, 1.0, 20);
    rim.position.set(-4, -3, 2);
    scene.add(rim);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    const mesh = buildDiceMesh(radius, numberColor, faceColor, faceOpacity, metalness, roughness);
    scene.add(mesh);

    if (edgeWidth > 0) {
      const edgeGeo = new THREE.EdgesGeometry(mesh.geometry);
      const edgeMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(edgeColor),
        transparent: true,
        opacity: 0.9,
      });
      mesh.add(new THREE.LineSegments(edgeGeo, edgeMat));
    }

    const state: DiceState = {
      renderer, scene, camera, mesh,
      animId: -1,
      rolling: false,
      settled: false,
      spinDecay: 1,
      velX: 0.003,
      velY: 0.005,
      velZ: 0.002,
      snapping: false,
      snapTarget: null,
      rollTimeout: null,
    };
    stateRef.current = state;

    const SNAP_SPEED = 0.08; // slerp factor per frame — feels like a natural settle

    const animate = () => {
      state.animId = requestAnimationFrame(animate);
      const s = state;

      if (s.snapping && s.snapTarget) {
        // Smoothly rotate the die so the nearest face points at camera
        mesh.quaternion.slerp(s.snapTarget, SNAP_SPEED);

        const remaining = mesh.quaternion.angleTo(s.snapTarget);
        if (remaining < 0.005) {
          // Snap complete — fully lock to target
          mesh.quaternion.copy(s.snapTarget);
          s.snapping = false;
          s.settled = true;
          s.snapTarget = null;
        }
      } else if (s.rolling) {
        mesh.rotation.x += s.velX;
        mesh.rotation.y += s.velY;
        mesh.rotation.z += s.velZ;

        s.velX *= s.spinDecay;
        s.velY *= s.spinDecay;
        s.velZ *= s.spinDecay;
        s.spinDecay *= 0.9925;

        const speed = Math.abs(s.velX) + Math.abs(s.velY) + Math.abs(s.velZ);
        if (speed < 0.001) {
          // Spin has decayed — begin snap-to-face
          s.rolling = false;
          s.velX = 0; s.velY = 0; s.velZ = 0;

          // Compute snap target: nearest face to camera, combined with current rotation
          const correction = computeSnapQuaternion(mesh);
          s.snapTarget = correction.multiply(mesh.quaternion);
          s.snapping = true;
        }
      } else if (!s.settled) {
        // Idle gentle spin before first roll
        mesh.rotation.x += s.velX;
        mesh.rotation.y += s.velY;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(state.animId);
      if (state.rollTimeout) clearTimeout(state.rollTimeout);
      mesh.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            (m as THREE.MeshStandardMaterial).map?.dispose();
            m.dispose();
          });
          obj.geometry.dispose();
        }
      });
      renderer.dispose();
      el.innerHTML = "";
      stateRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, numberColor, faceColor, edgeColor, edgeWidth, faceTexture, faceOpacity, metalness, roughness, backgroundColor, backgroundTexture]);

  const roll = useCallback(() => {
    const s = stateRef.current;
    if (!s || s.rolling || s.snapping) return;

    const result = Math.ceil(Math.random() * 20);

    s.settled = false;
    s.snapping = false;
    s.snapTarget = null;

    const sign = () => (Math.random() > 0.5 ? 1 : -1);
    s.velX = sign() * (0.25 + Math.random() * 0.25);
    s.velY = sign() * (0.25 + Math.random() * 0.25);
    s.velZ = sign() * (0.10 + Math.random() * 0.15);
    s.spinDecay = 0.997;
    s.rolling = true;

    if (s.rollTimeout) clearTimeout(s.rollTimeout);
    // Callback fires after snap animation finishes (~3s total)
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