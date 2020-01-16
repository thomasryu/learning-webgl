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

// Previously, we were calculating the x and y coordinates with JavaScript
// However for large datasets, JavaScript may block a rendering thread
// Thus we will use the GPU for such calculations

// Firstly, we will use uniforms—a special kind of variables—get the canvas'
// width in order to transform each x to a [-1, 1] range (uniforms are a type of
// global variables which can be assigned only once before the draw call, staying
// the same afterwards)

// Secondly we will define PI and use the GPU's native cossine function
const vShaderSource = `
  attribute vec2 position;
  uniform float width;

  #define M_PI 3.1415926535897932384626433832795

  void main() {
    float x = position.x / width *  2.0 - 1.0;
    gl_PointSize = 2.0;
    gl_Position = vec4(x, cos(x * M_PI), 0, 1);
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

// Notice we will have to assign a value to the width
// uniform as well, therefore we need its pointer
const widthPointer = context.getUniformLocation(program, "width");

// There are many methods with which to assign different types of values
// to uniforms (uniform1f assigns a float to the uniform)
context.uniform1f(widthPointer, canvas.width);

const positionPointer = context.getAttribLocation(program, "position");
const positionBuffer = context.createBuffer(context.ARRAY_BUFFER);

const points = [];

for (let i = 0; i < canvas.width; i++) {
  // Since all computations will be executed in the GPU,
  // we can send the column index directly to the shader
  points.push(i, i);
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
