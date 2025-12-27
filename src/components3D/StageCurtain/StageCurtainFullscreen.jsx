import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function StageCurtainFullscreen({ onOpenChange }) {
  const mountRef = useRef(null);
  const [open, setOpen] = useState(false);

  /* 🔔 Notify parent when open changes */
  useEffect(() => {
    if (onOpenChange) onOpenChange(open);
  }, [open, onOpenChange]);

  useEffect(() => {
    const container = mountRef.current;

    /* ---------- SCENE ---------- */
    const scene = new THREE.Scene();

    /* ---------- CAMERA ---------- */
    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 10;

    /* ---------- RENDERER ---------- */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    /* ---------- LIGHTS ---------- */
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(5, 5, 5);
    scene.add(key);

    /* ---------- VIEW SIZE ---------- */
    const getViewSize = () => {
      const vFOV = THREE.MathUtils.degToRad(camera.fov);
      const height = 2 * Math.tan(vFOV / 2) * camera.position.z;
      const width = height * camera.aspect;
      return { width, height };
    };

    const { width, height } = getViewSize();
    const curtainWidth = width / 2;

    /* ---------- MATERIAL ---------- */
    const curtainMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b0000,
      roughness: 0.75,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    /* ---------- GEOMETRY ---------- */
    const curtainGeo = new THREE.PlaneGeometry(
      curtainWidth,
      height,
      30,
      40
    );

    const pos = curtainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      pos.setZ(i, Math.sin(x * 4) * 0.15);
    }
    pos.needsUpdate = true;
    curtainGeo.computeVertexNormals();

    /* ---------- CURTAINS ---------- */
    const leftCurtain = new THREE.Mesh(curtainGeo, curtainMaterial);
    const rightCurtain = new THREE.Mesh(curtainGeo, curtainMaterial);

    leftCurtain.position.x = -curtainWidth / 2;
    rightCurtain.position.x = curtainWidth / 2;

    scene.add(leftCurtain, rightCurtain);

    /* ---------- ANIMATION ---------- */
    let progress = 0;
    const OPEN_DISTANCE = curtainWidth * 0.99;

    const animate = () => {
      requestAnimationFrame(animate);

      progress += open ? 0.02 : -0.02;
      progress = THREE.MathUtils.clamp(progress, 0, 1);

      leftCurtain.position.x = -curtainWidth / 2 - progress * OPEN_DISTANCE;
      rightCurtain.position.x = curtainWidth / 2 + progress * OPEN_DISTANCE;

      leftCurtain.rotation.y = -progress * 0.25;
      rightCurtain.rotation.y = progress * 0.25;

      renderer.render(scene, camera);
    };
    animate();

    /* ---------- RESIZE ---------- */
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [open]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden"
      }}
    >
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "16px 36px",
            fontSize: "18px",
            fontWeight: "bold",
            borderRadius: "40px",
            border: "none",
            cursor: "pointer",
            background: "gold",
            color: "#000",
            zIndex: 100
          }}
        >
        OPEN
        </button>
      )}
    </div>
  );
}
