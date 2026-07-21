/** Minimal WebGPU typings used by NeonTrails (avoid @webgpu/types dependency). */

interface GPUAdapter {
  requestDevice(): Promise<GPUDevice>;
}

interface GPUDevice {
  createShaderModule(desc: { code: string }): GPUShaderModule;
  createRenderPipeline(desc: unknown): GPURenderPipeline;
  createBuffer(desc: { size: number; usage: number }): GPUBuffer;
  createBindGroup(desc: unknown): GPUBindGroup;
  createCommandEncoder(): GPUCommandEncoder;
  queue: { writeBuffer(buffer: GPUBuffer, offset: number, data: Float32Array): void; submit(bufs: GPUCommandBuffer[]): void };
  destroy(): void;
}

interface GPUShaderModule {}
interface GPURenderPipeline {
  getBindGroupLayout(index: number): unknown;
}
interface GPUBuffer {}
interface GPUBindGroup {}
interface GPUCommandEncoder {
  beginRenderPass(desc: unknown): GPURenderPassEncoder;
  finish(): GPUCommandBuffer;
}
interface GPUCommandBuffer {}
interface GPURenderPassEncoder {
  setPipeline(p: GPURenderPipeline): void;
  setBindGroup(i: number, g: GPUBindGroup): void;
  draw(vertexCount: number): void;
  end(): void;
}

interface GPUCanvasContext {
  configure(desc: unknown): void;
  getCurrentTexture(): { createView(): unknown };
}

interface GPU {
  requestAdapter(): Promise<GPUAdapter | null>;
  getPreferredCanvasFormat(): string;
}

interface Navigator {
  gpu?: GPU;
}

interface HTMLCanvasElement {
  getContext(contextId: 'webgpu'): GPUCanvasContext | null;
}

declare const GPUBufferUsage: { UNIFORM: number; COPY_DST: number };
