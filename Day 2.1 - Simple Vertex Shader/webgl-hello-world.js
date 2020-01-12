// WebGL is an API which works with your GPU to render stuff
// JavaScript is executed on the CPU, it can't be executed on the GPU
// However, the GPU is still programmable

const canvas = document.querySelector("#canvas");

// The program executable by the GPU is created by
// a method called from a WebGL rendering context
const context = canvas.getContext("webgl");
const program = context.createProgram();

// GPU programs consit of two "functions", called SHADERS
// Webcontext support several types of shaders

// In this day's example, we will work with VERTEX and FRAGMENT shaders
// both of them can be created by the createShader method
const vertexShader = context.createShader(context.VERTEX_SHADER);
const fragmentShader = context.createShader(context.FRAGMENT_SHADER);

// Let us write the simplest of shaders

// The main() call is very similar to C and C++, however—unlike it—it does not return anything
// It assigns a value to the gl_Position global variable instead

// There are plenty of functions available in shaders
// Here, vec4 creates a vector of 4 components (even though we live in a 3D world)
const vShaderSource = `
  void main() {
    gl_Position = vec4(0, 0, 0, 1);
  }
`;

// Connects the shader variable with the shader source
context.shaderSource(vertexShader, vShaderSource);

// Shaders need to be compiled in order to be executed
context.compileShader(vertexShader);

// Compilation results can be retrieved by getShaderInfoLog
// If the result is an empty string, the compilation was successful
const infoLog = context.getShaderInfoLog(vertexShader);
console.log("Info Log:");
console.log(infoLog === "" ? "Compilation successful!" : infoLog);
