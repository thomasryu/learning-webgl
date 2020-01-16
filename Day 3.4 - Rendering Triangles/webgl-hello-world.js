const canvas = document.querySelector("#canvas");
const context = canvas.getContext("webgl");
const program = context.createProgram();

const vertexShader = context.createShader(context.VERTEX_SHADER);
const fragmentShader = context.createShader(context.FRAGMENT_SHADER);

function compileShader(shader, source) {
  context.shaderSource(shader, source);
  context.compileShader(shader);

  const infoLog = context.getShaderInfoLog(vertexShader);
  if (infoLog) {
    throw new Error(infoLog);
  }
}

const vShaderSource = `
  attribute vec2 position;
  uniform vec2 resolution;

  void main() {
    vec2 transformedPosition = position / resolution *  2.0 - 1.0;
    gl_PointSize = 2.0;
    gl_Position = vec4(transformedPosition, 0, 1);
  }
`;

// As an additional, let us pass color from JavaScript instead of
// hardcoding it inside the fragment shader

// You also need to set the precision for floats
// mediump is both performant and precise, but sometimes you may want to use lowp or highp
// (highp may not be supported by some mobile GPUs, and there may be errors/artifacts in the render)
const fShaderSource = `
  precision mediump float;
  uniform vec4 color;

  void main() {
    gl_FragColor = color / 255.0;
  }
`;

compileShader(vertexShader, vShaderSource);
compileShader(fragmentShader, fShaderSource);

context.attachShader(program, vertexShader);
context.attachShader(program, fragmentShader);

context.linkProgram(program);
context.useProgram(program);

const resolutionPointer = context.getUniformLocation(program, "resolution");
context.uniform2fv(resolutionPointer, [canvas.width, canvas.height]);

const colorPointer = context.getUniformLocation(program, "color");
context.uniform4fv(colorPointer, [255, 0, 0, 255]);

const positionPointer = context.getAttribLocation(program, "position");
const positionBuffer = context.createBuffer(context.ARRAY_BUFFER);

// As a reminder, EVERYTHING can be built with triangles,
// and the rendering process is as follows:

// 1. Input: The triangles' vertices
// 2. Vertex Shader: Transform the vertices to the WebGL's clipspace (i.e. to [-1, 1] values)
// 3. Rasterization: Calculate which pixels are within each triangle
// 4. Calculate the color of each pixel

// Let us then draw trinagles
const triangles = [
  0, // v1
  0,

  canvas.width / 2, // v2
  canvas.height,

  canvas.width, // v3
  0
];

const positionData = new Float32Array(triangles);

context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
context.bufferData(context.ARRAY_BUFFER, positionData, context.STATIC_DRAW);

const attributeSize = 2;
const type = context.FLOAT;
const normalized = false;
const stride = 0;
const offset = 0;

context.enableVertexAttribArray(positionPointer);
context.vertexAttribPointer(
  positionPointer,
  attributeSize,
  type,
  normalized,
  stride,
  offset
);

// Finally, we need to change the primitive type to LINES instead of POINTS
context.drawArrays(context.TRIANGLES, 0, positionData.length / 2);
