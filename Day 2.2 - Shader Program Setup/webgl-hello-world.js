const canvas = document.querySelector("#canvas");
const context = canvas.getContext("webgl");
const program = context.createProgram();

const vertexShader = context.createShader(context.VERTEX_SHADER);
const fragmentShader = context.createShader(context.FRAGMENT_SHADER);

// Helper function to link each shader to their source and compile them
function compileShader(shader, source) {
  context.shaderSource(shader, source);
  context.compileShader(shader);

  const infoLog = context.getShaderInfoLog(vertexShader);
  if (infoLog) {
    throw new Error(infoLog);
  }
}

// The previous vertex shader source
// Besides returning the point's coordinates, we need to return its size
const vShaderSource = `
  void main() {
    gl_Position = vec4(0, 0, 0, 1);
    gl_PointSize = 20.0;
  }
`;

// Now let us create a fragment shader source
// Its boilerplate looks exactly like the vertex on
// However its content is a color, assigned to the gl_FragColor global variable
// And unlike CSS, each color varies from 0 to 1 instead of 0 to 255 (here we are assigning it red)

// In other words, the vertex shader handles points (or VERTICES), while fragment shader handles COLOR
const fShaderSource = `
  void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
  }
`;

compileShader(vertexShader, vShaderSource);
compileShader(fragmentShader, fShaderSource);

// Now we connect our shaders with our program
context.attachShader(program, vertexShader);
context.attachShader(program, fragmentShader);

// And link our program, basically certifying that
// both shaders ARE COMPATIBLE WITH EACH TOHER
context.linkProgram(program);

// Since our application could have various WebGL programs,
// we tell the GPU which ones to use before issuing a DRAW CALL
context.useProgram(program);

// And we are ready to draw something
// We will talk about the method's parameters later
context.drawArrays(context.POINTS, 0, 1);
