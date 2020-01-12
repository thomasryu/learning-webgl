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

// Now let us pass point coordinates to the
// vertex shader instead of hardcoding them

// Input data of vertex shaders are called attributes
const vShaderSource = `
  attribute vec2 position;

  void main() {
    gl_PointSize = 20.0;
    gl_Position = vec4(position.x, position.y, 0, 1);
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

// In order to fill the position attribute within the vertex shader with its
// x and y values, we need to get its location (something akin to its unique identifier,
// its pointer within the program)
const positionPointer = context.getAttribLocation(program, "position");

// Since the GPU only accepts typed arrays as input, we define a Float32Array variable
// as our storage for the point's position
const positionData = new Float32Array([0, 0]);

// The above array cannot be passed to the GPU as-is, it requires a buffer
// (a middle-man) for the GPU to receive it appropriately

// There are many kinds of buffers, here we are going to use a ARRAY_BUFFER
const positionBuffer = context.createBuffer(context.ARRAY_BUFFER);

// To make any changes to our buffer we need to bind it
// A bound buffer is treated as current (i.e. it is the one the GPU is going to use),
// and any further changes require the buffer to be rebinded (it is akin to committing changes in git)
context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);

// Now we fill the (bound) buffer with our data

// To optimize the buffer's operations (memory management) on the GPU's side, we can attach a "hint" to
// the buffer, telling the GPU how the buffer is going to be used (link to the hint—or USAGE—list:
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData#Parameters)

// Here STATIC_DRAW tells the GPU that the buffer's content
// are going to be used OFTEN and likely NOT CHANGED
context.bufferData(context.ARRAY_BUFFER, positionData, context.STATIC_DRAW);

// And we tell the GPU how to read the data from our buffer

// Since we are using a vec2 type attribute for position inside our vertex shader, we tell the
// attribute size is 2 (it would be 3 for a vec3, for example)
// Basically, it determines how many elements from the data array should be passed at a time
const attributeSize = 2;

// We tell it the type of the data within our buffer (i.e. floats)
const type = context.FLOAT;

// And also tells whether the data should be normalized (if it should be clamped to certain value ranges)
// BYTE and SHORT type data, for example, is clamped to [-1, 1] if true
// This parameter has no effect on FLOAT
const normalized = false;

// These two parameters will be talked about on a later date
const stride = 0;
const offset = 0;

// Finally, we setup our position attribute within our vertex shader
// Atributes are disabled by default (i.e. they are filled with 0's),
// so we need to enable our position attribute as well
context.enableVertexAttribArray(positionPointer);
context.vertexAttribPointer(
  positionPointer,
  attributeSize,
  type,
  normalized,
  stride,
  offset
);

context.drawArrays(context.POINTS, 0, 1);
