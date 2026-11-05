"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import ArrowFillButton from "@/components/ui/arrow-fill-button";

const finishes = [
  {
    name: "Polished & matt",
    description: "One design, two ways to experience it: a reflective polish or a calm, low-sheen matt surface.",
    roughness: 0.38,
  },
  {
    name: "Matt",
    description: "A soft, low-reflection surface for quiet, contemporary interiors and a natural stone-like feel.",
    roughness: 0.78,
  },
  {
    name: "Polished",
    description: "A reflective surface that catches the light and gives every vein, shade, and detail more presence.",
    roughness: 0.12,
  },
  {
    name: "Rustic matt",
    description: "A more organic, understated finish that brings a relaxed depth to stone-inspired surfaces.",
    roughness: 0.86,
  },
  {
    name: "Bush hammered",
    description: "A tactile, textured finish with a stronger sense of material and visual depth.",
    roughness: 0.94,
  },
  {
    name: "Carving",
    description: "A relief-like surface that adds crafted texture, shadow, and movement to the slab.",
    roughness: 0.9,
  },
  {
    name: "Posh",
    description: "A refined, smooth finish that keeps the material clean, elegant, and quietly expressive.",
    roughness: 0.28,
  },
  {
    name: "Crystal",
    description: "A luminous finish that brings clarity and sparkle to the surface under changing light.",
    roughness: 0.18,
  },
  {
    name: "Baby satin",
    description: "A gentle satin sheen that sits between matt and polish for a soft, balanced appearance.",
    roughness: 0.52,
  },
];

// Procedural placeholders until real slab photography is supplied.
const textures = ["calacatta", "nero", "travertine", "verde", "carrara", "emperador", "rosa"];

const SLAB_COUNT = 20;
const SLAB_SIZE = { width: 3, height: 4.5, depth: 0.12 };
// The spiral spans -10..10 on the vertical axis and makes one and a half turns.
const SPIRAL_HALF_HEIGHT = 10;
const SPIRAL_TURNS = 1.5;
const SPIRAL_RADIUS = 6;
// Horizontal breathing room either side of the spiral, used to frame the camera.
const SPIRAL_MARGIN = 4;
const CAMERA_DISTANCE = 100;
// How long one slab's idle sway takes, in milliseconds.
const SWAY_PERIOD = 10_000;

// Deterministic so every visit gets the same arrangement.
const seeded = (index: number) => {
  const value = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
};

export default function CollectionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const finishRef = useRef<HTMLParagraphElement>(null);
  const hasShownFinishRef = useRef(false);
  const activeFinishRef = useRef(0);
  const [activeFinish, setActiveFinish] = useState(0);

  useEffect(() => {
    activeFinishRef.current = activeFinish;
  }, [activeFinish]);

  // Step through the finish collection as the pinned section scrolls past.
  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const handleScroll = () => {
      const scrollDistance = section.offsetHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / scrollDistance));

      setActiveFinish(Math.min(finishes.length - 1, Math.floor(progress * finishes.length)));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!hasShownFinishRef.current) {
      hasShownFinishRef.current = true;
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const tween = gsap.fromTo(
      [descriptionRef.current, finishRef.current],
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" },
    );

    return () => {
      tween.kill();
    };
  }, [activeFinish]);

  useEffect(() => {
    const section = sectionRef.current;
    const canvasHost = canvasHostRef.current;

    if (!section || !canvasHost) {
      return;
    }

    let disposeScene: (() => void) | undefined;
    let cancelled = false;

    const setUpScene = async () => {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");

      if (cancelled) {
        return;
      }

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.className = "block h-full w-full";
      canvasHost.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const environmentGenerator = new THREE.PMREMGenerator(renderer);
      const environment = environmentGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = environment;
      scene.environmentRotation.set(0, Math.PI * 0.5, 0);

      const sun = new THREE.DirectionalLight(0xffffff, 2);
      sun.position.set(200, 15, 5);
      scene.add(sun);

      const camera = new THREE.PerspectiveCamera(45, 1, 1, 500);
      camera.position.set(0, 0, CAMERA_DISTANCE);

      const geometry = new THREE.BoxGeometry(SLAB_SIZE.width, SLAB_SIZE.height, SLAB_SIZE.depth);
      const textureLoader = new THREE.TextureLoader();
      const materials = textures.map((name) => {
        const map = textureLoader.load(`/textures/${name}.svg`);
        map.colorSpace = THREE.SRGBColorSpace;
        map.anisotropy = renderer.capabilities.getMaxAnisotropy();
        return new THREE.MeshStandardMaterial({ map, roughness: 0.35 });
      });

      // Each slab stands like a fin pointing away from the axis, so it turns
      // from a full face to a thin edge as the spiral rotates.
      const spiral = new THREE.Group();
      scene.add(spiral);
      const slabs = Array.from({ length: SLAB_COUNT }, (_, index) => {
        const position = (index / (SLAB_COUNT - 1) - 0.5) * 2;
        const mesh = new THREE.Mesh(geometry, materials[index % materials.length]);
        const holder = new THREE.Group();

        mesh.position.x = SPIRAL_RADIUS;
        holder.position.y = position * SPIRAL_HALF_HEIGHT;
        holder.rotation.y = position * SPIRAL_TURNS * Math.PI;
        holder.add(mesh);
        spiral.add(holder);

        return { mesh, rand: seeded(index) };
      });

      const resize = () => {
        const width = canvasHost.clientWidth;
        const height = canvasHost.clientHeight;

        if (width === 0 || height === 0) {
          return;
        }

        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        // Keep the spiral and its margins filling the width at every aspect ratio.
        const halfWidth = (SPIRAL_RADIUS + SPIRAL_MARGIN) / Math.max(camera.aspect, 0.5);
        camera.fov = (2 * Math.atan(halfWidth / CAMERA_DISTANCE) * 180) / Math.PI;
        camera.updateProjectionMatrix();
      };

      const renderFrame = () => {
        // Runs from 1 as the section enters to -1 as it leaves.
        const bounds = section.getBoundingClientRect();
        const scroll = ((bounds.top - window.innerHeight * 0.5) / bounds.height + 0.5) * 2;
        const travel =
          Math.sin((camera.fov / 180) * Math.PI) * CAMERA_DISTANCE * (0.25 + 0.25 * Math.min(1, camera.aspect));

        spiral.position.y = -scroll * (travel + SPIRAL_HALF_HEIGHT);
        spiral.rotation.y = -scroll * SPIRAL_TURNS * Math.PI;
        section.style.setProperty("--progress", String(Math.min(1, Math.max(0, (1 - scroll) / 2))));

        const finish = finishes[activeFinishRef.current];
        materials.forEach((material) => {
          material.roughness = finish.roughness;
        });

        const now = Date.now();
        for (const { mesh, rand } of slabs) {
          const phase = (Math.abs((((now + SWAY_PERIOD * rand) % SWAY_PERIOD) / SWAY_PERIOD) - 0.5) * -1 + 0.25) * 4;
          const tilt = Math.atan(phase * 4) * Math.PI * 0.01 * rand;
          const drift = Math.atan(phase * 2) * rand * 0.1;

          mesh.rotation.set(tilt, 0, tilt);
          mesh.position.set(SPIRAL_RADIUS + drift, drift, drift);
        }

        renderer.render(scene, camera);
      };

      let animationFrame: number | undefined;
      const loop = () => {
        renderFrame();
        animationFrame = requestAnimationFrame(loop);
      };

      // Only animate while the section is on screen.
      const visibility = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && animationFrame === undefined) {
          loop();
        } else if (!entry.isIntersecting && animationFrame !== undefined) {
          cancelAnimationFrame(animationFrame);
          animationFrame = undefined;
        }
      });

      resize();
      renderFrame();
      visibility.observe(section);
      window.addEventListener("resize", resize);

      disposeScene = () => {
        visibility.disconnect();
        window.removeEventListener("resize", resize);
        if (animationFrame !== undefined) {
          cancelAnimationFrame(animationFrame);
        }
        geometry.dispose();
        materials.forEach((material) => {
          material.map?.dispose();
          material.dispose();
        });
        environment.dispose();
        environmentGenerator.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    setUpScene();

    return () => {
      cancelled = true;
      disposeScene?.();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="collection"
      data-nav-dark
      className="relative h-[1000svh] bg-[#121212] font-sans text-white [--progress:0]"
    >
      {/* Brand charcoal (#181818) lit by a soft glow of the brand red (#E20114). */}
      <div className="sticky top-0 h-svh overflow-hidden bg-[radial-gradient(ellipse_at_72%_30%,rgba(226,1,20,0.38)_0%,rgba(226,1,20,0.14)_38%,rgba(226,1,20,0)_62%),radial-gradient(ellipse_at_72%_30%,#181818_0%,#181818_55%,#101010_100%)]">
        <div ref={canvasHostRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />

        {/* Soft shafts of sunlight that drift with the scroll. */}
        <div
          className="pointer-events-none absolute -inset-[20%] bg-[linear-gradient(115deg,transparent_35%,rgba(255,250,210,0.1)_45%,transparent_55%,transparent_60%,rgba(255,250,210,0.07)_66%,transparent_74%)] mix-blend-screen"
          style={{ transform: "translate3d(calc((var(--progress) - 0.5) * 30vw), 0, 0)" }}
          aria-hidden="true"
        />

        {/* Dims the slabs only where they pass behind the copy and finish readout. */}
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(16,16,16,0.88)_0%,rgba(16,16,16,0.6)_38%,rgba(16,16,16,0)_62%),linear-gradient(0deg,rgba(16,16,16,0.9)_0%,rgba(16,16,16,0.7)_25%,rgba(16,16,16,0)_50%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 flex h-full flex-col px-4 pb-10 pt-32 [text-shadow:0_1px_12px_rgba(0,0,0,0.35)] lg:px-14 lg:pt-40 xl:px-[10%]">
          <h2 className="[word-spacing:-0.08em] text-3xl lg:text-[2.25rem]">The Finish Collection</h2>
          <p
            ref={descriptionRef}
            className="mt-6 min-h-[5.5em] max-w-[38rem] [word-spacing:-0.08em] text-lg leading-snug text-white/90 lg:mt-10 lg:text-[1.35rem]"
          >
            {finishes[activeFinish].description}
          </p>

          <div className="mt-auto max-w-[26rem] xl:ml-[55%] xl:mt-[14svh]" aria-live="polite">
            <p className="text-xs uppercase tracking-[0.14em] text-[#ff4d5a]">
              Finish collection · {activeFinish + 1} / {finishes.length}
            </p>
            <p ref={finishRef} className="mt-2 text-3xl uppercase leading-none lg:text-[2.75rem]">
              {finishes[activeFinish].name}
            </p>
            <ArrowFillButton
              btnText="Explore collection"
              href="/showroom"
              className="mt-6 [text-shadow:none]"
              bgColor="#ffffff"
              textColor="#171717"
              fillBgColor="#171717"
              fillTextColor="#ffffff"
              hoverFillBgColor="#171717"
              hoverFillTextColor="#ffffff"
              arrowColor="#ffffff"
              hoverArrowColor="#ffffff"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
