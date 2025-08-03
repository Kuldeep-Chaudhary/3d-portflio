// precision mediump float;

// uniform float uTime;
// varying vec3 vPosition;
// uniform vec3 uColor;

// void main() {
//   // Phase timing
//   float verticalStart = 0.5;
//   float verticalDuration = 1.5;
//   float radialStart = verticalStart + verticalDuration;
//   float radialDuration = 1.5;

//   // Phase 1: Top-to-bottom reveal within fixed radius
//   float t1 = clamp((uTime - verticalStart) / verticalDuration, 0.0, 1.0);
//   float revealY = mix(6.0, -1.5, t1);
//   float baseRadius = 1.0;

//   float distFromCenter = length(vPosition.xz);
//   float withinBaseRadius = step(distFromCenter, baseRadius);
//   float verticalReveal = step(revealY, vPosition.y);

//   float alphaPhase1 = verticalReveal * withinBaseRadius;

//   // Phase 2: Expand the radius
//   float t2 = clamp((uTime - radialStart) / radialDuration, 0.0, 1.0);
//   float expandingRadius = mix(baseRadius, 40.0, t2); // adjust 100.0 to match scene size
//   float withinExpandedRadius = step(distFromCenter, expandingRadius);
//   float verticalRevealExpanded = step(revealY, vPosition.y); // same revealY as in phase 1

//   float alphaPhase2 = verticalRevealExpanded * withinExpandedRadius;

//   // Final alpha is max of both phases
//   float alpha = max(alphaPhase1, alphaPhase2);

//  vec3 color = uColor;
// gl_FragColor = vec4(color, alpha);
// }



// new one 




// precision mediump float;

// uniform float uTime;
// uniform vec3 uColor;
// varying vec3 vPosition;

// // Add a soft glowing edge
// float edgeGlow(float edgeAlpha, float distToEdge, float timePulse) {
//   // Sharper at center, fading at outer band
//   float glow = smoothstep(0.15, 0.0, abs(distToEdge));
//   // Time-pulsed glow effect
//   glow *= 0.5 + 0.5 * sin(uTime * 8.0 + distToEdge * 20.0);
//   return edgeAlpha * glow;
// }

// void main() {
//   // Phase timing
//   float verticalStart = 0.5;
//   float verticalDuration = 1.5;
//   float radialStart = verticalStart + verticalDuration;
//   float radialDuration = 4.5;

//   // Phase 1
//   float t1 = clamp((uTime - verticalStart) / verticalDuration, 0.0, 1.0);
//   float revealY = mix(6.0, -1.5, t1);
//   float baseRadius = 1.0;

//   float distFromCenter = length(vPosition.xz);
//   float verticalEdgeWidth = 0.3;
//   float radiusEdgeWidth = 0.5;

//   // Use smoothstep for soft vertical edge
//   float verticalReveal = smoothstep(revealY - verticalEdgeWidth, revealY + verticalEdgeWidth, vPosition.y);
//   float withinBaseRadius = smoothstep(baseRadius + radiusEdgeWidth, baseRadius - radiusEdgeWidth, distFromCenter);
//   float alphaPhase1 = verticalReveal * withinBaseRadius;

//   // Phase 2
//   float t2 = clamp((uTime - radialStart) / radialDuration, 0.0, 1.0);
//   float expandingRadius = mix(baseRadius, 30.0, t2);
//   float withinExpandedRadius = smoothstep(expandingRadius + radiusEdgeWidth, expandingRadius - radiusEdgeWidth, distFromCenter);
//   float alphaPhase2 = verticalReveal * withinExpandedRadius;

//   float rawAlpha = max(alphaPhase1, alphaPhase2);

//   // Add edge glow on expanding front
//   float edgeDist = distFromCenter - expandingRadius;
//   float glow = edgeGlow(alphaPhase2, edgeDist, uTime);

//   // Final color blending
//   vec3 glowColor = vec3(1.0); // white glow at edge
//   vec3 baseColor = mix(uColor, glowColor, glow);
//   float finalAlpha = clamp(rawAlpha + glow, 0.0, 1.0);

//   gl_FragColor = vec4(baseColor, finalAlpha);
// }



// second one 


// precision mediump float;

// uniform float uTime;
// uniform vec3 uColor;
// uniform float uGlitchStrength; // Add this uniform to your material
// varying vec3 vPosition;

// #include  "./includes/edgeGlow.glsl";
// #include  "./includes/edgeGlitch.glsl";


// void main() {
//   // Apply glitch to position (only affects visual effects)
//   vec3 glitchPos = applyGlitch(vPosition, uGlitchStrength);

//   // Phase timing
//   float verticalStart = 0.5;
//   float verticalDuration = 1.5;
//   float radialStart = verticalStart + verticalDuration;
//   float radialDuration = 2.5;

//   // Phase 1
//   float t1 = clamp((uTime - verticalStart) / verticalDuration, 0.0, 1.0);
//   float revealY = mix(7.5, -1.5, t1);
//   float baseRadius = 1.0;

//   float distFromCenter = length(glitchPos.xz);
//   float verticalEdgeWidth = 0.3;
//   float radiusEdgeWidth = 0.5;

//   float verticalReveal = smoothstep(revealY - verticalEdgeWidth, revealY + verticalEdgeWidth, glitchPos.y);
//   float withinBaseRadius = smoothstep(baseRadius + radiusEdgeWidth, baseRadius - radiusEdgeWidth, distFromCenter);
//   float alphaPhase1 = verticalReveal * withinBaseRadius;

//   // Phase 2
//   float t2 = clamp((uTime - radialStart) / radialDuration, 0.0, 1.0);
//   float expandingRadius = mix(baseRadius, 30.0, t2);
//   float withinExpandedRadius = smoothstep(expandingRadius + radiusEdgeWidth, expandingRadius - radiusEdgeWidth, distFromCenter);
//   float alphaPhase2 = verticalReveal * withinExpandedRadius;

//   float rawAlpha = max(alphaPhase1, alphaPhase2);

//   // Add edge glow
//   float edgeDist = distFromCenter - expandingRadius;
//   float glow = edgeGlow(alphaPhase2, edgeDist, uTime);

//   // Final color + alpha
//   vec3 glowColor = vec3(1.0);
//   vec3 baseColor = mix(uColor, glowColor, glow);
//   float finalAlpha = clamp(rawAlpha + glow, 0.0, 1.0);

//   gl_FragColor = vec4(baseColor, finalAlpha);
// }

// square
precision mediump float;

uniform float uTime;
uniform vec3 uColor;
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

  vec3 glowColor = vec3(1.0);
  vec3 baseColor = mix(uColor, glowColor, glow);
  float finalAlpha = clamp(rawAlpha + glow, 0.0, 1.0);

  gl_FragColor = vec4(baseColor, finalAlpha);
}

// precision mediump float;

// uniform float uTime;
// uniform vec3 uColor;
// uniform float uGlitchStrength;
// varying vec3 vPosition;

// #include "./includes/edgeGlow.glsl";
// #include "./includes/edgeGlitch.glsl";

// void main() {
//   // Apply glitch
//   vec3 glitchPos = applyGlitch(vPosition, uGlitchStrength);

//   // Timing
//   float verticalStart = 0.5;
//   float verticalDuration = 1.5;
//   float radialStart = verticalStart + verticalDuration;
//   float radialDuration = 2.5;

//   // Vertical reveal logic
//   float t1 = clamp((uTime - verticalStart) / verticalDuration, 0.0, 1.0);
//   float revealY = mix(7.5, -1.5, t1);
//   float verticalEdgeWidth = 0.3;
//   float verticalReveal = smoothstep(revealY - verticalEdgeWidth, revealY + verticalEdgeWidth, glitchPos.y);

//   // Square radial reveal logic
//   float t2 = clamp((uTime - radialStart) / radialDuration, 0.0, 1.0);
//   float baseSize = 2.0;
//   float expandingSize = mix(baseSize, 60.0, t2);
//   float halfSize = expandingSize * 0.5;
//   vec2 centeredXZ = glitchPos.xz;

//   float inSquare = step(-halfSize, centeredXZ.x) * step(centeredXZ.x, halfSize) *
//                    step(-halfSize, centeredXZ.y) * step(centeredXZ.y, halfSize);

//   // Combine both phases
//   float rawAlpha = verticalReveal * inSquare;

//   // Edge glow only when alpha is already visible (avoid early glow)
//   float glow = 0.0;
// if (rawAlpha > 0.0) {
//   float edgeDistSquare = max(abs(centeredXZ.x) - halfSize, abs(centeredXZ.y) - halfSize);
//   float edgeDistY = glitchPos.y - revealY;

//   // Square edge glow (softer and broader)
//   float glowSquare = edgeGlow(rawAlpha, edgeDistSquare, uTime);

//   // Vertical edge glow (sharper and brighter)
//   float glowVertical = smoothstep(0.05, 0.0, abs(edgeDistY)) * (0.6 + 0.4 * sin(uTime * 10.0 + edgeDistY * 20.0));

//   glow = max(glowSquare, glowVertical); // Stronger blend
// }


//   // Final color and alpha
//   vec3 glowColor = vec3(1.0);
//   vec3 baseColor = mix(uColor, glowColor, glow);
//   float finalAlpha = clamp(rawAlpha + glow, 0.0, 1.0);

//   // Discard pixels completely when fully transparent
//   if (finalAlpha < 0.01) discard;

//   gl_FragColor = vec4(baseColor, finalAlpha);
// }



// tringale

// fire transition not working


// precision mediump float;

// uniform float uTime;
// uniform vec3 uColor;
// varying vec3 vPosition;

// // Classic random noise
// float random(vec2 st) {
//   return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
// }

// // Value noise
// float noise(vec2 st) {
//   vec2 i = floor(st);
//   vec2 f = fract(st);

//   float a = random(i);
//   float b = random(i + vec2(1.0, 0.0));
//   float c = random(i + vec2(0.0, 1.0));
//   float d = random(i + vec2(1.0, 1.0));

//   vec2 u = f * f * (3.0 - 2.0 * f);

//   return mix(a, b, u.x) +
//          (c - a) * u.y * (1.0 - u.x) +
//          (d - b) * u.x * u.y;
// }

// void main() {
//   // Timing
//   float verticalStart = 0.5;
//   float verticalDuration = 1.5;
//   float radialStart = verticalStart + verticalDuration;
//   float radialDuration = 4.5;

//   // Reveal logic
//   float t1 = clamp((uTime - verticalStart) / verticalDuration, 0.0, 1.0);
//   float revealY = mix(6.0, -1.5, t1);
//   float baseRadius = 1.0;
//   float distFromCenter = length(vPosition.xz);

//   float verticalEdgeWidth = 0.3;
//   float radiusEdgeWidth = 0.5;

//   float verticalReveal = smoothstep(revealY - verticalEdgeWidth, revealY + verticalEdgeWidth, vPosition.y);
//   float withinBaseRadius = smoothstep(baseRadius + radiusEdgeWidth, baseRadius - radiusEdgeWidth, distFromCenter);
//   float alphaPhase1 = verticalReveal * withinBaseRadius;

//   float t2 = clamp((uTime - radialStart) / radialDuration, 0.0, 1.0);
//   float expandingRadius = mix(baseRadius, 30.0, t2);
//   float withinExpandedRadius = smoothstep(expandingRadius + radiusEdgeWidth, expandingRadius - radiusEdgeWidth, distFromCenter);
//   float alphaPhase2 = verticalReveal * withinExpandedRadius;

//   float rawAlpha = max(alphaPhase1, alphaPhase2);

//   // FIRE GLOW: Flickering orange/red glow at edges using noise
//   float edgeDist = abs(distFromCenter - expandingRadius);
//   float noiseInput = vec2(vPosition.x * 4.0, vPosition.y * 4.0 + uTime * 5.0);
//   float flicker = noise(noiseInput) * smoothstep(0.3, 0.0, edgeDist);
//   flicker *= rawAlpha;

//   vec3 fireColor = mix(vec3(1.0, 0.3, 0.0), vec3(1.0, 1.0, 0.0), noise(noiseInput + 1.0));
//   vec3 baseColor = mix(uColor, fireColor, flicker);

//   float finalAlpha = clamp(rawAlpha + flicker * 0.8, 0.0, 1.0);
//   gl_FragColor = vec4(baseColor, finalAlpha);
// }
