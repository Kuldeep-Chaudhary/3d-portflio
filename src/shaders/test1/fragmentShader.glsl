 varying vec2 vUv;
varying float vRandom;

  void main() {
    gl_FragColor = vec4(0.5, vRandom, 1.0, 1.0); // simple gradient
  }