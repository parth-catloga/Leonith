// Writes everything Blender needs to model and light the showroom into
// scripts/showroom/spec.json. Run with `node --no-warnings scripts/showroom/export-spec.mjs`.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CEILING_LIGHTS,
  HERO,
  OPENINGS,
  ROOM,
  SLAB,
  SPOTS,
  fixturePrims,
  heroPose,
  restPose,
  shellPrims,
} from "../../app/components/showroom/floorPlan.ts";

const sizes = Object.keys(SLAB);

// Stand-in slabs at their rest poses, so the bake catches their shadows on the
// floor. They are removed before the room is exported.
const proxies = sizes.flatMap((size) => {
  const { w, h, t } = SLAB[size];
  return Array.from({ length: 30 }, (_, i) => {
    const pose = restPose(size, i);
    return { shape: "box", size: [w, h, Math.max(t, 0.01)], position: pose.position, yaw: pose.yaw, pitch: pose.pitch, material: "proxy", group: "proxy" };
  });
});
HERO.xs.forEach((_, i) => {
  const pose = heroPose(i);
  const { w, h, t } = SLAB["1600x3200"];
  proxies.push({ shape: "box", size: [w, h, t], position: pose.position, yaw: pose.yaw, material: "proxy", group: "proxy" });
});

const spec = {
  room: ROOM,
  openings: OPENINGS,
  ceilingLights: CEILING_LIGHTS,
  spots: SPOTS,
  prims: [...shellPrims(), ...fixturePrims(), ...proxies],
};

const out = join(dirname(fileURLToPath(import.meta.url)), "spec.json");
writeFileSync(out, JSON.stringify(spec));
console.log(`Wrote ${spec.prims.length} prims to ${out}`);
