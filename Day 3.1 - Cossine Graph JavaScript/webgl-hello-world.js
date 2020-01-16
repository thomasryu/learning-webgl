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

  void main() {
    gl_PointSize = 2.0;
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

// Let us remove the hardcoded points
const points = [];

// Iterate over each vertical line of pixels of the canvas
for (let i = 0; i < canvas.width; i++) {
  // Convert the x coordinate from [0, width] to the cossine graph's [-1, 1]
  const x = (i / canvas.width) * 2 - 1;

  // And calculate the cossine of said x
  const y = Math.cos(x * Math.PI);

  points.push(x, y);
}
const positionData = new Float32Array(points);

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

context.drawArrays(context.POINTS, 0, positionData.length / 2);
