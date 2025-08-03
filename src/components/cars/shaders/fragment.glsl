precision mediump float;

uniform float uTime;
varying vec3 vPosition;

void main() {
  // Stage timings
  float verticalStart = 0.5;
  float verticalDuration = 1.5;
  float radialStart = verticalStart + verticalDuration;
  float radialDuration = 2.5;

  // Vertical reveal
  float t1 = clamp((uTime - verticalStart) / verticalDuration, 0.0, 1.0);
  float revealY = mix(7.5, -1.5, t1);
  float verticalEdgeWidth = 0.3;
  float verticalReveal = smoothstep(revealY - verticalEdgeWidth, revealY + verticalEdgeWidth, vPosition.y);

  // Radial (square) reveal
  float t2 = clamp((uTime - radialStart) / radialDuration, 0.0, 1.0);
  float expandingSize = mix(2.0, 60.0, t2);
  float halfSize = expandingSize * 0.5;
  vec2 centeredXZ = vPosition.xz;

  float insideSquare =
    step(-halfSize, centeredXZ.x) * step(centeredXZ.x, halfSize) *
    step(-halfSize, centeredXZ.y) * step(centeredXZ.y, halfSize);

  // Final alpha based on both masks
  float alpha = verticalReveal * insideSquare;

  // Output original color (white placeholder, replaced by mesh color)
  gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
}
