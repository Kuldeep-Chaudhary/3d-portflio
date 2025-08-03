// Simple glitch distortion using sine waves
vec3 applyGlitch(vec3 pos, float strength) {
  float glitch = sin(pos.y * 10.0 + uTime * 40.0) * 0.05;
  float blocky = step(0.5, fract(pos.y * 10.0 + uTime)) * glitch;
  pos.x += blocky * strength;
  pos.z += blocky * strength;
  return pos;
}
