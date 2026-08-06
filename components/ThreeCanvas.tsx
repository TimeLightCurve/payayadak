'use client'

import * as THREE from 'three'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  AccumulativeShadows,
  CameraControls,
  CameraControlsImpl,
  Environment,
  PerformanceMonitor,
  RandomizedLight,
} from '@react-three/drei'
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

function useIsCompact() {
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 800px)')
    const sync = () => setCompact(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  return compact
}

export function ThreeCanvas() {
  const controls = useRef<CameraControlsImpl>(null)
  const activePartId = useRef<string | null>(null)
  const [activePart, setActivePart] = useState<TruckPartFocus | null>(null)
  const [degraded, degrade] = useState(false)
  const compact = useIsCompact()
  const camera = useMemo(
    () => ({
      position: compact ? ([4, 0.4, 12] as const) : ([5, 1.2, 11] as const),
      fov: compact ? 35 : 28,
    }),
    [compact],
  )

  const resetCamera = useCallback(
    (smooth = true) => {
      const position: [number, number, number] = compact ? [4, 0.4, 15] : [1, 2.8, 9]
      const target: [number, number, number] = [0.4, 0.25, -1]

      void controls.current?.setLookAt(
        position[0],
        position[1],
        position[2],
        target[0],
        target[1],
        target[2],
        smooth,
      )
      activePartId.current = null
      setActivePart(null)
    },
    [compact],
  )

  useEffect(() => {
    resetCamera(false)
  }, [resetCamera])

  const focusPart = useCallback(
    (part: TruckPartFocus) => {
      // Selecting the active marker again returns to the full-truck composition.
      if (activePartId.current === part.id) {
        resetCamera()
        return
      }

      const focusDistance = compact ? 5.4 : 4.35
      const cameraOffset = new THREE.Vector3(0.3, 0.1, 1)
        .normalize()
        .multiplyScalar(focusDistance)
      const cameraPosition = part.target.clone().add(cameraOffset)

      const cameraControls = controls.current
      if (!cameraControls) return

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
      setActivePart(part)
    },
    [compact, resetCamera],
  )

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Canvas
        shadows="basic"
        camera={camera}
        dpr={compact || degraded ? 1 : [1, 1.5]}
        gl={CANVAS_GL}
      >
        <CameraControls
          ref={controls}
          makeDefault
          mouseButtons={LOCKED_MOUSE_ACTIONS}
          touches={LOCKED_TOUCH_ACTIONS}
          smoothTime={0.72}
          draggingSmoothTime={0.18}
          minDistance={3.2}
          maxDistance={18}
        />

        {/* <spotLight
          position={[0, 15, 0]}
          angle={0.3}
          penumbra={1}
          castShadow
          intensity={2 * Math.PI}
          decay={0}
          shadow-bias={-0.0001}
        /> */}
        <ambientLight intensity={0.4 * Math.PI} />

        <Isuzu
          scale={1.6}
          position={[-1, -1.65, -2]}
          activePartId={activePart?.id}
          onFocusPart={focusPart}
        />
        {/* <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} /> */}

        <AccumulativeShadows
          position={[-5, -1.66, 0]}
          frames={compact || degraded ? 1 : 20}
          resolution={compact || degraded ? 256 : 512}
          alphaTest={1}
          scale={30}

        >
          <RandomizedLight
            amount={compact || degraded ? 1 : 5}
            radius={5}
            ambient={0.8}
            position={[1, 8, -1]}
          />
        </AccumulativeShadows>

        {!degraded && <PerformanceMonitor onDecline={() => degrade(true)} />}
        {/* <Environment
          preset="apartment"
          environmentIntensity={0.7}
          resolution={degraded ? 64 : 128}
        /> */}
        <Environment
          preset="sunset"
          environmentIntensity={1.2}
          blur={0.3}
          resolution={degraded ? 64 : 128}
          environmentRotation={[0, Math.PI / 7, Math.PI / 1]}
        />
      </Canvas>

      {activePart ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center px-4">
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
        <>
          <div className="pointer-events-none absolute inset-x-0 top-50 font-nian font-black z-50 flex flex-col justify-start px-16 ">
          <h1 className="pointer-events-none flex items-center gap-3 p-2 ps-4 text-white  text-7xl max-w-3xl leading-relaxed">
                مرجع تخصصی
                <br />
                قطعات یدکی ایسوزو
          </h1>
          <p className="pointer-events-none flex items-center gap-3 p-2 ps-4 text-white/70 text-lg max-w-xl leading-relaxed">
                قطعه سازگار با کامیونت و کامیون نیمه‌سنگین ایسوزو را پیدا کنید؛ موجودی، کیفیت و زمان تحویل را ببینید یا برای قطعات حساس از کارشناس کمک بگیرید
          </p>
          </div>
          <div className="pointer-events-none absolute flex flex-col inset-x-0 bottom-20 z-20 flex justify-start px-16 font-nian">
            <p className="pointer-events-auto max-w-3xl text-right text-xl text-white/45">
                نمایندگی و توزیع قطعات اصلی کامیونت و کامیون ایسوزو. اصالت کالا، مشاوره فنی، ارسال سریع به سراسر ایران.
            </p>
            <div className="pointer-events-auto mt-4 flex gap-3">
                <a
                  href="/products"
                  className="group inline-flex min-h-11 items-center justify-center gap-2 bg-[var(--neon-orange)] px-5 py-3 text-sm font-semibold text-white transition-smooth hover:brightness-110"
                >
                  مشاهده محصولات
                </a>
                <a
                  href="/special-order"
                  className="inline-flex min-h-11 items-center justify-center gap-1 border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-smooth hover:bg-white/10"
                >
                  تأمین ویژه و فوری
                </a>
            </div>
          </div>
         
        </>
      )
    }
    </div>
  )
}
