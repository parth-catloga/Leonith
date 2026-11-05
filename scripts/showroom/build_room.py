"""Models, lights and bakes the Leonith showroom, then exports it for the web.

    node --no-warnings scripts/showroom/export-spec.mjs
    blender -b --python scripts/showroom/build_room.py -- [--quick]

Reads scripts/showroom/spec.json (written from app/components/showroom/floorPlan.ts)
and writes to public/showroom/:
  room.glb             the room and fittings, with a second UV set for lightmaps
  lightmap-*.webp      baked light for each part of the room
  env.hdr              a 360 view from the middle of the room, for reflections
  manifest.json        how bright each lightmap is, and where the panorama faces

Coordinates in the spec are three.js (y up, +z to the entrance). Blender is
z up, so (x, y, z) becomes (x, -z, y); the glTF exporter turns it back.
"""

import json
import math
import os
import sys

import bmesh
import bpy
import numpy as np
from mathutils import Matrix, Vector

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SPEC = os.path.join(ROOT, "scripts", "showroom", "spec.json")
OUT = os.path.join(ROOT, "public", "showroom")

args = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
QUICK = "--quick" in args

# Lightmap size and samples per bake. Quick mode is for checking the layout.
BAKES = {
    "floor": (2048, 48) if QUICK else (2048, 320),
    "shell": (2048, 48) if QUICK else (2048, 224),
    "fixtures": (1024, 48) if QUICK else (2048, 224),
}
PANO = (1024, 512, 32) if QUICK else (2048, 1024, 160)

TO_BLENDER = Matrix(((1, 0, 0, 0), (0, 0, -1, 0), (0, 1, 0, 0), (0, 0, 0, 1)))


def bvec(v):
    return Vector((v[0], -v[2], v[1]))


# Linear base colours. Bounce light picks these up, so keep them close to
# what the browser shows.
COLOURS = {
    "floor": (0.3, 0.29, 0.275),
    "plaster": (0.78, 0.755, 0.71),
    "ceiling": (0.82, 0.81, 0.79),
    "accent": (0.035, 0.034, 0.033),
    "steel": (0.03, 0.03, 0.03),
    "oak": (0.36, 0.22, 0.12),
    "stone": (0.7, 0.68, 0.64),
    "lamp": (1.0, 0.97, 0.92),
    "proxy": (0.62, 0.6, 0.57),
}
ROUGHNESS = {"floor": 0.25, "steel": 0.4, "stone": 0.2, "accent": 0.6}


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    prefs = bpy.context.preferences.addons["cycles"].preferences
    try:
        prefs.compute_device_type = "METAL"
        prefs.get_devices()
        for device in prefs.devices:
            # The M1 renders faster on its GPU alone than shared with the CPU.
            device.use = device.type == "METAL"
        scene.cycles.device = "GPU"
    except Exception as error:  # Falls back to the CPU.
        print("GPU unavailable:", error)
    scene.cycles.use_denoising = True
    scene.view_settings.view_transform = "Standard"
    scene.view_settings.look = "None"
    scene.view_settings.exposure = 0
    scene.view_settings.gamma = 1
    return scene


def material(group, key):
    name = f"{group}_{key}"
    if name in bpy.data.materials:
        return bpy.data.materials[name]
    mat = bpy.data.materials.new(name)
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*COLOURS[key], 1)
    bsdf.inputs["Roughness"].default_value = ROUGHNESS.get(key, 0.85)
    if key == "lamp":
        bsdf.inputs["Emission Color"].default_value = (*COLOURS[key], 1)
        bsdf.inputs["Emission Strength"].default_value = 12
    return mat


def build(spec):
    groups = {}
    for prim in spec["prims"]:
        groups.setdefault(prim["group"], []).append(prim)

    objects = {}
    for group, prims in groups.items():
        mesh = bpy.data.meshes.new(group)
        obj = bpy.data.objects.new(group, mesh)
        bpy.context.scene.collection.objects.link(obj)
        bm = bmesh.new()
        slots = []

        for prim in prims:
            pose = (
                Matrix.Translation(Vector(prim["position"]))
                @ Matrix.Rotation(prim.get("yaw", 0) or 0, 4, "Y")
                @ Matrix.Rotation(prim.get("pitch", 0) or 0, 4, "X")
            )
            if prim["shape"] == "box":
                sx, sy, sz = prim["size"]
                scale = Matrix.Diagonal((sx, sy, sz, 1))
                result = bmesh.ops.create_cube(bm, size=1.0, matrix=TO_BLENDER @ pose @ scale)
            else:
                # bmesh cylinders run along local z; three's run along y.
                upright = Matrix.Rotation(-math.pi / 2, 4, "X")
                result = bmesh.ops.create_cone(
                    bm,
                    cap_ends=True,
                    segments=prim["segments"],
                    radius1=prim["radius"],
                    radius2=prim["radius"],
                    depth=prim["height"],
                    matrix=TO_BLENDER @ pose @ upright,
                )
            key = prim["material"]
            if key not in slots:
                slots.append(key)
            index = slots.index(key)
            faces = {face for vert in result["verts"] for face in vert.link_faces}
            for face in faces:
                face.material_index = index

        # Faces on the outside of the building are never seen, so don't spend
        # lightmap space on them.
        room = spec["room"]
        w = room["wall"]
        if group in ("shell", "floor"):
            outside = []
            for face in bm.faces:
                c = face.calc_center_median()
                x, y, z = c.x, c.z, -c.y
                if (
                    x < room["minX"] - w / 2
                    or x > room["maxX"] + w / 2
                    or z < room["minZ"] - w / 2
                    or z > room["maxZ"] + w / 2
                    or y > room["height"] + 0.1
                    or y < -0.1
                ):
                    outside.append(face)
            bmesh.ops.delete(bm, geom=outside, context="FACES")

        bm.to_mesh(mesh)
        bm.free()
        for key in slots:
            mesh.materials.append(material(group, key))
        objects[group] = obj

    return objects


def unwrap(obj, floor=False):
    mesh = obj.data
    while mesh.uv_layers:
        mesh.uv_layers.remove(mesh.uv_layers[0])
    base = mesh.uv_layers.new(name="UVMap")
    if floor:
        # Floor tiles repeat every 1.2 m.
        for loop in mesh.loops:
            co = mesh.vertices[loop.vertex_index].co
            base.data[loop.index].uv = (co.x / 1.2, co.y / 1.2)
    light = mesh.uv_layers.new(name="lightmap")
    mesh.uv_layers.active = light

    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=0.0, area_weight=0.0, correct_aspect=True, scale_to_bounds=False)
    bpy.ops.uv.pack_islands(margin=0.004, rotate=True)
    bpy.ops.object.mode_set(mode="OBJECT")


def light(spec):
    scene = bpy.context.scene

    # Daylight through the front: a soft sky and a low sun.
    world = bpy.data.worlds.new("Sky")
    background = world.node_tree.nodes["Background"]
    background.inputs["Color"].default_value = (0.62, 0.74, 0.95, 1)
    background.inputs["Strength"].default_value = 2.2
    scene.world = world

    sun = bpy.data.lights.new("Sun", "SUN")
    sun.energy = 3.0
    sun.angle = math.radians(2)
    sun_obj = bpy.data.objects.new("Sun", sun)
    sun_obj.rotation_euler = (math.radians(62), 0, math.radians(200))
    scene.collection.objects.link(sun_obj)

    height = spec["room"]["height"]
    for x, z in spec["ceilingLights"]:
        area = bpy.data.lights.new(f"Ceiling {x} {z}", "AREA")
        area.shape = "RECTANGLE"
        area.size = 1.5
        area.size_y = 0.3
        area.energy = 260
        area.color = (1.0, 0.96, 0.9)
        obj = bpy.data.objects.new(area.name, area)
        obj.location = bvec((x, height - 0.05, z))
        scene.collection.objects.link(obj)

    for i, spot in enumerate(spec["spots"]):
        data = bpy.data.lights.new(f"Spot {i}", "SPOT")
        data.energy = spot["power"]
        data.spot_size = math.radians(spot["angle"])
        data.spot_blend = 0.45
        data.shadow_soft_size = 0.05
        data.color = (1.0, 0.94, 0.86)
        obj = bpy.data.objects.new(data.name, data)
        obj.location = bvec(spot["position"])
        direction = bvec(spot["target"]) - bvec(spot["position"])
        obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
        scene.collection.objects.link(obj)


def smooth(pixels, sigma=1.4):
    """Takes the edge off render noise. Only baked texels are averaged, so light
    doesn't leak in from the empty space between UV islands."""
    radius = int(sigma * 3)
    kernel = np.exp(-0.5 * (np.arange(-radius, radius + 1) / sigma) ** 2)
    kernel /= kernel.sum()
    mask = (pixels[:, :, 3] > 0.5).astype(np.float32)
    weighted = np.concatenate([pixels[:, :, :3] * mask[:, :, None], mask[:, :, None]], axis=2)
    for axis in (0, 1):
        out = np.zeros_like(weighted)
        for offset, weight in zip(range(-radius, radius + 1), kernel):
            out += weight * np.roll(weighted, offset, axis=axis)
        weighted = out
    blurred = weighted[:, :, :3] / np.maximum(weighted[:, :, 3:4], 1e-6)
    result = pixels.copy()
    result[:, :, :3] = np.where(mask[:, :, None] > 0, blurred, 0)
    return result


def bake(obj, name, size, samples):
    scene = bpy.context.scene
    scene.cycles.samples = samples
    image = bpy.data.images.new(f"lightmap-{name}", size, size, alpha=True, float_buffer=True)
    image.generated_color = (0, 0, 0, 0)

    for mat in obj.data.materials:
        nodes = mat.node_tree.nodes
        node = nodes.new("ShaderNodeTexImage")
        node.image = image
        nodes.active = node

    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.bake(type="DIFFUSE", pass_filter={"DIRECT", "INDIRECT"}, margin=6, use_clear=True)

    # Lightmaps are stored as 8-bit, so scale the brightest light down to 1
    # and tell the browser the scale.
    pixels = np.empty(size * size * 4, dtype=np.float32)
    image.pixels.foreach_get(pixels)
    pixels = smooth(pixels.reshape(size, size, 4)).reshape(-1, 4)
    covered = pixels[:, 3] > 0.5
    scale = float(np.percentile(pixels[covered, :3], 99.7)) if covered.any() else 1.0
    pixels[:, :3] = np.clip(pixels[:, :3] / scale, 0, 1)
    pixels[:, 3] = 1
    image.pixels.foreach_set(pixels.ravel())

    path = os.path.join(OUT, f"lightmap-{name}.webp")
    settings = scene.render.image_settings
    settings.file_format = "WEBP"
    settings.color_mode = "RGB"
    settings.quality = 92
    image.save_render(path, scene=scene)

    for mat in obj.data.materials:
        nodes = mat.node_tree.nodes
        nodes.remove(nodes.active)
    print(f"Baked {name}: scale {scale:.3f}")
    return scale


def panorama():
    scene = bpy.context.scene
    width, height, samples = PANO
    camera = bpy.data.cameras.new("Pano")
    camera.type = "PANO"
    camera.panorama_type = "EQUIRECTANGULAR"
    obj = bpy.data.objects.new("Pano", camera)
    obj.location = bvec((0, 1.7, 0))
    # Looks along three's -z (Blender +y), level.
    obj.rotation_euler = (math.radians(90), 0, 0)
    scene.collection.objects.link(obj)
    scene.camera = obj
    scene.render.resolution_x = width
    scene.render.resolution_y = height
    scene.render.resolution_percentage = 100
    scene.cycles.samples = samples
    settings = scene.render.image_settings
    settings.file_format = "HDR"
    settings.color_mode = "RGB"
    scene.render.filepath = os.path.join(OUT, "env.hdr")
    bpy.ops.render.render(write_still=True)


def main():
    os.makedirs(OUT, exist_ok=True)
    with open(SPEC) as file:
        spec = json.load(file)

    scene = reset()
    objects = build(spec)
    light(spec)

    # Glowing fittings show in the room and its reflections but don't add light;
    # the area lights under them do the lighting.
    lamps = objects["lamps"]
    lamps.visible_diffuse = False
    lamps.visible_glossy = True
    lamps.visible_shadow = False

    for name in ("floor", "shell", "fixtures"):
        unwrap(objects[name], floor=name == "floor")

    scales = {}
    for name in ("floor", "shell", "fixtures"):
        size, samples = BAKES[name]
        scales[name] = bake(objects[name], name, size, samples)

    panorama()

    # The stand-in slabs only cast baked shadows; the browser draws the real ones.
    bpy.data.objects.remove(objects.pop("proxy"), do_unlink=True)
    for obj in list(scene.objects):
        obj.select_set(obj.name in objects)
    bpy.ops.export_scene.gltf(
        filepath=os.path.join(OUT, "room.glb"),
        export_format="GLB",
        use_selection=True,
        export_yup=True,
        export_texcoords=True,
        export_normals=True,
        export_materials="EXPORT",
        export_lights=False,
        export_cameras=False,
    )

    manifest = {"lightmaps": scales, "pano": {"position": [0, 1.7, 0], "facing": [0, 0, -1]}}
    with open(os.path.join(OUT, "manifest.json"), "w") as file:
        json.dump(manifest, file, indent=2)
    print("Done:", manifest)


main()
