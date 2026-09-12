/* Sea-of-Souls caustics, rising bubbles and a rotatable halftone raster. One fullscreen triangle. */

export const VERTEX = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const FRAGMENT = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uIntensity;
uniform float uHalftone;
uniform float uAngle;
uniform float uBubbles;

varying vec2 vUv;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float hash(float n) { return fract(sin(n) * 43758.5453123); }

float caustic(vec2 p, float t) {
  float n1 = snoise(p * 1.6 + vec2(t * 0.06, -t * 0.04));
  float n2 = snoise(p * 3.1 - vec2(t * 0.05, t * 0.07) + n1 * 0.6);
  float n3 = snoise(p * 6.0 + vec2(-t * 0.03, t * 0.02) + n2 * 0.4);
  float v = n1 * 0.55 + n2 * 0.3 + n3 * 0.15;
  float lines = pow(1.0 - abs(sin(v * 3.14159 * 1.5)), 4.0);
  return lines;
}

float bubbles(vec2 uv, float aspect, float t) {
  float acc = 0.0;
  for (int i = 0; i < 14; i++) {
    float fi = float(i);
    float speed = 0.02 + hash(fi * 7.1) * 0.035;
    float x = hash(fi * 3.3) + sin(t * 0.3 + fi) * 0.02;
    float y = fract(hash(fi * 5.7) + t * speed);
    float r = 0.004 + hash(fi * 9.9) * 0.012;
    vec2 c = vec2(x * aspect, y);
    float d = length(uv * vec2(aspect, 1.0) - c);
    float ring = smoothstep(r, r - 0.0025, d) - smoothstep(r * 0.75, r * 0.75 - 0.0025, d);
    acc += ring * (0.35 + 0.65 * hash(fi * 2.2));
  }
  return acc;
}

float halftone(vec2 frag, float lum) {
  float s = sin(uAngle);
  float c = cos(uAngle);
  vec2 p = mat2(c, -s, s, c) * frag;
  vec2 cell = fract(p / 6.0) - 0.5;
  float d = length(cell);
  float radius = 0.08 + lum * 0.28;
  return 1.0 - smoothstep(radius - 0.04, radius + 0.04, d);
}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / uRes.y;
  vec2 par = (uMouse - 0.5) * 0.03;
  vec2 p = (uv + par) * vec2(aspect, 1.0);
  float t = uTime;

  float ca = caustic(p * 1.2, t);
  float depth = smoothstep(0.0, 1.0, uv.y * 0.8 + 0.1);

  vec3 base = mix(uColorA, uColorB, depth * 0.35);
  vec3 col = base;
  col += uColorC * ca * (0.55 * uIntensity) * (0.4 + depth * 0.6);

  float b = bubbles(uv + par, aspect, t) * uBubbles;
  col += uColorC * b * 0.7;

  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  float ht = halftone(gl_FragCoord.xy, lum);
  col = mix(col, col * (0.75 + 0.5 * ht), uHalftone);

  float vig = smoothstep(1.35, 0.3, length((uv - 0.5) * vec2(1.2, 1.0)));
  col *= 0.75 + 0.35 * vig;

  gl_FragColor = vec4(col, 1.0);
}
`;

export type SceneUniforms = {
  colorA: [number, number, number];
  colorB: [number, number, number];
  colorC: [number, number, number];
  intensity: number;
  halftone: number;
  angle: number;
  bubbles: number;
};

const hex = (h: string): [number, number, number] => {
  const n = Number.parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export const SCENES: Record<string, SceneUniforms> = {
  home: {
    colorA: hex("#04061a"),
    colorB: hex("#0a1f5c"),
    colorC: hex("#3ce2ff"),
    intensity: 0.9,
    halftone: 0.5,
    angle: 0.4,
    bubbles: 1,
  },
  menu: {
    colorA: hex("#050515"),
    colorB: hex("#00184c"),
    colorC: hex("#00d9ff"),
    intensity: 1.2,
    halftone: 0.7,
    angle: 0.9,
    bubbles: 1.2,
  },
  about: {
    colorA: hex("#04101e"),
    colorB: hex("#0d2560"),
    colorC: hex("#7dd4fc"),
    intensity: 0.8,
    halftone: 0.4,
    angle: -0.3,
    bubbles: 0.6,
  },
  projects: {
    colorA: hex("#030816"),
    colorB: hex("#0d1a3a"),
    colorC: hex("#3ce2ff"),
    intensity: 0.6,
    halftone: 0.6,
    angle: 0.2,
    bubbles: 0.4,
  },
  skills: {
    colorA: hex("#04061a"),
    colorB: hex("#10185f"),
    colorC: hex("#00d9ff"),
    intensity: 1.0,
    halftone: 0.5,
    angle: 1.2,
    bubbles: 0.8,
  },
  timeline: {
    colorA: hex("#02040f"),
    colorB: hex("#0d1a3a"),
    colorC: hex("#7dd4fc"),
    intensity: 0.7,
    halftone: 0.35,
    angle: -0.8,
    bubbles: 1.4,
  },
  contact: {
    colorA: hex("#0a0418"),
    colorB: hex("#2a1360"),
    colorC: hex("#b48cff"),
    intensity: 0.5,
    halftone: 0.3,
    angle: 0.0,
    bubbles: 0.3,
  },
  resume: {
    colorA: hex("#04061a"),
    colorB: hex("#0f1760"),
    colorC: hex("#85f4ff"),
    intensity: 0.8,
    halftone: 0.55,
    angle: 0.6,
    bubbles: 0.7,
  },
  detail: {
    colorA: hex("#03050f"),
    colorB: hex("#00184c"),
    colorC: hex("#3ce2ff"),
    intensity: 0.5,
    halftone: 0.4,
    angle: 0.3,
    bubbles: 0.5,
  },
};
