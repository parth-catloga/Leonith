// The showroom floor plan, in metres. Blender reads this (through
// scripts/showroom/export-spec.ts) to model and light the room, and the
// browser reads it to place every slab, so the two always line up.
//
// Axes match three.js: x runs left to right, y is up, and +z points from the
// back wall towards the entrance. The floor is at y = 0.
//
// This file must not import runtime code: Node runs it directly for Blender.
import type { SizeKey } from "./tiles";

export type Vec3 = [number, number, number];
export type View = { position: Vec3; target: Vec3 };
// A slab's width runs along its local x, height along y and thickness along z.
// The front face looks down local +z. Rotation is yaw (about y), then pitch.
export type Pose = { position: Vec3; yaw: number; pitch?: number };

export const ROOM = { minX: -16, maxX: 16, minZ: -11, maxZ: 11, height: 4.8, wall: 0.2 };
export const EYE = 1.6;
export const START: View = { position: [0, EYE, 9.2], target: [0, 1.7, -6] };

// Openings in the front wall (z = maxZ): the entrance and two windows.
export const OPENINGS = [
  { minX: -2, maxX: 2, minY: 0, maxY: 3.4, door: true },
  { minX: -12.5, maxX: -8.5, minY: 0.5, maxY: 3.8 },
  { minX: 8.5, maxX: 12.5, minY: 0.5, maxY: 3.8 },
];

// Slab sizes in metres. Thickness for the two coming-soon sizes is a guess
// so they still draw; the panel says "Coming soon" instead.
export const SLAB: Record<SizeKey, { w: number; h: number; t: number }> = {
  "1600x3200": { w: 1.6, h: 3.2, t: 0.012 },
  "1200x3000": { w: 1.2, h: 3.0, t: 0.006 },
  "800x3000": { w: 0.8, h: 3.0, t: 0.015 },
  "800x3200": { w: 0.8, h: 3.2, t: 0.015 },
  "800x2400": { w: 0.8, h: 2.4, t: 0.015 },
  "1200x2400": { w: 1.2, h: 2.4, t: 0.012 },
  "1200x2780": { w: 1.2, h: 2.78, t: 0.012 },
};

const RAD = Math.PI / 180;

// --- Display settings ------------------------------------------------------
export const SLIDER = { x0: -14.6, pitch: 0.11, zRest: -10.05, pull: 1.8, bottom: 0.15, railY: 3.5 };
export const HERO = { xs: [-2.4, 0, 2.4], z: -10.93, bottom: 0.2 };
export const CABINET = { z0: -6.0, pitch: 0.09, xRest: -15.45, pull: 1.0, bottom: 0.12, top: 2.66 };
export const AFRAME = {
  frames: [
    { z: -0.8, x0: -12.6 },
    { z: 3.2, x0: -12.6 },
  ],
  perSide: 8,
  pitch: 0.85,
  foot: 0.42,
  lean: 0.11,
  bottom: 0.07,
  lift: 0.35,
};
export const TOWERS = { z: -4.5, xs: [4.6, 6.9, 9.2, 11.5, 13.8], faces: 6, side: 0.84, bottom: 0.1, core: 0.7 };
export const TOWER_APOTHEM = (TOWERS.side * Math.sqrt(3)) / 2;
// Swing leaves turn about a hinge; `dir` is the yaw the opening faces.
export const BOOK = { hinge: [-14.4, 8.0] as [number, number], dir: 0, bottom: 0.15, open: 55 * RAD, fan: 2 * RAD, reach: 0.06 };
export const WING = { hinge: [15.88, -8.3] as [number, number], dir: Math.PI, bottom: 0.15, open: 55 * RAD, fan: 2 * RAD, reach: 0.06 };
export const GALLERY = { walls: [2.2, 5.8], x0: 4.2, length: 10.6, thick: 0.2, height: 3.0, perFace: 8, bottom: 0.3, gap: 0.02 };
export const RECEPTION = { minX: -7.6, maxX: -4.2, minZ: 8.7, maxZ: 9.4, height: 1.05 };

export const LEAVES = 15;

// --- Rest poses ------------------------------------------------------------
// Where each tile sits when nobody is touching the display.

const sliderPose = (i: number, out = 0): Pose => {
  const { h } = SLAB["1600x3200"];
  return { position: [SLIDER.x0 + i * SLIDER.pitch, SLIDER.bottom + h / 2, SLIDER.zRest + out * SLIDER.pull], yaw: Math.PI / 2 };
};

export const heroPose = (i: number): Pose => {
  const { h, t } = SLAB["1600x3200"];
  return { position: [HERO.xs[i], HERO.bottom + h / 2, HERO.z + t / 2], yaw: 0 };
};

const cabinetPose = (i: number, out = 0): Pose => {
  const { h } = SLAB["800x2400"];
  return { position: [CABINET.xRest + out * CABINET.pull, CABINET.bottom + h / 2, CABINET.z0 + i * CABINET.pitch], yaw: 0 };
};

// The A-frames take 8 slabs a side: frame 0 north, frame 0 south, frame 1 north, ...
export const aframeSlot = (i: number) => {
  const face = Math.floor(i / AFRAME.perSide);
  const frame = AFRAME.frames[Math.floor(face / 2)];
  const side = face % 2 === 0 ? -1 : 1;
  // Numbered left to right as you face each side.
  const k = side < 0 ? AFRAME.perSide - 1 - (i % AFRAME.perSide) : i % AFRAME.perSide;
  return { frame, side, x: frame.x0 + AFRAME.pitch / 2 + k * AFRAME.pitch };
};

const aframePose = (i: number, lifted = 0): Pose => {
  const { h, t } = SLAB["800x3200"];
  const { frame, side, x } = aframeSlot(i);
  const lean = AFRAME.lean * (1 - lifted);
  const footZ = frame.z + side * (AFRAME.foot + lifted * AFRAME.lift);
  const bottom = AFRAME.bottom + lifted * 0.02;
  // Centre of the slab: up the lean by half the height, out by half the thickness.
  const y = bottom + (Math.cos(lean) * h) / 2;
  const z = footZ - side * (Math.sin(lean) * h) / 2 + side * (Math.cos(lean) * t) / 2;
  return { position: [x, y, z], yaw: side > 0 ? 0 : Math.PI, pitch: -lean };
};

export const towerSlot = (i: number) => ({ tower: Math.floor(i / TOWERS.faces), face: i % TOWERS.faces });

// Pose relative to the tower's centre, before the tower turns.
export const towerLocalPose = (face: number): Pose => {
  const { h, t } = SLAB["800x3000"];
  const angle = (face * 2 * Math.PI) / TOWERS.faces;
  const r = TOWER_APOTHEM + t / 2 + 0.004;
  return { position: [Math.sin(angle) * r, TOWERS.bottom + h / 2, Math.cos(angle) * r], yaw: angle };
};

// Which spread a swing display opens to so a tile shows: leaf j carries tile
// 2j on its -z face and tile 2j + 1 on its +z face.
export const spreadFor = (tile: number) => Math.ceil(tile / 2);

// Yaw of leaf j, relative to the display's opening direction, at a spread.
export const leafAngle = (j: number, spread: number, config: typeof BOOK) => {
  const angle = j < spread ? config.open + (spread - 1 - j) * config.fan : -(config.open + (j - spread) * config.fan);
  return Math.max(-84 * RAD, Math.min(84 * RAD, angle));
};

// Leaves sit a few millimetres apart on the hinge so neighbours never cut through each other.
export const leafOffset = (j: number) => (j - (LEAVES - 1) / 2) * 0.008;

const leafPose = (config: typeof BOOK, size: SizeKey, j: number, spread: number): Pose => {
  const { w, h } = SLAB[size];
  const yaw = config.dir + leafAngle(j, spread, config);
  const along = config.reach + w / 2;
  // Local +x of a leaf turned by `yaw`.
  const dx = Math.cos(yaw);
  const dz = -Math.sin(yaw);
  // Offset across the opening direction.
  const ox = Math.sin(config.dir) * leafOffset(j);
  const oz = Math.cos(config.dir) * leafOffset(j);
  return { position: [config.hinge[0] + dx * along + ox, config.bottom + h / 2, config.hinge[1] + dz * along + oz], yaw };
};

export const DEFAULT_SPREAD = 8;

export const gallerySlot = (i: number) => {
  const face = Math.floor(i / GALLERY.perFace);
  const wallZ = GALLERY.walls[Math.floor(face / 2)];
  const side = face % 2 === 0 ? -1 : 1;
  const k = side < 0 ? GALLERY.perFace - 1 - (i % GALLERY.perFace) : i % GALLERY.perFace;
  const pitch = GALLERY.length / GALLERY.perFace;
  return { wallZ, side, x: GALLERY.x0 + pitch / 2 + k * pitch };
};

const galleryPose = (i: number): Pose => {
  const { h, t } = SLAB["1200x2400"];
  const { wallZ, side, x } = gallerySlot(i);
  return {
    position: [x, GALLERY.bottom + h / 2, wallZ + side * (GALLERY.thick / 2 + GALLERY.gap + t / 2)],
    yaw: side > 0 ? 0 : Math.PI,
  };
};

// The pose of every tile of a size while its display is at rest.
export function restPose(size: SizeKey, i: number): Pose {
  switch (size) {
    case "1600x3200":
      return sliderPose(i);
    case "800x2400":
      return cabinetPose(i);
    case "800x3200":
      return aframePose(i);
    case "800x3000": {
      const { tower, face } = towerSlot(i);
      const local = towerLocalPose(face);
      return { ...local, position: [TOWERS.xs[tower] + local.position[0], local.position[1], TOWERS.z + local.position[2]] };
    }
    case "1200x3000":
      return leafPose(BOOK, size, Math.floor(i / 2), DEFAULT_SPREAD);
    case "1200x2780":
      return leafPose(WING, size, Math.floor(i / 2), DEFAULT_SPREAD);
    case "1200x2400":
      return galleryPose(i);
  }
}

export const selectedPose = {
  slider: (i: number) => sliderPose(i, 1),
  cabinet: (i: number) => cabinetPose(i, 1),
  aframe: (i: number) => aframePose(i, 1),
  leaf: (size: "1200x3000" | "1200x2780", j: number, spread: number) => leafPose(size === "1200x3000" ? BOOK : WING, size, j, spread),
};

// --- Where a visitor stands to see a tile -------------------------------------
export function standFor(size: SizeKey, i: number): View {
  switch (size) {
    case "1600x3200": {
      const [x, , z] = sliderPose(i, 1).position;
      return { position: [x + 4.3, EYE, z + 0.9], target: [x, 1.8, z] };
    }
    case "800x2400": {
      const [x, , z] = cabinetPose(i, 1).position;
      return { position: [x + 1.1, EYE, z + 3.3], target: [x, 1.35, z] };
    }
    case "800x3200": {
      const { frame, side, x } = aframeSlot(i);
      const z = frame.z + side * (AFRAME.foot + AFRAME.lift);
      return { position: [x, EYE, z + side * 3.6], target: [x, 1.8, z] };
    }
    case "800x3000": {
      const { tower } = towerSlot(i);
      const x = TOWERS.xs[tower];
      return { position: [x, EYE, TOWERS.z + 4.4], target: [x, 1.7, TOWERS.z + TOWER_APOTHEM] };
    }
    case "1200x3000":
    case "1200x2780": {
      const config = size === "1200x3000" ? BOOK : WING;
      const dx = Math.cos(config.dir);
      const dz = -Math.sin(config.dir);
      const [hx, hz] = config.hinge;
      return { position: [hx + dx * 4.1, EYE, hz + dz * 4.1], target: [hx + dx * 0.7, 1.65, hz + dz * 0.7] };
    }
    case "1200x2400": {
      const { wallZ, side, x } = gallerySlot(i);
      const face = wallZ + side * (GALLERY.thick / 2);
      // Faces inside the gallery aisle have less room to step back.
      const aisle = (wallZ === GALLERY.walls[0]) === side > 0;
      const back = aisle ? 3.0 : wallZ === GALLERY.walls[1] ? 2.6 : 3.4;
      return { position: [x, EYE, face + side * back], target: [x, 1.5, face] };
    }
  }
}

// Hero slabs on the back wall belong to the 1600 × 3200 range.
export const heroStand = (i: number): View => ({
  position: [HERO.xs[i], EYE, HERO.z + 4.3],
  target: [HERO.xs[i], 1.75, HERO.z],
});

// --- Zones -----------------------------------------------------------------
// Each display's footprint centre, a radius for "near", and where its name floats.
export const ZONES: Record<SizeKey, { center: [number, number]; radius: number; label: Vec3; overview: View }> = {
  "1600x3200": { center: [-10, -9], radius: 4.6, label: [-13, 4.1, -9.2], overview: { position: [-8.6, EYE, -5.6], target: [-12.4, 1.8, -9.2] } },
  "800x2400": { center: [-14, -4.6], radius: 3.2, label: [-15.3, 3.2, -4.7], overview: { position: [-12.2, EYE, -1.9], target: [-15.2, 1.4, -4.7] } },
  "800x3200": { center: [-9.2, 1.2], radius: 4.4, label: [-9.2, 3.9, 1.2], overview: { position: [-4.2, EYE, 1.2], target: [-9.2, 1.6, 1.2] } },
  "800x3000": { center: [9.2, -3.6], radius: 5, label: [9.2, 3.8, -4.5], overview: { position: [9.2, EYE, 0.4], target: [9.2, 1.7, -4.5] } },
  "1200x3000": { center: [-12.5, 8], radius: 3.4, label: [-13.6, 3.7, 8.0], overview: { position: [-10.6, EYE, 8.0], target: [-14, 1.6, 8.0] } },
  "1200x2780": { center: [13.5, -8.3], radius: 3.4, label: [15.0, 3.6, -8.3], overview: { position: [12.6, EYE, -8.3], target: [15.6, 1.5, -8.3] } },
  "1200x2400": { center: [9.5, 4], radius: 5.4, label: [9.5, 3.6, 4.0], overview: { position: [9.5, EYE, -0.4], target: [9.5, 1.5, 2.2] } },
};

// --- Solid things a visitor can't walk through --------------------------------
export type Rect = { minX: number; maxX: number; minZ: number; maxZ: number };
export type Circle = { x: number; z: number; r: number };

export const COLLIDE_RECTS: Rect[] = [
  // Sliding rack, including the space a slab slides into.
  { minX: SLIDER.x0 - 0.15, maxX: SLIDER.x0 + 29 * SLIDER.pitch + 0.15, minZ: ROOM.minZ, maxZ: SLIDER.zRest + 0.8 + SLIDER.pull },
  // Pull-out cabinet and a pulled frame.
  { minX: ROOM.minX, maxX: CABINET.xRest + CABINET.pull + 0.45, minZ: CABINET.z0 - 0.15, maxZ: CABINET.z0 + 29 * CABINET.pitch + 0.15 },
  // A-frames.
  ...AFRAME.frames.map((frame) => ({
    minX: frame.x0 - 0.1,
    maxX: frame.x0 + AFRAME.perSide * AFRAME.pitch + 0.1,
    minZ: frame.z - AFRAME.foot - AFRAME.lift - 0.1,
    maxZ: frame.z + AFRAME.foot + AFRAME.lift + 0.1,
  })),
  // Gallery walls.
  ...GALLERY.walls.map((z) => ({ minX: GALLERY.x0, maxX: GALLERY.x0 + GALLERY.length, minZ: z - 0.14, maxZ: z + 0.14 })),
  // Reception desk.
  RECEPTION,
  // Hero slabs.
  { minX: -4, maxX: 4, minZ: ROOM.minZ, maxZ: HERO.z + 0.2 },
];

export const COLLIDE_CIRCLES: Circle[] = [
  ...TOWERS.xs.map((x) => ({ x, z: TOWERS.z, r: TOWER_APOTHEM + 0.12 })),
  { x: BOOK.hinge[0], z: BOOK.hinge[1], r: 1.35 },
  { x: WING.hinge[0], z: WING.hinge[1], r: 1.35 },
];

// --- Lights --------------------------------------------------------------------
// Ceiling fittings are baked into the room. Display spots also light the slabs live.
export const CEILING_LIGHTS = [-12, -6, 0, 6, 12].flatMap((x) => [-8, -3, 2, 7].map((z) => [x, z] as [number, number]));

export type Spot = { position: Vec3; target: Vec3; angle: number; power: number };
export const SPOTS: Spot[] = [
  ...HERO.xs.map((x) => ({ position: [x, 4.6, -8.4] as Vec3, target: [x, 1.7, -10.95] as Vec3, angle: 28, power: 500 })),
  { position: [-10.2, 4.6, -7.0], target: [-13.0, 1.6, -8.6], angle: 40, power: 900 },
  { position: [-13.2, 4.6, -2.6], target: [-14.6, 1.3, -4.6], angle: 38, power: 500 },
  ...AFRAME.frames.flatMap((frame) =>
    [-1, 1].map((side) => ({
      position: [frame.x0 + 3.4, 4.6, frame.z + side * 2.0] as Vec3,
      target: [frame.x0 + 3.4, 1.4, frame.z] as Vec3,
      angle: 48,
      power: 600,
    })),
  ),
  ...TOWERS.xs.map((x) => ({ position: [x, 4.6, TOWERS.z + 2.2] as Vec3, target: [x, 1.5, TOWERS.z] as Vec3, angle: 32, power: 450 })),
  { position: [BOOK.hinge[0] + 2.6, 4.6, BOOK.hinge[1]], target: [BOOK.hinge[0] + 0.6, 1.5, BOOK.hinge[1]], angle: 42, power: 600 },
  { position: [WING.hinge[0] - 2.6, 4.6, WING.hinge[1]], target: [WING.hinge[0] - 0.6, 1.5, WING.hinge[1]], angle: 42, power: 600 },
  ...[2.2, 5.8].flatMap((z) =>
    [-1, 1].map((side) => ({
      position: [GALLERY.x0 + GALLERY.length / 2, 4.6, z + side * 1.6] as Vec3,
      target: [GALLERY.x0 + GALLERY.length / 2, 1.4, z] as Vec3,
      angle: 60,
      power: 700,
    })),
  ),
];

// --- Static fittings, for Blender ----------------------------------------------
export type Material = "floor" | "plaster" | "ceiling" | "accent" | "steel" | "oak" | "stone" | "lamp" | "proxy";
export type Prim =
  | { shape: "box"; size: Vec3; position: Vec3; yaw?: number; pitch?: number; material: Material; group: string }
  | { shape: "cylinder"; radius: number; height: number; segments: number; position: Vec3; yaw?: number; material: Material; group: string };

const box = (min: Vec3, max: Vec3, material: Material, group = "fixtures"): Prim => ({
  shape: "box",
  size: [max[0] - min[0], max[1] - min[1], max[2] - min[2]],
  position: [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2],
  material,
  group,
});

// A beam of a given cross-section between two points in a plane of constant x.
const beamYZ = (x: number, from: [number, number], to: [number, number], width: number, depth: number, material: Material): Prim => {
  const [y0, z0] = from;
  const [y1, z1] = to;
  const length = Math.hypot(y1 - y0, z1 - z0);
  // Pitch tips local +y towards +z by the beam's slope.
  return {
    shape: "box",
    size: [width, length, depth],
    position: [x, (y0 + y1) / 2, (z0 + z1) / 2],
    pitch: Math.atan2(z1 - z0, y1 - y0),
    material,
    group: "fixtures",
  };
};

export function shellPrims(): Prim[] {
  const { minX, maxX, minZ, maxZ, height: H, wall: W } = ROOM;
  const prims: Prim[] = [
    box([minX - W, -0.2, minZ - W], [maxX + W, 0, maxZ + W], "floor", "floor"),
    box([minX - W, H, minZ - W], [maxX + W, H + 0.2, maxZ + W], "ceiling", "shell"),
    box([minX - W, 0, minZ - W], [maxX + W, H, minZ], "plaster", "shell"),
    box([minX - W, 0, minZ], [minX, H, maxZ], "plaster", "shell"),
    box([maxX, 0, minZ], [maxX + W, H, maxZ], "plaster", "shell"),
    // Charcoal panel behind the hero slabs.
    box([-4.2, 0, minZ], [4.2, 4.2, minZ + 0.04], "accent", "shell"),
    // Skirting.
    box([minX, 0, minZ], [maxX, 0.08, minZ + 0.015], "accent", "shell"),
    box([minX, 0, minZ], [minX + 0.015, 0.08, maxZ], "accent", "shell"),
    box([maxX - 0.015, 0, minZ], [maxX, 0.08, maxZ], "accent", "shell"),
  ];

  // Front wall, built around its openings.
  const cuts = [...OPENINGS].sort((a, b) => a.minX - b.minX);
  let x = minX - W;
  for (const cut of cuts) {
    prims.push(box([x, 0, maxZ], [cut.minX, H, maxZ + W], "plaster", "shell"));
    if (cut.minY > 0) prims.push(box([cut.minX, 0, maxZ], [cut.maxX, cut.minY, maxZ + W], "plaster", "shell"));
    prims.push(box([cut.minX, cut.maxY, maxZ], [cut.maxX, H, maxZ + W], "plaster", "shell"));
    // Black window and door frames.
    prims.push(box([cut.minX - 0.06, cut.minY, maxZ - 0.02], [cut.minX, cut.maxY + 0.06, maxZ + W], "steel"));
    prims.push(box([cut.maxX, cut.minY, maxZ - 0.02], [cut.maxX + 0.06, cut.maxY + 0.06, maxZ + W], "steel"));
    prims.push(box([cut.minX, cut.maxY, maxZ - 0.02], [cut.maxX, cut.maxY + 0.06, maxZ + W], "steel"));
    x = cut.maxX;
  }
  prims.push(box([x, 0, maxZ], [maxX + W, H, maxZ + W], "plaster", "shell"));
  return prims;
}

export function fixturePrims(): Prim[] {
  const prims: Prim[] = [];

  // Ceiling lights: slim panels, visible but not baked (they glow).
  for (const [x, z] of CEILING_LIGHTS) {
    prims.push(box([x - 0.75, ROOM.height - 0.04, z - 0.15], [x + 0.75, ROOM.height, z + 0.15], "lamp", "lamps"));
  }
  // Track spots: a small dark can per light.
  for (const spot of SPOTS) {
    const [x, y, z] = spot.position;
    prims.push({ shape: "cylinder", radius: 0.06, height: 0.16, segments: 16, position: [x, y + 0.04, z], material: "steel", group: "fixtures" });
    prims.push(box([x - 0.015, y + 0.12, z - 0.015], [x + 0.015, ROOM.height, z + 0.015], "steel"));
  }

  // Sliding rack: a ceiling-hung frame with a floor guide.
  const rackMinX = SLIDER.x0 - 0.1;
  const rackMaxX = SLIDER.x0 + 29 * SLIDER.pitch + 0.1;
  const rackMaxZ = SLIDER.zRest + 0.8 + SLIDER.pull + 0.05;
  prims.push(box([rackMinX, SLIDER.railY + 0.02, ROOM.minZ + 0.05], [rackMaxX, SLIDER.railY + 0.14, rackMaxZ], "steel"));
  for (const x of [rackMinX + 0.05, rackMaxX - 0.05]) {
    for (const z of [ROOM.minZ + 0.15, rackMaxZ - 0.1]) {
      prims.push(box([x - 0.02, SLIDER.railY + 0.14, z - 0.02], [x + 0.02, ROOM.height, z + 0.02], "steel"));
    }
  }
  prims.push(box([rackMinX, 0, SLIDER.zRest - 0.85], [rackMaxX, 0.06, SLIDER.zRest + 0.85], "steel"));

  // Pull-out cabinet: an open-fronted carcass against the left wall.
  const cabMinZ = CABINET.z0 - 0.12;
  const cabMaxZ = CABINET.z0 + 29 * CABINET.pitch + 0.12;
  const cabMaxX = CABINET.xRest + 0.5;
  prims.push(box([ROOM.minX, 0, cabMinZ], [cabMaxX, CABINET.bottom - 0.01, cabMaxZ], "oak"));
  prims.push(box([ROOM.minX, CABINET.top, cabMinZ], [cabMaxX, CABINET.top + 0.08, cabMaxZ], "oak"));
  prims.push(box([ROOM.minX, 0, cabMinZ - 0.04], [cabMaxX, CABINET.top + 0.08, cabMinZ], "oak"));
  prims.push(box([ROOM.minX, 0, cabMaxZ], [cabMaxX, CABINET.top + 0.08, cabMaxZ + 0.04], "oak"));
  prims.push(box([ROOM.minX, 0, cabMinZ], [ROOM.minX + 0.04, CABINET.top, cabMaxZ], "oak"));

  // A-frames: two end frames, a ridge, a centre support and a ledge each side.
  for (const frame of AFRAME.frames) {
    const length = AFRAME.perSide * AFRAME.pitch;
    const ridgeY = AFRAME.bottom + Math.cos(AFRAME.lean) * SLAB["800x3200"].h;
    for (const x of [frame.x0 + 0.03, frame.x0 + length / 2, frame.x0 + length - 0.03]) {
      for (const side of [-1, 1]) {
        prims.push(beamYZ(x, [0, frame.z + side * (AFRAME.foot + 0.06)], [ridgeY + 0.04, frame.z + side * 0.02], 0.05, 0.05, "steel"));
      }
      prims.push(box([x - 0.025, 0, frame.z - AFRAME.foot - 0.12], [x + 0.025, 0.05, frame.z + AFRAME.foot + 0.12], "steel"));
    }
    prims.push(box([frame.x0, ridgeY - 0.02, frame.z - 0.06], [frame.x0 + length, ridgeY + 0.06, frame.z + 0.06], "steel"));
    for (const side of [-1, 1]) {
      const z = frame.z + side * (AFRAME.foot + 0.05);
      prims.push(box([frame.x0, 0, Math.min(z, z + side * 0.1)], [frame.x0 + length, AFRAME.bottom, Math.max(z, z + side * 0.1)], "steel"));
    }
  }

  // Rotating towers: a turntable plinth and a column core; the slabs turn round it.
  for (const x of TOWERS.xs) {
    prims.push({ shape: "cylinder", radius: TOWER_APOTHEM + 0.16, height: TOWERS.bottom - 0.005, segments: 48, position: [x, (TOWERS.bottom - 0.005) / 2, TOWERS.z], material: "steel", group: "fixtures" });
    prims.push({ shape: "cylinder", radius: TOWERS.core, height: SLAB["800x3000"].h, segments: 40, position: [x, TOWERS.bottom + SLAB["800x3000"].h / 2, TOWERS.z], material: "accent", group: "fixtures" });
  }

  // Swing book: a floor plate and a hinge post.
  for (const [config, size, wall] of [
    [BOOK, "1200x3000", false],
    [WING, "1200x2780", true],
  ] as const) {
    const [hx, hz] = config.hinge;
    const top = config.bottom + SLAB[size].h + 0.1;
    prims.push({ shape: "cylinder", radius: 0.045, height: top, segments: 20, position: [hx, top / 2, hz], material: "steel", group: "fixtures" });
    if (wall) {
      prims.push(box([hx, 0.1, hz - 0.08], [ROOM.maxX, top, hz + 0.08], "steel"));
    } else {
      prims.push({ shape: "cylinder", radius: 0.35, height: 0.03, segments: 40, position: [hx, 0.015, hz], material: "steel", group: "fixtures" });
    }
  }

  // Gallery walls.
  for (const z of GALLERY.walls) {
    prims.push(box([GALLERY.x0, 0, z - GALLERY.thick / 2], [GALLERY.x0 + GALLERY.length, GALLERY.height, z + GALLERY.thick / 2], "plaster"));
    prims.push(box([GALLERY.x0, GALLERY.height, z - GALLERY.thick / 2 - 0.01], [GALLERY.x0 + GALLERY.length, GALLERY.height + 0.04, z + GALLERY.thick / 2 + 0.01], "accent"));
  }

  // Reception desk: oak body with a stone top.
  const r = RECEPTION;
  prims.push(box([r.minX, 0, r.minZ], [r.maxX, r.height - 0.04, r.maxZ], "oak"));
  prims.push(box([r.minX - 0.03, r.height - 0.04, r.minZ - 0.03], [r.maxX + 0.03, r.height, r.maxZ + 0.03], "stone"));

  return prims;
}
