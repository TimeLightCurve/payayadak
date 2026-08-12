import * as THREE from 'three'
import { JSX, memo, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
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
  onPreviewPart?: (focus: TruckPartFocus | null) => void
  onReady?: () => void
  lowPerformance?: boolean
  animationEnabled?: boolean
}

type PartHotspotProps = {
  id: string
  label: string
  position: [number, number, number]
  active: boolean
  onSelect?: (focus: TruckPartFocus) => void
  onPreview?: (focus: TruckPartFocus | null) => void
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
const REAR_AXLE_DELAY = 0.68
const TRUCK_HEADING = Math.PI / 3.1
const CRUISE_WHEEL_SPEED = 5.2

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
    Math.sin(time * 1.8) * 0.42 +
    Math.sin(time * 4.7 + 0.8) * 0.12

  const cycle = 7.2
  const phase = ((time % cycle) + cycle) % cycle
  const bump = phase < 0.7 ? Math.sin((phase / 0.7) * Math.PI) * 0.38 : 0

  return asphalt + bump
}

const PartHotspot = memo(function PartHotspot({
  id,
  label,
  position,
  active,
  onSelect,
  onPreview,
}: PartHotspotProps) {
  const anchor = useRef<THREE.Group>(null)

  const getFocus = () => {
    if (!anchor.current) return null

    const target = new THREE.Vector3()
    anchor.current.getWorldPosition(target)
    return { id, label, target }
  }

  const selectPart = () => {
    const focus = getFocus()
    if (focus) onSelect?.(focus)
  }

  const previewPart = () => {
    const focus = getFocus()
    if (focus) onPreview?.(focus)
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
          onPointerEnter={previewPart}
          onPointerLeave={() => onPreview?.(null)}
          className={`group relative flex h-7 md:h-10 w-7 md:w-10 cursor-pointer  items-center justify-center rounded-full border transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-cyan ${
            active
            ? 'scale-110 border-neon-orange bg-neon-orange/25 shadow-[0_0_0_5px_rgb(232_98_61/14%),0_0_24px_rgb(232_98_61/70%)]'
              : 'border-white/60 bg-transparent  hover:scale-110 hover:border-neon-cyan'
          }`}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full transition-colors z-30 ${
              active
                ? 'bg-neon-orange shadow-[0_0_12px_#e8623d]'
                : 'bg-white shadow-[0_0_12px_white]'
            }`}
          />
          <span
            className={`pointer-events-none absolute min-h-32 min-w-48 text-wrap bottom-[calc(100%-3.65rem)] z-40 left-1/2 translate-x-[20%] rounded-sm border border-white/15 bg-navy-950/35 backdrop-blur-xl font-nian px-12 py-4 text-base font-bold text-white shadow-xl  transition duration-200 ${
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

export function Isuzu({
  activePartId = null,
  onFocusPart,
  onPreviewPart,
  onReady,
  lowPerformance = false,
  animationEnabled = true,
  ...props
}: IsuzuProps) {
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

  useLayoutEffect(() => {
    onReady?.()
  }, [onReady])

  useFrame(({ clock }, frameDelta) => {
    if (!animationEnabled) return
    if (!body.current || !frontAxle.current || !rearAxle.current) return

    // Avoid a large physics jump when the tab becomes active again.
    const frameTime = Math.min(frameDelta, 1 / 30)
    const physicsRate = lowPerformance ? 60 : 120
    const substepCount = Math.max(1, Math.ceil(frameTime / (1 / physicsRate)))
    const delta = frameTime / substepCount
    const time = clock.getElapsedTime()

    for (let step = 1; step <= substepCount; step += 1) {
      const simulationTime = time - frameTime + delta * step
      const frontRoad = roadHeight(simulationTime)
      const rearRoad = roadHeight(simulationTime - REAR_AXLE_DELAY)

      stepSpring(frontSuspension.current, frontRoad, 4.8, 0.9, delta)
      stepSpring(rearSuspension.current, rearRoad, 4.4, 0.94, delta)

      const frontTravel = frontSuspension.current.position
      const rearTravel = rearSuspension.current.position
      const heaveTarget = (frontTravel + rearTravel) * 0.24
      const pitchTarget = ((rearTravel - frontTravel) / WHEELBASE) * 0.68
      const rollTarget =
        Math.sin(simulationTime * 0.8 + 0.4) * 0.0022 +
        Math.sin(simulationTime * 1.9) * 0.0008

      stepSpring(bodyHeave.current, heaveTarget, 1.35, 0.86, delta)
      stepSpring(bodyPitch.current, pitchTarget, 1.5, 0.88, delta)
      stepSpring(bodyRoll.current, rollTarget, 1, 0.92, delta)
    }

    frontAxle.current.position.y = frontSuspension.current.position
    rearAxle.current.position.y = rearSuspension.current.position

    const engineVibration =
      Math.sin(time * 17.5) * 0.02 + Math.sin(time * 23.2 + 0.6) * 0.009

    body.current.position.y = bodyHeave.current.position + engineVibration
    body.current.rotation.x = bodyPitch.current.position
    body.current.rotation.z = bodyRoll.current.position

    const wheelRotation = CRUISE_WHEEL_SPEED * frameTime
    if (frontWheels.current) {
      frontWheels.current.rotation.x =
        (frontWheels.current.rotation.x - wheelRotation) % (Math.PI * 2)
    }
    if (rearWheels.current) {
      rearWheels.current.rotation.x =
        (rearWheels.current.rotation.x - wheelRotation) % (Math.PI * 2)
    }
  })

  return (
    <group {...props} dispose={null}>
      <group scale={0.025} rotation={[0, TRUCK_HEADING, 0]} position={[-1.5, 0, 0]}>
        <group ref={body} name="truck_body">
          <mesh geometry={nodes.Object_10.geometry} material={materials.object_16}  />
          <mesh geometry={nodes.Object_11001.geometry} material={materials.object_17}  />
          <mesh geometry={nodes.Object_12.geometry} material={materials.object_18}  />
          <mesh geometry={nodes.Object_13.geometry} material={materials.object_2}  />
          <mesh geometry={nodes.Object_14.geometry} material={materials.object_8}  />
            <mesh geometry={nodes.Object_2.geometry} material={materials.mat_1} castShadow />
            <mesh geometry={merged.bodyBlack} material={materials.mat_2} castShadow />
          <mesh geometry={nodes.Object_4.geometry} material={materials.mat_3}  />
          <mesh geometry={nodes.Object_5.geometry} material={materials.object_0}  />
          <mesh geometry={nodes.Object_6.geometry} material={materials.object_11}  />
          <mesh geometry={nodes.Object_7.geometry} material={materials.object_13}  />
          <mesh geometry={nodes.Object_8.geometry} material={materials.object_14}  />
          <mesh geometry={nodes.Object_9.geometry} material={materials.object_15}  />
            <mesh geometry={nodes.Object_6001.geometry} material={materials.material_1} castShadow />


          {BODY_HOTSPOTS.map((hotspot) => (
            <PartHotspot
              key={hotspot.id}
              {...hotspot}
              active={activePartId === hotspot.id}
              onSelect={onFocusPart}
              onPreview={onPreviewPart}
            />
          ))}
        </group>

        <group ref={rearAxle} name="rear_axle_assembly">
          <mesh geometry={merged.rearAxle} material={materials.mat_2}  />
          <group ref={rearWheels} position={REAR_WHEEL_PIVOT} name="rear_wheels">
            <group position={[0, -REAR_WHEEL_PIVOT[1], -REAR_WHEEL_PIVOT[2]]}>
                <mesh geometry={nodes.wheel_back.geometry} material={materials.object_16} castShadow />
              <mesh geometry={nodes.pich_back.geometry} material={materials.object_18}  />
              <mesh geometry={nodes.wheel_inside2_back.geometry} material={materials.mat_2}  />
              <mesh geometry={nodes.wheel_inside_back.geometry} material={materials.object_17}  />
            </group>
          </group>
          <PartHotspot
            {...REAR_AXLE_HOTSPOT}
            active={activePartId === REAR_AXLE_HOTSPOT.id}
            onSelect={onFocusPart}
            onPreview={onPreviewPart}
          />
        </group>

        <group ref={frontAxle} name="front_axle_assembly">
          <mesh geometry={merged.frontAxle} material={materials.mat_2}  />
          <group ref={frontWheels} position={FRONT_WHEEL_PIVOT} name="front_wheels">
            <group position={[0, -FRONT_WHEEL_PIVOT[1], -FRONT_WHEEL_PIVOT[2]]}>
              <mesh geometry={nodes.wheel_inside2_front.geometry} material={materials.mat_2}  />
                <mesh geometry={nodes.pich_front.geometry} material={materials.object_18} castShadow />
              <mesh geometry={nodes.wheel_fron_inside.geometry} material={materials.object_17}  />
              <mesh geometry={merged.frontTires} material={materials.object_16}  />
            </group>
          </group>
          <PartHotspot
            {...FRONT_AXLE_HOTSPOT}
            active={activePartId === FRONT_AXLE_HOTSPOT.id}
            onSelect={onFocusPart}
            onPreview={onPreviewPart}
          />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/isuzu4.glb')
