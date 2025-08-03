uniform sampler2D uPerlinTexture;
uniform float uTime;
varying vec2 vUv;

void main() {
  // Distort UVs for wave effect
  vec2 distortedUv = vUv;
  distortedUv.x *= 0.5;
  distortedUv.y *= 0.3;

  // distortedUv.y -= uTime * 0.03;

  // Animate texture upward
  float smoke = texture2D(uPerlinTexture, distortedUv).r;

  smoke = smoothstep(0.4,1.0,smoke);

  // Fade alpha toward the top
  smoke *= smoothstep(0.0,0.1,vUv.x);
  smoke *= smoothstep(1.0,0.9,vUv.x);
  smoke *= smoothstep(0.0,0.1,vUv.y);
  smoke *= smoothstep(1.0,0.4,vUv.y);

  vec3 steamColor = vec3(0.6, 0.3, 0.2); // soft white steam
  gl_FragColor = vec4(steamColor, smoke);
  // gl_FragColor = vec4(1.0,0.0,0.0,1.0);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
