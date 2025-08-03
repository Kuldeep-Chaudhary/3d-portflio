// Add a soft glowing edge
float edgeGlow(float edgeAlpha, float distToEdge, float timePulse) {
  float glow = smoothstep(1.0, 0.0, abs(distToEdge));
  glow *= 0.5 + 0.5 * sin(uTime * 8.0 + distToEdge * 20.0);
  return edgeAlpha * glow;
}
