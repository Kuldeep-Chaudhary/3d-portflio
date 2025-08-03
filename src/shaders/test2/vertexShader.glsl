varying vec2 vUv;

uniform vec2 uFrequency;
uniform float uTime;

void main() {
  vUv = uv;

  vec3 pos = position;

  // Calculate how far from the left edge (range 0 to 1)
  float strength = smoothstep(-0.48, 0.0, pos.x);

  // Apply wave with strength fade
  pos.z += sin(pos.x * uFrequency.x - uTime) * 0.1 * strength;
  pos.z += sin(pos.y * uFrequency.y - uTime) * 0.1 * strength;

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}
