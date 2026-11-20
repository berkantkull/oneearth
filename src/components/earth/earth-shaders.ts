export const earthVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

export const earthFragment = /* glsl */ `
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform sampler2D specularMap;
  uniform sampler2D normalMap;
  uniform sampler2D cloudMap;
  uniform vec3 sunDirection;
  uniform float cloudOffset;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 east = normalize(cross(vec3(0.0, 1.0, 0.0), normal) + vec3(0.000001, 0.0, 0.0));
    vec3 north = cross(normal, east);
    vec3 sampledNormal = texture2D(normalMap, vUv).xyz * 2.0 - 1.0;
    vec3 surfaceNormal = normalize(normal + (east * sampledNormal.x + north * sampledNormal.y) * 0.34);
    vec3 lightDirection = normalize(sunDirection);
    vec3 viewDirection = normalize(cameraPosition - vWorldPos);
    float sunDot = dot(normal, lightDirection);
    float diffuse = max(dot(surfaceNormal, lightDirection), 0.0);
    float dayAmount = smoothstep(-0.12, 0.18, sunDot);
    vec3 day = texture2D(dayMap, vUv).rgb;
    vec3 night = texture2D(nightMap, vUv).rgb;
    float ocean = texture2D(specularMap, vUv).r;
    float cloudShadow = texture2D(cloudMap, vec2(vUv.x + cloudOffset, vUv.y)).r;
    vec3 color = day * (0.035 + diffuse * 1.12) * (1.0 - cloudShadow * 0.3);
    vec3 halfway = normalize(lightDirection + viewDirection);
    float highlight = pow(max(dot(normal, halfway), 0.0), 64.0) * ocean * dayAmount;
    color += vec3(1.0, 0.94, 0.82) * highlight * 0.46;
    float terminator = smoothstep(-0.1, 0.0, sunDot) * (1.0 - smoothstep(0.0, 0.18, sunDot));
    color += vec3(0.25, 0.075, 0.015) * terminator * 0.12;
    vec3 cityLights = pow(night, vec3(1.35)) * vec3(1.0, 0.84, 0.58) * 1.45;
    color += cityLights * (1.0 - dayAmount) * (1.0 - cloudShadow * 0.55);
    float fresnel = pow(1.0 - max(dot(normal, viewDirection), 0.0), 3.0);
    color = mix(color, vec3(0.22, 0.48, 0.86) * (0.22 + dayAmount), fresnel * 0.42 * (0.25 + dayAmount * 0.75));
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export const cloudFragment = /* glsl */ `
  uniform sampler2D cloudMap;
  uniform vec3 sunDirection;
  uniform float cloudOffset;
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vec3 normal = normalize(vNormal);
    float cloud = texture2D(cloudMap, vec2(vUv.x + cloudOffset, vUv.y)).r;
    cloud = smoothstep(0.1, 0.88, cloud);
    float light = smoothstep(-0.15, 0.35, dot(normal, normalize(sunDirection)));
    gl_FragColor = vec4(vec3(0.92, 0.95, 1.0) * (0.05 + light * 0.95), cloud * 0.74 * (0.2 + light * 0.8));
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

export const atmosphereFragment = /* glsl */ `
  uniform vec3 sunDirection;
  uniform float limbDot;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(cameraPosition - vWorldPos);
    float alpha = smoothstep(0.0, limbDot, -dot(normal, viewDirection));
    float glow = pow(alpha, 3.0);
    vec3 limb = normalize(vWorldPos - viewDirection * dot(vWorldPos, viewDirection));
    float sunlight = smoothstep(-0.45, 0.5, dot(limb, normalize(sunDirection)));
    vec3 color = mix(vec3(0.025, 0.08, 0.24), vec3(0.26, 0.56, 1.0), sunlight);
    gl_FragColor = vec4(color * glow * (0.12 + sunlight * 0.88) * 1.28, 1.0);
  }
`;
