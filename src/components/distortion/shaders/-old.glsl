precision mediump float;

uniform float uTime;
uniform float uGlitchStrength;
varying vec3 vPosition;

#include "./includes/edgeGlow.glsl";
#include "./includes/edgeGlitch.glsl";

void main() {
  vec3 glitchPos = applyGlitch(vPosition, uGlitchStrength);

  float verticalStart = 0.5;
  float verticalDuration = 1.5;
  float radialStart = verticalStart + verticalDuration;
  float radialDuration = 2.5;

  float t1 = clamp((uTime - verticalStart) / verticalDuration, 0.0, 1.0);
  float revealY = mix(7.5, -1.5, t1);
  float baseSize = 2.0;

  vec2 centeredXZ = glitchPos.xz;
  float verticalEdgeWidth = 0.3;
  float verticalReveal = smoothstep(revealY - verticalEdgeWidth, revealY + verticalEdgeWidth, glitchPos.y);

  float t2 = clamp((uTime - radialStart) / radialDuration, 0.0, 1.0);
  float expandingSize = mix(baseSize, 60.0, t2);
  float halfSize = expandingSize * 0.5;

  float insideSquare =
    step(-halfSize, centeredXZ.x) * step(centeredXZ.x, halfSize) *
    step(-halfSize, centeredXZ.y) * step(centeredXZ.y, halfSize);

  float rawAlpha = verticalReveal * insideSquare;

  float edgeDist = max(abs(centeredXZ.x) - halfSize, abs(centeredXZ.y) - halfSize);
  float glow = edgeGlow(rawAlpha, edgeDist, uTime);

  float finalAlpha = clamp(rawAlpha + glow, 0.0, 1.0);

  // Final output: no color override, just transparency mask
  gl_FragColor = vec4(vec3(1.0), finalAlpha);
}
