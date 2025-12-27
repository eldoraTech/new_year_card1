import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

export default function Any3D_Alphabet1({
  value = "?",
  width = 100,
  height = 100,
  padding = 1.5
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    /* CAMERA */
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);

    /* RENDERER */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    mountRef.current.appendChild(renderer.domElement);

    /* LIGHTS */
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const key = new THREE.DirectionalLight(0xffffff, 1.8);
    key.position.set(5, 5, 5);
    scene.add(key);

    const front = new THREE.DirectionalLight(0xffffff, 1.2);
    front.position.set(0, 0, 10);
    scene.add(front);

    /* MATERIALS */
    const frontMat = new THREE.MeshStandardMaterial({
      color: 0xffe066,
      metalness: 0.9,
      roughness: 0.15
    });

    const sideMat = new THREE.MeshStandardMaterial({
      color: 0xc9a227,
      metalness: 0.9,
      roughness: 0.25
    });

    let mesh;

    /* TEXT */
    new FontLoader().load(
      "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json",
      (font) => {
        const geo = new TextGeometry(String(value), {
          font,
          size: 3.5,
          height: 0.6,
          bevelEnabled: true,
          bevelThickness: 0.06,
          bevelSize: 0.03,
          bevelSegments: 5
        });

        geo.computeBoundingBox();
        geo.center();

        mesh = new THREE.Mesh(geo, [frontMat, sideMat]);
        scene.add(mesh);

        /* SAFE CAMERA + PADDING */
        const box = geo.boundingBox;
        const size = new THREE.Vector3();
        box.getSize(size);

        const maxDim = Math.max(size.x, size.y);
        camera.position.z = THREE.MathUtils.clamp(
          maxDim * padding,
          4,
          12
        );

        camera.lookAt(0, 0, 0);
      }
    );

    /* 🔄 MOUSE TILT */
    const mouse = { x: 0, y: 0 };

    const onMouseMove = (e) => {
      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    mountRef.current.addEventListener("mousemove", onMouseMove);

    /* ANIMATION LOOP */
    const animate = () => {
      requestAnimationFrame(animate);

      if (mesh) {
        mesh.rotation.y += (mouse.x * 0.5 - mesh.rotation.y) * 0.08;
        mesh.rotation.x += (mouse.y * 0.5 - mesh.rotation.x) * 0.08;
      }

      renderer.render(scene, camera);
    };
    animate();

    /* CLEANUP */
    return () => {
      mountRef.current.removeEventListener("mousemove", onMouseMove);
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [value, width, height, padding]);

  return (
    <div
      ref={mountRef}
      style={{
        width,
        height,
        // background: "radial-gradient(circle at top, #3a00cc, #0a0018)",
        borderRadius: 12,
        zIndex: 100

      }}
    />
  );
}
