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

// Here we will also need to convert the given y
// to a value fit to WebGL's [-1, 1] clip space
// Thus, instead of a width uniform, we will use one called resolution
const vShaderSource = `
  attribute vec2 position;
  uniform vec2 resolution;

  void main() {
    vec2 transformedPosition = position / resolution *  2.0 - 1.0;
    gl_PointSize = 2.0;
    gl_Position = vec4(transformedPosition, 0, 1);
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

// Resolution's pointer instead of the previous width
const resolutionPointer = context.getUniformLocation(program, "resolution");
context.uniform2fv(resolutionPointer, [canvas.width, canvas.height]);

const positionPointer = context.getAttribLocation(program, "position");
const positionBuffer = context.createBuffer(context.ARRAY_BUFFER);

// Let us fill the position data with lines
// (i.e. a set of starting and ending points)
const lines = [];
let prevLineY = 0;

for (let i = 0; i < canvas.width - 5; i += 5) {
  lines.push(i, prevLineY);

  const y = Math.random() * canvas.clientHeight;
  lines.push(i + 5, y);

  prevLineY = y;
}
const positionData = new Float32Array(lines);

context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
context.bufferData(context.ARRAY_BUFFER, positionData, context.STATIC_DRAW);

// Unlike point size, the line width needs to be set from JavaScript
// Unfortunately, the below line has awful browser support

// Therefore, LINES should only be used for the simplest of lines, custom
// lines should use TRIANGLES instead (EVERYTHING can be drawn with triangles)

// Thus, rendering work as follows:
// 1. Input: The triangles' vertices
// 2. Vertex Shader: Transform the vertices to the WebGL's clipspace (i.e. to [-1, 1] values)
// 3. Rasterization: Calculate which pixels are within each triangle
// 4. Calculate the color of each pixel

// https://opentechschool-brussels.github.io/intro-to-webGL-and-shaders/log1_graphic-pipeline
context.lineWidth(10);

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
context.drawArrays(context.LINES, 0, positionData.length / 2);
