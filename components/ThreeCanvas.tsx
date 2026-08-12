'use client'

import {
  AccumulativeShadows,
  CameraControls,
  CameraControlsImpl,
  Environment,
  RandomizedLight,
  useDetectGPU,
} from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react'
import * as THREE from 'three'
import { Isuzu, type TruckPartFocus } from './Isuzu'

const LOCKED_MOUSE_ACTIONS = {
  left: CameraControlsImpl.ACTION.NONE,
  middle: CameraControlsImpl.ACTION.NONE,
  right: CameraControlsImpl.ACTION.NONE,
  wheel: CameraControlsImpl.ACTION.NONE,
}

const LOCKED_TOUCH_ACTIONS = {
  one: CameraControlsImpl.ACTION.NONE,
  two: CameraControlsImpl.ACTION.NONE,
  three: CameraControlsImpl.ACTION.NONE,
}

const CANVAS_GL = {
  antialias: false,
  powerPreference: 'high-performance' as const,
}

const DESKTOP_RIG_CAMERA_Z = 7
const DESKTOP_RIG_CAMERA_Y = 2
// Aim slightly below the truck's center so the ground plane and its full soft
// shadow remain inside the WebGL viewport instead of ending at its bottom edge.
const DESKTOP_RIG_TARGET: [number, number, number] = [-0.8, -0.12, -1]
const MOBILE_RIG_TARGET: [number, number, number] = [-0.8, -0.22, -1]
const CAMERA_ENTRANCE_TRANSLATION: [number, number, number] = [7, 0, 1.5]

type SceneLayout = {
  compact: boolean
  truckScale: number
}

function useSceneVisibility(container: RefObject<HTMLDivElement | null>) {
  const [active, setActive] = useState(true)

  useEffect(() => {
    const element = container.current
    if (!element) return

    let intersectsViewport = true
    const sync = () => setActive(intersectsViewport && !document.hidden)
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersectsViewport = entry.isIntersecting
        sync()
      },
      { rootMargin: '100px' },
    )

    observer.observe(element)
    document.addEventListener('visibilitychange', sync)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [container])

  return active
}

/** Caps only verified low-tier mobile GPUs; normal devices use R3F's native loop. */
function LimitedFrameLoop({ active, fps = 45 }: { active: boolean; fps?: number }) {
  const advance = useThree((state) => state.advance)

  useEffect(() => {
    if (!active) return

    let disposed = false
    let animationFrame = 0
    const frameInterval = 1000 / fps
    let accumulatedTime = 0
    let previousTimestamp = 0

    const renderFrame = (timestamp: number) => {
      if (disposed) return

      if (previousTimestamp === 0) previousTimestamp = timestamp
      accumulatedTime += Math.min(timestamp - previousTimestamp, frameInterval * 2)
      previousTimestamp = timestamp

      if (accumulatedTime >= frameInterval) {
        advance(timestamp, true)
        accumulatedTime %= frameInterval
      }

      animationFrame = requestAnimationFrame(renderFrame)
    }

    animationFrame = requestAnimationFrame(renderFrame)

    return () => {
      disposed = true
      cancelAnimationFrame(animationFrame)
    }
  }, [active, advance, fps])

  return null
}

/**
 * camera-controls assigns `touch-action: none` when it connects. On mobile we
 * disable its user input and restore native vertical gestures, while keeping
 * the controls instance alive for programmatic hotspot camera transitions.
 */
function MobileScrollPassthrough({
  enabled,
  controls,
}: {
  enabled: boolean
  controls: RefObject<CameraControlsImpl | null>
}) {
  const canvas = useThree((state) => state.gl.domElement)
  const disconnectedForMobile = useRef(false)

  useEffect(() => {
    const cameraControls = controls.current
    if (!cameraControls) return

    if (enabled) {
      // `enabled={false}` does not remove camera-controls' document-level
      // pointer listeners. Disconnecting does, while all setLookAt methods
      // remain available for programmatic hotspot animations.
      cameraControls.disconnect()
      disconnectedForMobile.current = true
      canvas.style.setProperty('touch-action', 'pan-y', 'important')
    } else if (disconnectedForMobile.current) {
      cameraControls.connect(canvas)
      disconnectedForMobile.current = false
      canvas.style.removeProperty('touch-action')
    }

    return () => {
      if (enabled) canvas.style.removeProperty('touch-action')
    }
  }, [canvas, controls, enabled])

  return null
}

/**
 * Applies a small focal offset through CameraControls, keeping its internal
 * camera state authoritative so focus animations start from the visible pose.
 */
function CameraRig({
  controls,
  enabled,
  desiredOffset,
  currentOffset,
}: {
  controls: RefObject<CameraControlsImpl | null>
  enabled: boolean
  desiredOffset: RefObject<THREE.Vector2>
  currentOffset: RefObject<THREE.Vector2>
}) {
  const canvas = useThree((state) => state.gl.domElement)

  useEffect(() => {
    const updatePointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect()
      desiredOffset.current.set(
        (((event.clientX - bounds.left) / bounds.width) * 2 - 1) * 1.26,
        -(((event.clientY - bounds.top) / bounds.height) * 2 - 1) * 0.8,
      )
    }
    const centerPointer = () => desiredOffset.current.set(0, 0)

    canvas.addEventListener('pointermove', updatePointer, { passive: true })
    canvas.addEventListener('pointerleave', centerPointer, { passive: true })

    return () => {
      canvas.removeEventListener('pointermove', updatePointer)
      canvas.removeEventListener('pointerleave', centerPointer)
    }
  }, [canvas, desiredOffset])

  useFrame((_, delta) => {
    if (!enabled || !controls.current) return

    const nextX = THREE.MathUtils.damp(
      currentOffset.current.x + 0.1,
      desiredOffset.current.x ,
      4.5,
      delta,
    )
    const nextY = THREE.MathUtils.damp(
      currentOffset.current.y,
      desiredOffset.current.y,
      4.5,
      delta,
    )

    if (
      Math.abs(nextX - currentOffset.current.x) < 0.00001 &&
      Math.abs(nextY - currentOffset.current.y) < 0.00001
    ) return

    currentOffset.current.set(nextX, nextY)

    void controls.current.setLookAt(
      currentOffset.current.x,
      currentOffset.current.y + DESKTOP_RIG_CAMERA_Y,
      DESKTOP_RIG_CAMERA_Z,
      DESKTOP_RIG_TARGET[0],
      DESKTOP_RIG_TARGET[1],
      DESKTOP_RIG_TARGET[2],
      true,
    )
  }, -2)

  return null
}

function GpuTierProbe({ onLowTier }: { onLowTier: (lowTier: boolean) => void }) {
  const gpu = useDetectGPU()

  useEffect(() => {
    const verifiedLowTier =
      gpu.isMobile === true &&
      (gpu.type === 'BLOCKLISTED' ||
        gpu.type === 'WEBGL_UNSUPPORTED' ||
        (gpu.type === 'BENCHMARK' && gpu.tier <= 1))

    onLowTier(verifiedLowTier)
  }, [gpu.isMobile, gpu.tier, gpu.type, onLowTier])

  return null
}

function MobileGpuTierDetector({
  enabled,
  onLowTier,
}: {
  enabled: boolean
  onLowTier: (lowTier: boolean) => void
}) {
  useEffect(() => {
    if (!enabled) onLowTier(false)
  }, [enabled, onLowTier])

  if (!enabled) return null

  return (
    <Suspense fallback={null}>
      <GpuTierProbe onLowTier={onLowTier} />
    </Suspense>
  )
}

function useSceneLayout() {
  const [layout, setLayout] = useState<SceneLayout>({ compact: false, truckScale: 1.35 })

  useEffect(() => {
    let animationFrame = 0

    const sync = () => {
      cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(() => {
        const width = window.innerWidth
        const height = window.innerHeight
        const fitScale = Math.min(width / 1280, height / 760) * 1.35

        setLayout({
          compact: width <= 800,
          truckScale: THREE.MathUtils.clamp(fitScale, 1.2, 1.35),
        })
      })
    }

    sync()
    window.addEventListener('resize', sync, { passive: true })

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', sync)
    }
  }, [])

  return layout
}

export function ThreeCanvas() {
  const container = useRef<HTMLDivElement>(null)
  const controls = useRef<CameraControlsImpl>(null)
  const activePartId = useRef<string | null>(null)
  const activePartRef = useRef<TruckPartFocus | null>(null)
  const hoveredPartId = useRef<string | null>(null)
  const desiredRigOffset = useRef(new THREE.Vector2())
  const currentRigOffset = useRef(new THREE.Vector2())
  const [activePart, setActivePart] = useState<TruckPartFocus | null>()
  const [modelReady, setModelReady] = useState(false)
  const [lowTierMobile, setLowTierMobile] = useState(false)
  const [cameraRigEnabled, setCameraRigEnabled] = useState(true)
  const cameraEntranceRunning = useRef(false)
  const cameraEntranceStarted = useRef(false)
  const sceneVisible = useSceneVisibility(container)
  const { compact, truckScale } = useSceneLayout()
  const camera = useMemo(
    () => ({
      position: compact
        ? ([5.8, 2.4, 15] as const)
        : ([0, DESKTOP_RIG_CAMERA_Y, DESKTOP_RIG_CAMERA_Z] as const),
      fov: compact ? 30 : 28,
    }),
    [compact],
  )

  const resetCamera = useCallback(
    (smooth = true) => {
      const rigOffset = desiredRigOffset.current
      const position: [number, number, number] = compact
        ? [5.8, 2.4, 15]
        : [
            rigOffset.x ,
            rigOffset.y + DESKTOP_RIG_CAMERA_Y,
            DESKTOP_RIG_CAMERA_Z,
          ]
      const target: [number, number, number] = compact
        ? MOBILE_RIG_TARGET
        : DESKTOP_RIG_TARGET

      const cameraControls = controls.current
      if (!cameraControls) return

      setCameraRigEnabled(false)
      currentRigOffset.current.copy(rigOffset)
      void cameraControls.setFocalOffset(0, 0, 0, smooth)
      void cameraControls.setLookAt(
        position[0],
        position[1],
        position[2],
        target[0],
        target[1],
        target[2],
        smooth,
      )
      activePartId.current = null
      activePartRef.current = null
      setActivePart(null)
      if (!smooth) setCameraRigEnabled(true)
    },
    [compact],
  )

  useEffect(() => {
    resetCamera(false)
  }, [resetCamera])

  const startCameraEntrance = useCallback(() => {
    setModelReady(true)

    const cameraControls = controls.current
    if (!cameraControls || cameraEntranceStarted.current) return

    const finalPosition: [number, number, number] = compact
      ? [5.8, 2.4, 15]
      : [1, DESKTOP_RIG_CAMERA_Y, DESKTOP_RIG_CAMERA_Z]
    const finalTarget: [number, number, number] = compact
      ? MOBILE_RIG_TARGET
      : DESKTOP_RIG_TARGET
    // Camera and look-at target begin equally translated to the right. Their
    // relative distance and viewing angle therefore remain constant while both
    // animate together, creating a tracking shot instead of a zoom.
    const startPosition: [number, number, number] = [
      finalPosition[0] + CAMERA_ENTRANCE_TRANSLATION[0],
      finalPosition[1] + CAMERA_ENTRANCE_TRANSLATION[1],
      finalPosition[2] + CAMERA_ENTRANCE_TRANSLATION[2],
    ]
    const startTarget: [number, number, number] = [
      finalTarget[0] + CAMERA_ENTRANCE_TRANSLATION[0],
      finalTarget[1] + CAMERA_ENTRANCE_TRANSLATION[1],
      finalTarget[2] + CAMERA_ENTRANCE_TRANSLATION[2],
    ]

    cameraEntranceStarted.current = true
    cameraEntranceRunning.current = true
    setCameraRigEnabled(false)
    desiredRigOffset.current.set(0, 0)
    currentRigOffset.current.set(0, 0)

    void cameraControls.setLookAt(
      startPosition[0],
      startPosition[1],
      startPosition[2],
      startTarget[0],
      startTarget[1],
      startTarget[2],
      false,
    )

    requestAnimationFrame(() => {
      void cameraControls.setLookAt(
        finalPosition[0],
        finalPosition[1],
        finalPosition[2],
        finalTarget[0],
        finalTarget[1],
        finalTarget[2],
        true,
      )
    })
  }, [compact])

  const subtlyFocusDesktopPart = useCallback((part: TruckPartFocus) => {
    const cameraControls = controls.current
    if (!cameraControls) return

    const rigOffset = desiredRigOffset.current
    const rigPosition = new THREE.Vector3(
      rigOffset.x,
      rigOffset.y + DESKTOP_RIG_CAMERA_Y,
      DESKTOP_RIG_CAMERA_Z,
    )
    const rigTarget = new THREE.Vector3(...DESKTOP_RIG_TARGET)
    const previewPosition = part.target
      .clone()
      .add(rigPosition.sub(part.target).multiplyScalar(0.9))
    const previewTarget = rigTarget.lerp(part.target, 0.18)

    setCameraRigEnabled(false)
    void cameraControls.setLookAt(
      previewPosition.x,
      previewPosition.y,
      previewPosition.z,
      previewTarget.x,
      previewTarget.y,
      previewTarget.z,
      true,
    )
  }, [])

  const previewPart = useCallback(
    (part: TruckPartFocus | null) => {
      if (compact) return

      hoveredPartId.current = part?.id ?? null
      if (part) {
        subtlyFocusDesktopPart(part)
        return
      }

      if (activePartRef.current) {
        subtlyFocusDesktopPart(activePartRef.current)
      } else {
        resetCamera()
      }
    },
    [compact, resetCamera, subtlyFocusDesktopPart],
  )

  const focusPart = useCallback(
    (part: TruckPartFocus) => {
      // Desktop markers only pin/unpin their compact info box. Hover already
      // previews the same box through the hotspot's CSS group state.
      if (!compact) {
        const isAlreadySelected = activePartId.current === part.id
        activePartId.current = isAlreadySelected ? null : part.id
        activePartRef.current = isAlreadySelected ? null : part
        setActivePart(activePartRef.current)
        if (!isAlreadySelected) subtlyFocusDesktopPart(part)
        return
      }

      // Mobile retains the tap-to-focus camera treatment and back button.
      if (activePartId.current === part.id) {
        resetCamera()
        return
      }

      const focusDistance = Math.max(
        5.4,
        (compact ? 6.4 : 4.85) * (truckScale / 1.02),
      )
      const cameraOffset = new THREE.Vector3(0.3, 0.1, 1)
        .normalize()
        .multiplyScalar(focusDistance)
      const cameraPosition = part.target.clone().add(cameraOffset)

      const cameraControls = controls.current
      if (!cameraControls) return

      setCameraRigEnabled(false)
      void cameraControls.setFocalOffset(0, 0, 0, true)
      void cameraControls.setLookAt(
        cameraPosition.x,
        cameraPosition.y,
        cameraPosition.z,
        part.target.x,
        part.target.y,
        part.target.z,
        true,
      )
      activePartId.current = part.id
      activePartRef.current = part
      setActivePart(part)
    },
    [compact, resetCamera, subtlyFocusDesktopPart, truckScale],
  )

  return (
    <div ref={container} className="relative flex min-h-[100svh] w-full overflow-visible">
      <MobileGpuTierDetector enabled={compact} onLowTier={setLowTierMobile} />

      <Canvas
        shadows="basic"
        frameloop={lowTierMobile ? 'never' : 'always'}
        camera={camera}
        dpr={lowTierMobile ? 1 : [1, 3]}
        gl={CANVAS_GL}
        className="z-10"
        style={{ overflow: 'visible' }}
      >
        <LimitedFrameLoop active={lowTierMobile} />

        <CameraControls
          ref={controls}
          makeDefault
          enabled={!compact}
          mouseButtons={LOCKED_MOUSE_ACTIONS}
          touches={LOCKED_TOUCH_ACTIONS}
          smoothTime={0.72}
          draggingSmoothTime={0.18}
          minDistance={3.2}
          maxDistance={18}
          onRest={() => {
            if (cameraEntranceRunning.current) {
              cameraEntranceRunning.current = false
              if (!compact) setCameraRigEnabled(true)
              return
            }
            if (activePartId.current === null && hoveredPartId.current === null) {
              setCameraRigEnabled(true)
            }
          }}
        />
        {!compact && (
          <CameraRig
            controls={controls}
            enabled={sceneVisible && cameraRigEnabled}
            desiredOffset={desiredRigOffset}
            currentOffset={currentRigOffset}
          />
        )}
        <MobileScrollPassthrough enabled={compact} controls={controls} />

        {/* <spotLight
          position={[0, 15, 30]}
          angle={0.3}
          penumbra={1}
          castShadow
          intensity={2 * Math.PI}
          decay={0.08}
          shadow-bias={-0.0001}
        /> */}
        <ambientLight intensity={0.4 * Math.PI} />

        <Isuzu
          scale={truckScale}
          position={compact ? [-0.1, -1.65, -2] : [-1.5, -1.25, -2]}
          activePartId={activePart?.id}
          onFocusPart={focusPart}
          onPreviewPart={previewPart}
          onReady={startCameraEntrance}
          lowPerformance={lowTierMobile}
          animationEnabled={sceneVisible}
          visible={sceneVisible}
          compact={compact}
        />
        {/* <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} /> */}

        {modelReady && !lowTierMobile && (
          <AccumulativeShadows
            visible={sceneVisible}
            position={compact ? [-5, -1.66, 0] : [-5, -1.26, 0]}
            frames={120}
            resolution={compact ? 256 : 512}
            opacity={0.9}
            alphaTest={0.7}
            scale={30}
          >
            <RandomizedLight
              amount={10}
              radius={5}
              ambient={0.8}
              position={[1, 8, -1]}
            />
          </AccumulativeShadows>
        )}

        <Environment
          // preset="sunset"
          files={'/venice_sunset_1k.hdr'}
          environmentIntensity={0.7}
          blur={0.3}
          resolution={lowTierMobile ? 64 : 128}
          environmentRotation={[0, Math.PI / 7, Math.PI / 1]}
        // background
        />
      </Canvas>

      {activePart && compact ? (
        <div className="pointer-events-auto absolute inset-x-0 bottom-5 z-30 flex justify-center px-4">
          <div className="pointer-events-auto flex items-center gap-3 rounded-sm border border-white/15 bg-navy-950/90 p-2 ps-4 text-white shadow-2xl backdrop-blur-xl">
            <div className="text-right">
              <p className="text-[10px] text-white/45">نمای نزدیک قطعه</p>
              <p className="mt-0.5 text-sm font-bold">{activePart.label}</p>
            </div>
            <button
              type="button"
              onClick={() => resetCamera()}
              className="min-h-10 border border-neon-orange/40 bg-neon-orange/15 px-4 text-xs font-bold text-orange-100 transition hover:bg-neon-orange/25 focus-visible:outline-2 focus-visible:outline-neon-cyan"
            >
              بازگشت به نمای کامل
            </button>
          </div>
        </div>
      )
        : (
          <div className="pointer-events-none absolute inset-0 z-50 flex h-[100svh] flex-col shrink-0 justify-between py-14 pb-20 md:py-28">
            <div className="pointer-events-none font-nian font-black flex flex-col h-full justify-start px-4 md:px-16 ">
              <h1 className="pointer-events-none flex h-fit items-start  gap-3 p-2 ps-4 text-white text-3xl md:text-5xl lg:text-5xl xl:text-5xl md:max-w-2xl xl:max-w-3xl leading-relaxed">
                مرجع تخصصی
                <br />
                قطعات یدکی ایسوزو
              </h1>
              <p className="pointer-events-none flex items-center gap-3 p-2 ps-4 text-gray-300 text-sm md:text-lg md:max-w-sm 2xl:max-w-xl leading-relaxed tracking-wider font-light">
                قطعه سازگار با کامیونت و کامیون نیمه‌سنگین ایسوزو را پیدا کنید؛ موجودی، کیفیت و زمان تحویل را ببینید یا برای قطعات حساس از کارشناس کمک بگیرید
              </p>
            </div>
            <div className="pointer-events-none  flex flex-col h-full  justify-end items-start px-4 md:px-16 font-nian">
              <p className="pointer-events-none max-w-3xl text-right text-base md:text-xl text-white/45">
                نمایندگی و توزیع قطعات اصلی کامیونت و کامیون ایسوزو. اصالت کالا، مشاوره فنی، ارسال سریع به سراسر ایران.
              </p>
              <div className="pointer-events-auto mt-4 flex gap-3 bottom-0 ">
                <a
                  href="/products"
                  className="group inline-flex min-h-11 items-center justify-center gap-2 bg-[var(--neon-orange)] px-5 py-3 text-sm font-semibold text-white transition-smooth hover:brightness-110"
                >
                  مشاهده محصولات
                </a>
                <a
                  href="/special-order"
                  className="inline-flex h-fit md:min-h-11 items-center justify-center gap-1 border border-white/20 bg-white/5 px-2 md:px-5 py-2 md:py-3 text-sm font-semibold text-white  transition-smooth hover:bg-white/10"
                >
                  تأمین ویژه و فوری
                </a>
              </div>
            </div>


          </div>
        )
      }
    </div>
  )
}
