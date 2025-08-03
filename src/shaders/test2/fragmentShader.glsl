varying vec2 vUv;

uniform vec3 uColor;

void main() {
  // Use vUv for stability (prevents optimization problems)
  vec2 uv = vUv;

  // You can use uColor directly, that's fine
  gl_FragColor = vec4(uColor, 1.0);
}
