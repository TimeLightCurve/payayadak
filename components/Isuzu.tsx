import * as THREE from 'three'
import { JSX, memo, useEffect, useMemo, useRef } from 'react'
import { Html, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
 nodes: {
     axel_back: THREE.Mesh
     axel_front: THREE.Mesh
     axel_holder_back: THREE.Mesh
     axel_holder_front: THREE.Mesh
     Object_10: THREE.Mesh
     Object_11001: THREE.Mesh
     Object_12: THREE.Mesh
     Object_13: THREE.Mesh
     Object_14: THREE.Mesh
     Object_2: THREE.Mesh
     Object_3: THREE.Mesh
     Object_4: THREE.Mesh
     Object_5: THREE.Mesh
     Object_6: THREE.Mesh
     Object_7: THREE.Mesh
     Object_8: THREE.Mesh
     Object_9: THREE.Mesh
     wheel_back: THREE.Mesh
     pich_back: THREE.Mesh
     wheel_inside2_back: THREE.Mesh
     wheel_inside_back: THREE.Mesh
     wheel_inside2_front: THREE.Mesh
     pich_front: THREE.Mesh
     wheel_fron_inside: THREE.Mesh
     wheel_front_left: THREE.Mesh
     wheel_front_right: THREE.Mesh
     Object_6001: THREE.Mesh
   }
   materials: {
     mat_2: THREE.MeshStandardMaterial
     object_16: THREE.MeshStandardMaterial
     object_17: THREE.MeshStandardMaterial
     object_18: THREE.MeshStandardMaterial
     object_2: THREE.MeshStandardMaterial
     object_8: THREE.MeshStandardMaterial
     mat_1: THREE.MeshStandardMaterial
     mat_3: THREE.MeshStandardMaterial
     object_0: THREE.MeshStandardMaterial
     object_11: THREE.MeshStandardMaterial
     object_13: THREE.MeshStandardMaterial
     object_14: THREE.MeshStandardMaterial
     object_15: THREE.MeshStandardMaterial
     material_1: THREE.MeshStandardMaterial
   }
}

type Spring = {
  position: number
  velocity: number
}

export type TruckPartFocus = {
  id: string
  label: string
  target: THREE.Vector3
}

type IsuzuProps = JSX.IntrinsicElements['group'] & {
  activePartId?: string | null
  onFocusPart?: (focus: TruckPartFocus) => void
}

type PartHotspotProps = {
  id: string
  label: string
  position: [number, number, number]
  active: boolean
  onSelect?: (focus: TruckPartFocus) => void
}

type HotspotDefinition = Omit<PartHotspotProps, 'active' | 'onSelect'>

const BODY_HOTSPOTS: HotspotDefinition[] = [
  { id: 'cab', label: 'کابین و اتاق راننده', position: [0, 58, 98] },
  { id: 'engine', label: 'موتور', position: [0, 30, 72] },
  { id: 'driveline', label: 'گیربکس و سیستم انتقال قدرت', position: [0, 22, 20] },
  { id: 'cargo', label: 'اتاق بار و شاسی', position: [0, 58, -35] },
]

const REAR_AXLE_HOTSPOT: HotspotDefinition = {
  id: 'rear-axle',
  label: 'چرخ و محور عقب',
  position: [0, 18, -48],
}

const FRONT_AXLE_HOTSPOT: HotspotDefinition = {
  id: 'front-axle',
  label: 'چرخ و محور جلو',
  position: [0, 18, 82],
}

const FRONT_WHEEL_PIVOT: [number, number, number] = [0, 11.5, 82.3]
const REAR_WHEEL_PIVOT: [number, number, number] = [0, 11.3, -48.2]
const WHEELBASE = FRONT_WHEEL_PIVOT[2] - REAR_WHEEL_PIVOT[2]
const WHEEL_SPEED = 7.2
const REAR_AXLE_DELAY = 0.68

/**
 * Merges baked Blender geometry that shares a material and a moving parent.
 * Attributes not present on every source are omitted; the affected materials
 * do not use textures, so dropping an unused UV attribute is safe.
 */
function mergeCompatibleGeometries(...geometries: THREE.BufferGeometry[]) {
  const clones = geometries.map((geometry) => geometry.clone())
  const sharedAttributes = new Set(Object.keys(clones[0].attributes))

  for (const geometry of clones.slice(1)) {
    for (const attribute of sharedAttributes) {
      if (!geometry.hasAttribute(attribute)) sharedAttributes.delete(attribute)
    }
  }

  for (const geometry of clones) {
    for (const attribute of Object.keys(geometry.attributes)) {
      if (!sharedAttributes.has(attribute)) geometry.deleteAttribute(attribute)
    }
  }

  const merged = mergeGeometries(clones)
  clones.forEach((geometry) => geometry.dispose())

  if (!merged) throw new Error('Unable to merge compatible Isuzu geometry')
  return merged
}

/** Semi-implicit spring integration, evaluated in fixed-size substeps. */
function stepSpring(
  spring: Spring,
  target: number,
  frequency: number,
  damping: number,
  delta: number,
) {
  const angularFrequency = Math.PI * 2 * frequency
  const acceleration =
    (target - spring.position) * angularFrequency * angularFrequency -
    2 * damping * angularFrequency * spring.velocity

  spring.velocity += acceleration * delta
  spring.position += spring.velocity * delta
}

/** A repeatable road profile. Rear wheels sample this later than front wheels. */
function roadHeight(time: number) {
  const asphalt =
    Math.sin(time * 2.7) * 1.05 +
    Math.sin(time * 6.9 + 0.8) * 0.22 +
    Math.sin(time * 13.1 + 2.1) * 0.16

  const cycle = 5.6
  const phase = ((time % cycle) + cycle) % cycle
  const bump = phase < 0.52 ? Math.sin((phase / 0.52) * Math.PI) * 2.4 : 0

  return asphalt 
}

const PartHotspot = memo(function PartHotspot({
  id,
  label,
  position,
  active,
  onSelect,
}: PartHotspotProps) {
  const anchor = useRef<THREE.Group>(null)

  const selectPart = () => {
    if (!anchor.current || !onSelect) return

    const target = new THREE.Vector3()
    anchor.current.getWorldPosition(target)
    onSelect({ id, label, target })
  }

  return (
    <group ref={anchor} position={position} name={`hotspot_${id}`}>
      <Html center zIndexRange={[40, 10]}>
        <button
          type="button"
          aria-label={`نمایش ${label}`}
          aria-pressed={active}
          onClick={selectPart}
          onPointerDown={(event) => event.stopPropagation()}
          className={`group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border backdrop-blur-md transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-cyan ${
            active
              ? 'scale-110 border-neon-orange bg-neon-orange/25 shadow-[0_0_0_5px_rgb(232_98_61_/_14%),0_0_24px_rgb(232_98_61_/_70%)]'
              : 'border-white/60 bg-navy-900/75 shadow-[0_0_0_5px_rgb(58_160_255_/_10%),0_0_18px_rgb(58_160_255_/_45%)] hover:scale-110 hover:border-neon-cyan'
          }`}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              active
                ? 'bg-neon-orange shadow-[0_0_12px_#e8623d]'
                : 'bg-white shadow-[0_0_12px_white]'
            }`}
          />
          <span
            className={`pointer-events-none absolute bottom-[calc(100%+0.65rem)] left-1/2 w-max -translate-x-1/2 rounded-sm border border-white/15 bg-navy-950/95 px-3 py-2 text-xs font-bold whitespace-nowrap text-white shadow-xl backdrop-blur-xl transition duration-200 ${
              active
                ? 'translate-y-0 opacity-100'
                : 'translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100'
            }`}
          >
            {label}
          </span>
        </button>
      </Html>
    </group>
  )
})

export function Isuzu({ activePartId = null, onFocusPart, ...props }: IsuzuProps) {
  const { nodes, materials } = useGLTF('/isuzu4.glb') as unknown as GLTFResult
  const body = useRef<THREE.Group>(null)
  const frontAxle = useRef<THREE.Group>(null)
  const rearAxle = useRef<THREE.Group>(null)
  const frontWheels = useRef<THREE.Group>(null)
  const rearWheels = useRef<THREE.Group>(null)

  const frontSuspension = useRef<Spring>({ position: 0, velocity: 0 })
  const rearSuspension = useRef<Spring>({ position: 0, velocity: 0 })
  const bodyHeave = useRef<Spring>({ position: 0, velocity: 0 })
  const bodyPitch = useRef<Spring>({ position: 0, velocity: 0 })
  const bodyRoll = useRef<Spring>({ position: 0, velocity: 0 })

  const merged = useMemo(
    () => ({
      bodyBlack: mergeCompatibleGeometries(
        nodes.Object_3.geometry,        
      ),      
      rearAxle: mergeCompatibleGeometries(
        nodes.axel_back.geometry,
        nodes.axel_holder_back.geometry,
      ),
      frontAxle: mergeCompatibleGeometries(
        nodes.axel_front.geometry,
        nodes.axel_holder_front.geometry,
      ),
      frontTires: mergeCompatibleGeometries(
        nodes.wheel_front_left.geometry,
        nodes.wheel_front_right.geometry,
      ),
    }),
    [nodes],
  )

  useEffect(
    () => () => {
      Object.values(merged).forEach((geometry) => geometry.dispose())
    },
    [merged],
  )

  useFrame(({ clock }, frameDelta) => {
    if (!body.current || !frontAxle.current || !rearAxle.current) return

    // Avoid a large physics jump when the tab becomes active again.
    const frameTime = Math.min(frameDelta, 1 / 30)
    const substepCount = Math.max(1, Math.ceil(frameTime / (1 / 120)))
    const delta = frameTime / substepCount
    const time = clock.getElapsedTime()

    for (let step = 1; step <= substepCount; step += 1) {
      const simulationTime = time - frameTime + delta * step
      const frontRoad = roadHeight(simulationTime)
      const rearRoad = roadHeight(simulationTime - REAR_AXLE_DELAY)

      stepSpring(frontSuspension.current, frontRoad, 7.5, 0.82, delta)
      stepSpring(rearSuspension.current, rearRoad, 6.8, 0.88, delta)

      const frontTravel = frontSuspension.current.position
      const rearTravel = rearSuspension.current.position
      const heaveTarget = (frontTravel + rearTravel) * 0.34
      const pitchTarget = (rearTravel - frontTravel) / WHEELBASE
      const rollTarget =
        Math.sin(simulationTime * 1.37 + 0.4) * 0.004 +
        Math.sin(simulationTime * 3.1) * 0.0015

      stepSpring(bodyHeave.current, heaveTarget, 1.65, 0.68, delta)
      stepSpring(bodyPitch.current, pitchTarget, 1.9, 0.72, delta)
      stepSpring(bodyRoll.current, rollTarget, 1.25, 0.78, delta)
    }

    frontAxle.current.position.y = frontSuspension.current.position
    rearAxle.current.position.y = rearSuspension.current.position

    const engineVibration =
      Math.sin(time * 17.5) * 0.075 + Math.sin(time * 23.2 + 0.6) * 0.035

    body.current.position.y = bodyHeave.current.position + engineVibration
    body.current.rotation.x = bodyPitch.current.position
    body.current.rotation.z = bodyRoll.current.position

    const wheelRotation = WHEEL_SPEED * frameTime
    if (frontWheels.current) frontWheels.current.rotation.x += wheelRotation
    if (rearWheels.current) rearWheels.current.rotation.x += wheelRotation
  })

  return (
    <group {...props} dispose={null}>
      <group scale={0.025} rotation={[0, Math.PI / 3.1, 0]} position={[-1.5, 0, 0]}>
        <group ref={body} name="truck_body">
          <mesh geometry={nodes.Object_10.geometry} material={materials.object_16} castShadow />
          <mesh geometry={nodes.Object_11001.geometry} material={materials.object_17} castShadow />
          <mesh geometry={nodes.Object_12.geometry} material={materials.object_18} castShadow />
          <mesh geometry={nodes.Object_13.geometry} material={materials.object_2} castShadow />
          <mesh geometry={nodes.Object_14.geometry} material={materials.object_8} castShadow />
          <mesh geometry={nodes.Object_2.geometry} material={materials.mat_1} castShadow />
          <mesh geometry={merged.bodyBlack} material={materials.mat_2} castShadow />
          <mesh geometry={nodes.Object_4.geometry} material={materials.mat_3} castShadow />
          <mesh geometry={nodes.Object_5.geometry} material={materials.object_0} castShadow />
          <mesh geometry={nodes.Object_6.geometry} material={materials.object_11} castShadow />
          <mesh geometry={nodes.Object_7.geometry} material={materials.object_13} castShadow />
          <mesh geometry={nodes.Object_8.geometry} material={materials.object_14} castShadow />
          <mesh geometry={nodes.Object_9.geometry} material={materials.object_15} castShadow />
          <mesh geometry={nodes.Object_6001.geometry} material={materials.material_1} />


          {BODY_HOTSPOTS.map((hotspot) => (
            <PartHotspot
              key={hotspot.id}
              {...hotspot}
              active={activePartId === hotspot.id}
              onSelect={onFocusPart}
            />
          ))}
        </group>

        <group ref={rearAxle} name="rear_axle_assembly">
          <mesh geometry={merged.rearAxle} material={materials.mat_2} castShadow />
          <group ref={rearWheels} position={REAR_WHEEL_PIVOT} name="rear_wheels">
            <group position={[0, -REAR_WHEEL_PIVOT[1], -REAR_WHEEL_PIVOT[2]]}>
              <mesh geometry={nodes.wheel_back.geometry} material={materials.object_16} castShadow />
              <mesh geometry={nodes.pich_back.geometry} material={materials.object_18} castShadow />
              <mesh geometry={nodes.wheel_inside2_back.geometry} material={materials.mat_2} castShadow />
              <mesh geometry={nodes.wheel_inside_back.geometry} material={materials.object_17} castShadow />
            </group>
          </group>
          <PartHotspot
            {...REAR_AXLE_HOTSPOT}
            active={activePartId === REAR_AXLE_HOTSPOT.id}
            onSelect={onFocusPart}
          />
        </group>

        <group ref={frontAxle} name="front_axle_assembly">
          <mesh geometry={merged.frontAxle} material={materials.mat_2} castShadow />
          <group ref={frontWheels} position={FRONT_WHEEL_PIVOT} name="front_wheels">
            <group position={[0, -FRONT_WHEEL_PIVOT[1], -FRONT_WHEEL_PIVOT[2]]}>
              <mesh geometry={nodes.wheel_inside2_front.geometry} material={materials.mat_2} castShadow />
              <mesh geometry={nodes.pich_front.geometry} material={materials.object_18} castShadow />
              <mesh geometry={nodes.wheel_fron_inside.geometry} material={materials.object_17} castShadow />
              <mesh geometry={merged.frontTires} material={materials.object_16} castShadow />
            </group>
          </group>
          <PartHotspot
            {...FRONT_AXLE_HOTSPOT}
            active={activePartId === FRONT_AXLE_HOTSPOT.id}
            onSelect={onFocusPart}
          />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/isuzu2.glb')
