uniform sampler2D uTexture;
uniform float uTime;
varying vec2 vUv;

void main() {
    // Distort UVs with sine waves
    vec2 distortedUv = vUv;
    distortedUv.x += sin(vUv.y * 20.0 + uTime * 2.0) * 0.02;
    distortedUv.y += sin(vUv.x * 15.0 + uTime * 1.5) * 0.02;

    // Sample the texture with distorted coordinates
    vec4 color = texture2D(uTexture, distortedUv);

    gl_FragColor = color;
}
