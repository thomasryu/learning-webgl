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

// We can use a vec2 directly within gl_Position instead of
// using position.x and position.y
const vShaderSource = `
  attribute vec2 position;

  void main() {
    gl_PointSize = 20.0;
    gl_Position = vec4(position, 0, 1);
  }
`;

const fShaderSource = `
  void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
  }
`;

compileShader(vertexShader, vShaderSource);
compileShader(fragmentShader, fShaderSource);

context.attachShader(program, vertexShader);
context.attachShader(program, fragmentShader);

context.linkProgram(program);
context.useProgram(program);

const positionPointer = context.getAttribLocation(program, "position");
const positionBuffer = context.createBuffer(context.ARRAY_BUFFER);

// Let us define multiple points for the GPU to draw
const positionData = new Float32Array([
  -1, // x1
  -1, // y1

  1, // x2
  1, // y2

  -1, // x3
  1, // y3

  1, // x4
  -1 // y4
]);

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

// Notice we now have 4 points, each defined by 2 coordinates
context.drawArrays(context.POINTS, 0, positionData.length / 2);
