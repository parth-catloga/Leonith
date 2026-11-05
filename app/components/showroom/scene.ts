import gsap from "gsap";
import type * as T from "three";
import {
  BOOK,
  COLLIDE_CIRCLES,
  COLLIDE_RECTS,
  DEFAULT_SPREAD,
  EYE,
  HERO,
  LEAVES,
  ROOM,
  SLAB,
  START,
  TOWERS,
  WING,
  ZONES,
  heroPose,
  heroStand,
  leafAngle,
  leafOffset,
  restPose,
  selectedPose,
  spreadFor,
  standFor,
  towerLocalPose,
  towerSlot,
  type Pose,
  type View,
} from "./floorPlan";
import { sizes, tileImage, tilesBySize, type SizeKey, type Tile } from "./tiles";

// The baked room: geometry from Blender, light baked into lightmaps, and a
// 360 photo of the room for reflections. See scripts/showroom/build_room.py.
const ASSETS = "/showroom";
const TEXTURE_ASPECT = 1600 / 2560;
const WALK_SPEED = 2.2;
const LOOK_SPEED = 0.0032;
const BODY = 0.35;
const FLY = 1.3;

export type Selection = { size: SizeKey; index: number; tile: Tile } | null;

export type ShowroomCallbacks = {
  onProgress: (fraction: number) => void;
  onZone: (size: SizeKey | null) => void;
  onSelect: (selection: Selection) => void;
  onOpen: (tile: Tile) => void;
  onPose: (x: number, z: number, yaw: number) => void;
};

export type ShowroomApi = {
  goToZone: (size: SizeKey) => void;
  select: (size: SizeKey, index: number) => void;
  step: (size: SizeKey, direction: 1 | -1) => void;
  walkTo: (x: number, z: number) => void;
  setMove: (x: number, y: number) => void;
  dispose: () => void;
};

type Manifest = { lightmaps: Record<string, number> };
type Pick = { size: SizeKey; index: number; hero?: boolean; leaf?: number };

export async function createShowroom(
  host: HTMLElement,
  labels: Partial<Record<SizeKey, HTMLElement | null>>,
  callbacks: ShowroomCallbacks,
): Promise<ShowroomApi> {
  const THREE = await import("three");
  const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
  const { HDRLoader } = await import("three/examples/jsm/loaders/HDRLoader.js");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fly = reduceMotion ? 0.01 : FLY;

  // --- Renderer, scene, camera --------------------------------------------
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0.62;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.className = "block h-full w-full";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#dfe8f2");
  const camera = new THREE.PerspectiveCamera(58, 1, 0.05, 80);
  camera.rotation.order = "YXZ";

  const disposables: { dispose: () => void }[] = [renderer];
  const keep = <D extends { dispose: () => void }>(item: D) => {
    disposables.push(item);
    return item;
  };

  // --- Loading ---------------------------------------------------------------
  const manager = new THREE.LoadingManager();
  manager.onProgress = (_url, loaded, total) => callbacks.onProgress(loaded / total);
  const textureLoader = new THREE.TextureLoader(manager);
  const loadTexture = async (url: string, srgb = true) => {
    const texture = keep(await textureLoader.loadAsync(url));
    if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return texture;
  };

  const baseNames = ["calacatta", "carrara", "nero", "verde", "emperador", "rosa", "travertine"];
  const [gltf, panorama, manifest, logo, lightmaps, bases] = await Promise.all([
    new GLTFLoader(manager).loadAsync(`${ASSETS}/room.glb`),
    new HDRLoader(manager).loadAsync(`${ASSETS}/env.hdr`),
    fetch(`${ASSETS}/manifest.json`).then((response) => response.json() as Promise<Manifest>),
    loadTexture("/logos/leonith-logo-white.png"),
    Promise.all(["floor", "shell", "fixtures"].map((name) => loadTexture(`${ASSETS}/lightmap-${name}.webp`))),
    Promise.all(baseNames.map((name) => loadTexture(`/textures/${name}.webp`))),
  ]);
  const baseTextures = Object.fromEntries(baseNames.map((name, i) => [name, bases[i]])) as Record<string, T.Texture>;

  // The panorama was shot facing -z; three's equirect maps start a quarter turn round.
  const envRotation = new THREE.Euler(0, Math.PI / 2, 0);
  keep(panorama);
  panorama.mapping = THREE.EquirectangularReflectionMapping;
  const pmrem = keep(new THREE.PMREMGenerator(renderer));
  const environment = keep(pmrem.fromEquirectangular(panorama).texture);
  scene.environment = environment;
  scene.environmentRotation.copy(envRotation);

  // --- The baked room --------------------------------------------------------
  // Lightmaps hold Blender's diffuse light divided by `scale`; three's basic
  // material divides by pi, so the intensity puts both back.
  const lightmapFor: Record<string, T.Texture> = { floor: lightmaps[0], shell: lightmaps[1], fixtures: lightmaps[2] };
  for (const texture of lightmaps) {
    texture.channel = 1;
    texture.flipY = false;
  }

  // One floor tile: Carrara toned to a warm grey, with a fine grout line.
  const floorCanvas = document.createElement("canvas");
  floorCanvas.width = floorCanvas.height = 1024;
  const floorContext = floorCanvas.getContext("2d")!;
  const carrara = baseTextures.carrara.image as HTMLImageElement | ImageBitmap;
  // Drawn small then scaled up, so the veins soften and don't fight the slabs.
  floorContext.drawImage(carrara, 0, 300, 1600, 1600, 0, 0, 192, 192);
  floorContext.imageSmoothingQuality = "high";
  floorContext.drawImage(floorCanvas, 0, 0, 192, 192, 0, 0, 1024, 1024);
  floorContext.strokeStyle = "rgba(70, 64, 58, 0.55)";
  floorContext.lineWidth = 3;
  floorContext.strokeRect(0, 0, 1024, 1024);
  const floorMap = keep(new THREE.CanvasTexture(floorCanvas));
  floorMap.colorSpace = THREE.SRGBColorSpace;
  floorMap.wrapS = floorMap.wrapT = THREE.RepeatWrapping;
  floorMap.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const staticMeshes: T.Mesh[] = [];
  gltf.scene.traverse((node) => {
    const mesh = node as T.Mesh;
    if (!mesh.isMesh) return;
    const source = mesh.material as T.MeshStandardMaterial;
    const [group, key] = source.name.split("_");
    const lightMap = lightmapFor[group];
    let material: T.Material;

    if (group === "lamps") {
      material = new THREE.MeshBasicMaterial({ color: new THREE.Color(4, 3.9, 3.7) });
    } else if (key === "floor") {
      material = new THREE.MeshBasicMaterial({
        map: floorMap,
        color: new THREE.Color(0.36, 0.35, 0.335),
        lightMap,
        lightMapIntensity: Math.PI * manifest.lightmaps[group],
        envMap: panorama,
        envMapRotation: envRotation,
        combine: THREE.AddOperation,
        reflectivity: 0.06,
      });
    } else {
      material = new THREE.MeshBasicMaterial({
        color: source.color.clone(),
        lightMap,
        lightMapIntensity: Math.PI * manifest.lightmaps[group],
      });
    }
    source.dispose();
    mesh.material = keep(material);
    keep(mesh.geometry);
    staticMeshes.push(mesh);
  });
  scene.add(gltf.scene);

  // Leonith mark above the hero slabs, on the charcoal panel.
  const logoMesh = new THREE.Mesh(
    keep(new THREE.PlaneGeometry(1.5, (1.5 * 566) / 1600)),
    keep(new THREE.MeshBasicMaterial({ map: logo, transparent: true, color: new THREE.Color(0.85, 0.83, 0.8) })),
  );
  logoMesh.position.set(0, 3.82, ROOM.minZ + 0.045);
  scene.add(logoMesh);

  // Glass in the entrance and windows: faint, with the room reflected in it.
  const glass = keep(
    new THREE.MeshPhysicalMaterial({ color: "#ffffff", transparent: true, opacity: 0.12, roughness: 0.05, metalness: 0, envMapIntensity: 0.6 }),
  );
  for (const [minX, maxX, minY, maxY] of [
    [-2, 2, 0, 3.4],
    [-12.5, -8.5, 0.5, 3.8],
    [8.5, 12.5, 0.5, 3.8],
  ]) {
    const pane = new THREE.Mesh(keep(new THREE.PlaneGeometry(maxX - minX, maxY - minY)), glass);
    pane.position.set((minX + maxX) / 2, (minY + maxY) / 2, ROOM.maxZ + 0.1);
    pane.rotation.y = Math.PI;
    scene.add(pane);
  }
  // Outside: a pale street-side backdrop beyond the glass.
  const outside = new THREE.Mesh(keep(new THREE.PlaneGeometry(80, 30)), keep(new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 1.7, 1.85) })));
  outside.position.set(0, 6, ROOM.maxZ + 12);
  outside.rotation.y = Math.PI;
  scene.add(outside);

  // --- Slab materials -------------------------------------------------------
  // Placeholders share a few textures, each cropped to the slab's proportions
  // and nudged so neighbours don't match. Real tiles load their own photo when
  // a visitor gets near the display.
  const edgeMaterial = keep(new THREE.MeshStandardMaterial({ color: "#d8d1c5", roughness: 0.55 }));
  const frameMaterial = keep(new THREE.MeshStandardMaterial({ color: "#1c1b1a", roughness: 0.4, metalness: 0.7 }));

  const faceMaterials = new Map<string, T.MeshStandardMaterial>();
  const pendingImages = new Map<string, { tile: Tile; size: SizeKey; meshes: { mesh: T.Mesh; slot: number }[] }>();

  const fitTexture = (texture: T.Texture, tile: Tile, size: SizeKey, ownPhoto: boolean) => {
    const { w, h } = SLAB[size];
    const map = keep(texture.clone());
    if (!ownPhoto) {
      const repeatX = Math.min(1, w / h / TEXTURE_ASPECT);
      const offset = tile.variant?.offset ?? 0.5;
      map.repeat.set(repeatX, 1);
      map.offset.set(offset * (1 - repeatX), 0);
      if (tile.variant?.flip) {
        map.repeat.x = -repeatX;
        map.offset.x += repeatX;
      }
    }
    map.needsUpdate = true;
    return map;
  };

  const faceMaterial = (tile: Tile, size: SizeKey) => {
    const cached = faceMaterials.get(tile.id);
    if (cached) return cached;
    const polished = tile.finish.toLowerCase().startsWith("polished");
    const material = keep(
      new THREE.MeshStandardMaterial({
        map: tile.image ? null : fitTexture(baseTextures[tile.texture], tile, size, false),
        color: new THREE.Color(...(tile.variant?.tint ?? [1, 1, 1])),
        roughness: polished ? 0.09 : 0.55,
        envMapIntensity: polished ? 1.0 : 0.8,
      }),
    );
    if (tile.image) material.color.set("#cfc8bc");
    faceMaterials.set(tile.id, material);
    return material;
  };

  const loadOwnPhoto = async (tile: Tile, size: SizeKey) => {
    const material = faceMaterials.get(tile.id);
    if (!material || material.map) return;
    const texture = await loadTexture(tileImage(tile));
    material.map = fitTexture(texture, tile, size, true);
    material.color.set("#ffffff");
    material.needsUpdate = true;
  };

  // --- Slab meshes -------------------------------------------------------------
  const geometries = Object.fromEntries(
    Object.entries(SLAB).map(([key, { w, h, t }]) => [key, keep(new THREE.BoxGeometry(w, h, Math.max(t, 0.008)))]),
  ) as Record<SizeKey, T.BoxGeometry>;

  const pickables: T.Mesh[] = [];
  // BoxGeometry faces: +x, -x, +y, -y, +z (front), -z (back).
  const slabMesh = (size: SizeKey, front: Tile, back: Tile, pick: Pick) => {
    const mesh = new THREE.Mesh(geometries[size], [edgeMaterial, edgeMaterial, edgeMaterial, edgeMaterial, faceMaterial(front, size), faceMaterial(back, size)]);
    mesh.userData.pick = pick;
    pickables.push(mesh);
    return mesh;
  };
  const place = (object: T.Object3D, pose: Pose) => {
    object.position.set(...pose.position);
    object.rotation.set(pose.pitch ?? 0, pose.yaw, 0, "YXZ");
  };
  const frameBox = (w: number, h: number, d: number) => new THREE.Mesh(keep(new THREE.BoxGeometry(w, h, d)), frameMaterial);

  const catalogue = Object.fromEntries(sizes.map((size) => [size.key, tilesBySize(size.key)])) as Record<SizeKey, Tile[]>;
  // Each display's moving parts, indexed by tile.
  const parts: Partial<Record<SizeKey, T.Object3D[]>> = {};
  const towers: T.Group[] = [];
  const leaves: Record<"1200x3000" | "1200x2780", T.Group[]> = { "1200x3000": [], "1200x2780": [] };

  for (const size of sizes) {
    const key = size.key;
    const list = catalogue[key];
    const { w, h } = SLAB[key];

    if (key === "800x3000") {
      TOWERS.xs.forEach((x) => {
        const group = new THREE.Group();
        group.position.set(x, 0, TOWERS.z);
        scene.add(group);
        towers.push(group);
        // A cap that turns with the slabs.
        const cap = new THREE.Mesh(keep(new THREE.CylinderGeometry(0.86, 0.86, 0.04, 6)), frameMaterial);
        cap.position.y = TOWERS.bottom + h + 0.02;
        cap.rotation.y = Math.PI / 6;
        group.add(cap);
      });
    }

    if (key === "1200x3000" || key === "1200x2780") {
      const config = key === "1200x3000" ? BOOK : WING;
      for (let j = 0; j < LEAVES; j++) {
        const pivot = new THREE.Group();
        pivot.position.set(config.hinge[0] + Math.sin(config.dir) * leafOffset(j), 0, config.hinge[1] + Math.cos(config.dir) * leafOffset(j));
        pivot.rotation.y = config.dir + leafAngle(j, DEFAULT_SPREAD, config);
        const front = list[2 * j + 1] ?? list[2 * j];
        const back = list[2 * j];
        const mesh = slabMesh(key, front, back, { size: key, index: 2 * j, leaf: j });
        mesh.position.set(config.reach + w / 2, config.bottom + h / 2, 0);
        pivot.add(mesh);
        // A slim steel frame round the leaf.
        const top = frameBox(w + 0.03, 0.03, 0.02);
        top.position.set(config.reach + w / 2, config.bottom + h + 0.015, 0);
        const bottom = frameBox(w + 0.03, 0.03, 0.02);
        bottom.position.set(config.reach + w / 2, config.bottom - 0.015, 0);
        const arm = frameBox(config.reach + 0.02, 0.03, 0.015);
        arm.position.set(config.reach / 2, config.bottom + h - 0.2, 0);
        pivot.add(top, bottom, arm);
        scene.add(pivot);
        leaves[key].push(pivot);
      }
      continue;
    }

    const objects: T.Object3D[] = [];
    list.forEach((tile, index) => {
      const mesh = slabMesh(key, tile, tile, { size: key, index });
      if (key === "800x3000") {
        const { tower, face } = towerSlot(index);
        place(mesh, towerLocalPose(face));
        towers[tower]?.add(mesh);
        objects.push(mesh);
        return;
      }

      const holder = new THREE.Group();
      place(holder, restPose(key, index));
      holder.add(mesh);
      if (key === "1600x3200") {
        // Hanger bar and trolley on the ceiling rail.
        const bar = frameBox(w + 0.04, 0.05, 0.03);
        bar.position.y = h / 2 + 0.025;
        const hanger = frameBox(0.02, SLAB_RAIL_GAP, 0.02);
        hanger.position.set(0, h / 2 + 0.05 + SLAB_RAIL_GAP / 2, 0);
        holder.add(bar, hanger);
      } else if (key === "800x2400") {
        const top = frameBox(w + 0.03, 0.04, 0.03);
        top.position.y = h / 2 + 0.02;
        const handle = frameBox(0.025, 0.25, 0.04);
        handle.position.set(w / 2 + 0.02, 0.2, 0);
        holder.add(top, handle);
      } else if (key === "1200x2400") {
        // A shadow-gap frame behind each gallery slab.
        const back = frameBox(w - 0.06, h - 0.06, 0.01);
        back.position.z = -0.015;
        holder.add(back);
      }
      scene.add(holder);
      objects.push(holder);
    });
    parts[key] = objects;
  }

  // Hero slabs on the charcoal back wall: the first three 1600 × 3200 tiles.
  HERO.xs.forEach((_, i) => {
    const tile = catalogue["1600x3200"][i];
    const mesh = slabMesh("1600x3200", tile, tile, { size: "1600x3200", index: i, hero: true });
    place(mesh, heroPose(i));
    scene.add(mesh);
  });

  // Display spots light the slabs live (the room's light is baked).
  const spotRig: { at: [number, number, number]; to: [number, number, number] }[] = [
    { at: [-11.6, 4.5, -6.6], to: [-13, 1.6, -8.6] },
    { at: [0, 4.5, -7.4], to: [0, 1.7, -10.9] },
    { at: [-12.8, 4.5, -2.4], to: [-14.6, 1.3, -4.6] },
    { at: [-9.2, 4.5, 1.2], to: [-9.2, 1.5, 1.2] },
    { at: [9.2, 4.5, -1.2], to: [9.2, 1.5, -4.5] },
    { at: [-11.6, 4.5, 8], to: [-13.8, 1.5, 8] },
    { at: [12.8, 4.5, -8.3], to: [15.2, 1.5, -8.3] },
    { at: [9.5, 4.5, 4], to: [9.5, 1.3, 4] },
  ];
  for (const rig of spotRig) {
    const spot = new THREE.SpotLight(0xfff1e0, 60, 14, 0.75, 0.6, 1.6);
    spot.position.set(...rig.at);
    spot.target.position.set(...rig.to);
    scene.add(spot, spot.target);
  }
  scene.add(new THREE.HemisphereLight(0xfffaf2, 0x8a8178, 0.25));

  // --- Display state ----------------------------------------------------------
  const selected: Partial<Record<SizeKey, number>> = {};
  const towerFace: number[] = TOWERS.xs.map(() => 0);
  let current: Selection = null;

  const tween = (target: object, vars: gsap.TweenVars) => gsap.to(target, { duration: reduceMotion ? 0.01 : 0.9, ease: "power3.inOut", overwrite: "auto", ...vars });
  const tweenPose = (object: T.Object3D, pose: Pose) => {
    tween(object.position, { x: pose.position[0], y: pose.position[1], z: pose.position[2] });
    tween(object.rotation, { x: pose.pitch ?? 0, y: pose.yaw });
  };

  const setDisplay = (size: SizeKey, index: number) => {
    const previous = selected[size];
    selected[size] = index;
    const objects = parts[size];

    switch (size) {
      case "1600x3200":
        if (previous !== undefined && previous !== index && objects) tweenPose(objects[previous], restPose(size, previous));
        if (objects) tweenPose(objects[index], selectedPose.slider(index));
        break;
      case "800x2400":
        if (previous !== undefined && previous !== index && objects) tweenPose(objects[previous], restPose(size, previous));
        if (objects) tweenPose(objects[index], selectedPose.cabinet(index));
        break;
      case "800x3200":
        if (previous !== undefined && previous !== index && objects) tweenPose(objects[previous], restPose(size, previous));
        if (objects) tweenPose(objects[index], selectedPose.aframe(index));
        break;
      case "800x3000": {
        const { tower, face } = towerSlot(index);
        // Turn the short way round to bring the face to the front.
        const step = (2 * Math.PI) / TOWERS.faces;
        const group = towers[tower];
        let goal = -face * step;
        const now = group.rotation.y;
        goal += Math.round((now - goal) / (2 * Math.PI)) * 2 * Math.PI;
        towerFace[tower] = face;
        tween(group.rotation, { y: goal, duration: reduceMotion ? 0.01 : 1.2 });
        break;
      }
      case "1200x3000":
      case "1200x2780": {
        const config = size === "1200x3000" ? BOOK : WING;
        const spread = spreadFor(index);
        leaves[size].forEach((pivot, j) => {
          tween(pivot.rotation, { y: config.dir + leafAngle(j, spread, config), duration: reduceMotion ? 0.01 : 1.1, delay: reduceMotion ? 0 : Math.abs(j - spread) * 0.015 });
        });
        break;
      }
      case "1200x2400":
        break;
    }
  };

  // --- Movement --------------------------------------------------------------
  const player = { x: START.position[0], z: START.position[2], yaw: 0, pitch: 0 };
  const lookAt = (view: View) => {
    const [px, py, pz] = view.position;
    const [tx, ty, tz] = view.target;
    const dx = tx - px;
    const dz = tz - pz;
    return { yaw: Math.atan2(-dx, -dz), pitch: Math.atan2(ty - py, Math.hypot(dx, dz)) };
  };
  Object.assign(player, lookAt(START));

  const resolve = (x: number, z: number) => {
    x = Math.min(ROOM.maxX - BODY, Math.max(ROOM.minX + BODY, x));
    z = Math.min(ROOM.maxZ - BODY, Math.max(ROOM.minZ + BODY, z));
    for (let pass = 0; pass < 2; pass++) {
      for (const rect of COLLIDE_RECTS) {
        const cx = Math.min(rect.maxX, Math.max(rect.minX, x));
        const cz = Math.min(rect.maxZ, Math.max(rect.minZ, z));
        const dx = x - cx;
        const dz = z - cz;
        const distance = Math.hypot(dx, dz);
        if (distance >= BODY) continue;
        if (distance > 1e-6) {
          x = cx + (dx / distance) * BODY;
          z = cz + (dz / distance) * BODY;
        } else {
          // Inside the box: leave by the nearest side.
          const exits = [
            [rect.minX - BODY - x, 0],
            [rect.maxX + BODY - x, 0],
            [0, rect.minZ - BODY - z],
            [0, rect.maxZ + BODY - z],
          ].sort((a, b) => Math.abs(a[0] + a[1]) - Math.abs(b[0] + b[1]));
          x += exits[0][0];
          z += exits[0][1];
        }
      }
      for (const circle of COLLIDE_CIRCLES) {
        const dx = x - circle.x;
        const dz = z - circle.z;
        const distance = Math.hypot(dx, dz);
        const min = circle.r + BODY;
        if (distance < min && distance > 1e-6) {
          x = circle.x + (dx / distance) * min;
          z = circle.z + (dz / distance) * min;
        }
      }
    }
    return { x, z };
  };

  let flight: gsap.core.Tween | null = null;
  let walkTarget: { x: number; z: number } | null = null;
  const flyTo = (view: View) => {
    walkTarget = null;
    flight?.kill();
    const goal = lookAt(view);
    // Turn the short way round.
    let yaw = goal.yaw;
    yaw += Math.round((player.yaw - yaw) / (2 * Math.PI)) * 2 * Math.PI;
    flight = gsap.to(player, {
      x: view.position[0],
      z: view.position[2],
      yaw,
      pitch: goal.pitch,
      duration: fly,
      ease: "power2.inOut",
      onComplete: () => {
        flight = null;
      },
    });
  };

  const keys = new Set<string>();
  const joystick = { x: 0, y: 0 };
  const onKeyDown = (event: KeyboardEvent) => {
    if ((event.target as HTMLElement)?.closest?.("input, textarea, select, [role=dialog]")) return;
    const key = event.key.toLowerCase();
    if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
      keys.add(key);
      event.preventDefault();
    }
  };
  const onKeyUp = (event: KeyboardEvent) => keys.delete(event.key.toLowerCase());
  const onBlur = () => keys.clear();
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);

  // --- Pointer: drag to look, click to pick or walk ------------------------------
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  let drag: { id: number; x: number; y: number; moved: boolean } | null = null;

  const canvas = renderer.domElement;
  const onPointerDown = (event: PointerEvent) => {
    if (drag) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
    canvas.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent) => {
    if (!drag || drag.id !== event.pointerId) {
      if (event.pointerType === "mouse" && !drag) hover(event);
      return;
    }
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    drag.moved = true;
    flight?.kill();
    flight = null;
    // Touch drags feel natural pulling the room; mouse drags turn the head.
    const speed = event.pointerType === "touch" ? LOOK_SPEED * 1.3 : LOOK_SPEED;
    player.yaw += dx * speed;
    player.pitch = Math.max(-1.1, Math.min(1.1, player.pitch + dy * speed));
    drag.x = event.clientX;
    drag.y = event.clientY;
  };
  const onPointerUp = (event: PointerEvent) => {
    if (!drag || drag.id !== event.pointerId) return;
    const wasDrag = drag.moved;
    drag = null;
    if (!wasDrag) click(event);
  };

  const cast = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(pickables, false)[0];
  };

  const hover = (event: PointerEvent) => {
    canvas.style.cursor = cast(event) ? "pointer" : "grab";
  };

  const tileFor = (pick: Pick, face?: number) => {
    if (pick.leaf !== undefined) {
      // Which side of the leaf was clicked.
      const index = face === 4 ? 2 * pick.leaf + 1 : 2 * pick.leaf;
      return Math.min(index, catalogue[pick.size].length - 1);
    }
    return pick.index;
  };

  const click = (event: PointerEvent) => {
    const hit = cast(event);
    if (hit) {
      const pick = hit.object.userData.pick as Pick;
      const index = tileFor(pick, hit.face?.materialIndex);
      if (current && current.size === pick.size && current.index === index) {
        callbacks.onOpen(current.tile);
        return;
      }
      choose(pick.size, index, pick.hero);
      return;
    }
    const point = raycaster.ray.intersectPlane(floorPlane, new THREE.Vector3());
    if (point && point.distanceTo(camera.position) < 30) api.walkTo(point.x, point.z);
  };

  const choose = (size: SizeKey, index: number, hero = false) => {
    const tile = catalogue[size][index];
    if (!tile) return;
    if (!hero) setDisplay(size, index);
    current = { size, index, tile };
    callbacks.onSelect(current);
    flyTo(hero ? heroStand(index) : standFor(size, index));
    if (tile.image) void loadOwnPhoto(tile, size);
  };

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);

  // --- Resize ------------------------------------------------------------------
  const resize = () => {
    const { clientWidth, clientHeight } = host;
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / Math.max(1, clientHeight);
    // Narrow screens see more of the room side to side.
    camera.fov = camera.aspect < 0.8 ? 70 : 58;
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();

  // --- Frame loop -----------------------------------------------------------------
  const clock = new THREE.Clock();
  const labelPoint = new THREE.Vector3();
  let zone: SizeKey | null = null;
  let poseTimer = 0;
  let frame = 0;

  const near = (x: number, z: number) => {
    // Stay with the display you picked until you walk well away from it.
    if (current) {
      const { center, radius } = ZONES[current.size];
      if (Math.hypot(x - center[0], z - center[1]) < radius + 3) return current.size;
    }
    let best: SizeKey | null = null;
    let bestDistance = Infinity;
    for (const size of sizes) {
      const { center, radius } = ZONES[size.key];
      const distance = Math.hypot(x - center[0], z - center[1]);
      if (distance < radius && distance < bestDistance) {
        best = size.key;
        bestDistance = distance;
      }
    }
    return best;
  };

  const loadNearbyPhotos = (x: number, z: number) => {
    for (const size of sizes) {
      const { center, radius } = ZONES[size.key];
      if (Math.hypot(x - center[0], z - center[1]) > radius + 8) continue;
      for (const tile of catalogue[size.key]) {
        if (tile.image && !pendingImages.has(tile.id)) {
          pendingImages.set(tile.id, { tile, size: size.key, meshes: [] });
          void loadOwnPhoto(tile, size.key);
        }
      }
    }
  };

  const tick = () => {
    frame = requestAnimationFrame(tick);
    const delta = Math.min(clock.getDelta(), 0.05);

    // Walking: keys and the on-screen stick move relative to where you look.
    let forward = joystick.y;
    let strafe = joystick.x;
    if (keys.has("w") || keys.has("arrowup")) forward += 1;
    if (keys.has("s") || keys.has("arrowdown")) forward -= 1;
    if (keys.has("d") || keys.has("arrowright")) strafe += 1;
    if (keys.has("a") || keys.has("arrowleft")) strafe -= 1;
    const length = Math.hypot(forward, strafe);
    if (length > 0.05) {
      flight?.kill();
      flight = null;
      walkTarget = null;
      const scale = (WALK_SPEED * delta) / Math.max(1, length);
      const sin = Math.sin(player.yaw);
      const cos = Math.cos(player.yaw);
      const next = resolve(player.x + (-sin * forward + cos * strafe) * scale, player.z + (-cos * forward - sin * strafe) * scale);
      player.x = next.x;
      player.z = next.z;
    } else if (walkTarget) {
      const dx = walkTarget.x - player.x;
      const dz = walkTarget.z - player.z;
      const distance = Math.hypot(dx, dz);
      if (distance < 0.05) {
        walkTarget = null;
      } else {
        const stepLength = Math.min(distance, WALK_SPEED * 1.2 * delta);
        const next = resolve(player.x + (dx / distance) * stepLength, player.z + (dz / distance) * stepLength);
        // Stop if something is in the way.
        if (Math.hypot(next.x - player.x, next.z - player.z) < stepLength * 0.2) walkTarget = null;
        player.x = next.x;
        player.z = next.z;
      }
    }

    camera.position.set(player.x, EYE, player.z);
    camera.rotation.set(player.pitch, player.yaw, 0, "YXZ");

    const nowZone = near(player.x, player.z);
    if (nowZone !== zone) {
      zone = nowZone;
      callbacks.onZone(zone);
      loadNearbyPhotos(player.x, player.z);
    }

    poseTimer += delta;
    if (poseTimer > 0.1) {
      poseTimer = 0;
      callbacks.onPose(player.x, player.z, player.yaw);
    }

    // Float each display's name over it, fading with distance.
    const width = host.clientWidth;
    const height = host.clientHeight;
    for (const size of sizes) {
      const label = labels[size.key];
      if (!label) continue;
      labelPoint.set(...ZONES[size.key].label).project(camera);
      const distance = Math.hypot(player.x - ZONES[size.key].label[0], player.z - ZONES[size.key].label[2]);
      const visible = labelPoint.z < 1 && Math.abs(labelPoint.x) < 1.1 && Math.abs(labelPoint.y) < 1.1 && distance > 2.5 && distance < 22;
      label.style.opacity = visible ? String(Math.min(1, (distance - 2.5) / 2.5)) : "0";
      label.style.pointerEvents = visible ? "auto" : "none";
      label.style.transform = `translate(-50%, -100%) translate(${((labelPoint.x + 1) / 2) * width}px, ${((1 - labelPoint.y) / 2) * height}px)`;
    }

    renderer.render(scene, camera);
  };

  // Compile everything before the first frame so walking in doesn't stutter.
  await renderer.compileAsync(scene, camera);
  tick();

  // --- API -----------------------------------------------------------------------
  const api: ShowroomApi = {
    goToZone: (size) => {
      // Books open in the middle, like a real one on a stand.
      const index = selected[size] ?? (size === "1200x3000" || size === "1200x2780" ? 2 * DEFAULT_SPREAD - 1 : 0);
      choose(size, index);
    },
    select: (size, index) => choose(size, index),
    step: (size, direction) => {
      const count = catalogue[size].length;
      const index = ((current?.size === size ? current.index : (selected[size] ?? 0)) + direction + count) % count;
      choose(size, index);
    },
    walkTo: (x, z) => {
      flight?.kill();
      flight = null;
      walkTarget = resolve(x, z);
    },
    setMove: (x, y) => {
      joystick.x = x;
      joystick.y = y;
    },
    dispose: () => {
      cancelAnimationFrame(frame);
      flight?.kill();
      gsap.killTweensOf([player]);
      observer.disconnect();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      scene.traverse((node) => {
        const mesh = node as T.Mesh;
        if (mesh.isMesh) {
          gsap.killTweensOf([mesh.position, mesh.rotation]);
        }
        gsap.killTweensOf([node.position, node.rotation]);
      });
      for (const item of disposables) item.dispose();
      renderer.domElement.remove();
    },
  };

  return api;
}

// Gap between a sliding slab's hanger bar and the ceiling rail above it.
const SLAB_RAIL_GAP = 3.5 - (0.15 + 3.2) - 0.05;
