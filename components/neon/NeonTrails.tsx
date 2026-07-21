'use client';

import { useEffect, useRef } from 'react';

/**
 * Animated neon light-trail background.
 * Prefer WebGPU fragment shader; fall back to Canvas2D so it renders everywhere.
 */
export default function NeonTrails({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let raf = 0;
    let cleanupGpu: (() => void) | null = null;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
    };
    resize();
    window.addEventListener('resize', resize);

    const startCanvas2D = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const trails = Array.from({ length: 10 }, (_, i) => ({
        phase: i * 0.7,
        y: 0.35 + (i % 5) * 0.08,
        amp: 0.04 + (i % 3) * 0.015,
        speed: 0.25 + (i % 4) * 0.08,
        orange: i % 2 === 0,
        width: 1.2 + (i % 3) * 0.6,
      }));

      const draw = (t: number) => {
        if (disposed || !ctx) return;
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, '#0a1438');
        g.addColorStop(0.55, '#060b27');
        g.addColorStop(1, '#030618');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);

        const rg = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.5, w * 0.7);
        rg.addColorStop(0, 'rgba(58,160,255,0.10)');
        rg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, w, h);

        for (const tr of trails) {
          ctx.beginPath();
          const steps = 48;
          for (let s = 0; s <= steps; s++) {
            const x = (s / steps) * w;
            const n =
              Math.sin(s * 0.22 + t * tr.speed + tr.phase) * tr.amp +
              Math.sin(s * 0.08 + t * tr.speed * 0.6) * tr.amp * 0.5;
            const y = h * (tr.y + n + Math.sin(t * 0.15 + tr.phase) * 0.02);
            if (s === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = tr.orange ? 'rgba(232,98,61,0.75)' : 'rgba(58,160,255,0.7)';
          ctx.lineWidth = tr.width * (window.devicePixelRatio || 1);
          ctx.shadowBlur = 18;
          ctx.shadowColor = tr.orange ? '#e8623d' : '#3aa0ff';
          ctx.stroke();
        }

        raf = requestAnimationFrame(() => draw(t + 0.016));
      };
      draw(0);
    };

    const startWebGPU = async () => {
      const gpu = navigator.gpu;
      if (!gpu) {
        startCanvas2D();
        return;
      }
      try {
        const adapter = await gpu.requestAdapter();
        if (!adapter || disposed) {
          startCanvas2D();
          return;
        }
        const device = await adapter.requestDevice();
        if (disposed) {
          device.destroy();
          return;
        }
        const context = canvas.getContext('webgpu');
        if (!context) {
          startCanvas2D();
          return;
        }
        const format = gpu.getPreferredCanvasFormat();
        context.configure({ device, format, alphaMode: 'premultiplied' });

        const shaderFixed = device.createShaderModule({
          code: `
struct Uniforms {
  time: f32,
  width: f32,
  height: f32,
  _pad: f32,
}
@group(0) @binding(0) var<uniform> u: Uniforms;

struct VSOut {
  @builtin(position) pos: vec4f,
  @location(0) uv: vec2f,
}

@vertex
fn vs(@builtin(vertex_index) vi: u32) -> VSOut {
  var p = array<vec2f, 3>(
    vec2f(-1.0, -1.0),
    vec2f( 3.0, -1.0),
    vec2f(-1.0,  3.0)
  );
  var out: VSOut;
  out.pos = vec4f(p[vi], 0.0, 1.0);
  out.uv = p[vi] * 0.5 + vec2f(0.5);
  return out;
}

fn trail(uv: vec2f, y0: f32, amp: f32, phase: f32, t: f32) -> f32 {
  let y = y0 + sin(uv.x * 6.283 * 1.2 + t + phase) * amp
            + sin(uv.x * 6.283 * 0.4 + t * 0.6 + phase) * amp * 0.5;
  return smoothstep(0.022, 0.0, abs(uv.y - y));
}

@fragment
fn fs(in: VSOut) -> @location(0) vec4f {
  var uv = in.uv;
  uv.y = 1.0 - uv.y;
  var col = mix(vec3f(0.04, 0.08, 0.22), vec3f(0.012, 0.024, 0.094), uv.y);
  let t = u.time;
  let blue = vec3f(0.23, 0.63, 1.0);
  let orange = vec3f(0.91, 0.38, 0.24);
  col += blue * (
    trail(uv, 0.40, 0.05, 0.0, t) * 0.9 +
    trail(uv, 0.52, 0.035, 1.4, t * 1.05) * 0.7 +
    trail(uv, 0.64, 0.04, 2.2, t * 0.9) * 0.55
  );
  col += orange * (
    trail(uv, 0.46, 0.03, 0.8, t * 1.1) * 0.85 +
    trail(uv, 0.58, 0.045, 1.9, t * 0.95) * 0.7
  );
  let glow = exp(-length(uv - vec2f(0.5, 0.42)) * 2.4) * 0.14;
  col += blue * glow;
  return vec4f(col, 1.0);
}
`,
        });

        const pipeline = device.createRenderPipeline({
          layout: 'auto',
          vertex: { module: shaderFixed, entryPoint: 'vs' },
          fragment: {
            module: shaderFixed,
            entryPoint: 'fs',
            targets: [{ format }],
          },
          primitive: { topology: 'triangle-list' },
        });

        const uniformBuffer = device.createBuffer({
          size: 16,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const bindGroup = device.createBindGroup({
          layout: pipeline.getBindGroupLayout(0),
          entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
        });

        const frame = (ts: number) => {
          if (disposed) return;
          const t = ts * 0.001;
          const data = new Float32Array([t, canvas.width, canvas.height, 0]);
          device.queue.writeBuffer(uniformBuffer, 0, data);
          const encoder = device.createCommandEncoder();
          const view = context.getCurrentTexture().createView();
          const pass = encoder.beginRenderPass({
            colorAttachments: [
              {
                view,
                clearValue: { r: 0.02, g: 0.04, b: 0.15, a: 1 },
                loadOp: 'clear',
                storeOp: 'store',
              },
            ],
          });
          pass.setPipeline(pipeline);
          pass.setBindGroup(0, bindGroup);
          pass.draw(3);
          pass.end();
          device.queue.submit([encoder.finish()]);
          raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);

        cleanupGpu = () => {
          device.destroy();
        };
      } catch {
        startCanvas2D();
      }
    };

    if ('gpu' in navigator) {
      void startWebGPU();
    } else {
      startCanvas2D();
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      cleanupGpu?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full ${className}`}
      aria-hidden
    />
  );
}
