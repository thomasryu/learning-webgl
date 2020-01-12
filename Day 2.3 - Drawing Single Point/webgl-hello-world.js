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
  void main() {
    gl_Position = vec4(0, 0, 0, 1);
    gl_PointSize = 20.0;
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

// WebGL can render several types of "primitives",
// amongst them POINTS, LINES, AND TRIANGLES

// Since it is possible to assign different points to different primitives,
// we need to tell which indexes correspond to which primitive (here 0, since we only have a single point)
// and the primitives count (here 1, since we are only using a single point)
context.drawArrays(context.POINTS, 0, 1);

// As you might've noticed, the red square we created is positioned in the center of the canvas
// The previously used canvas2d's coordinate system works differently to WebGL's

// [ canvas2d's ]

// 0.0
// -----------------------→ width (px)
// |
// |
// |
// ↓
// height (px)

// [ WebGL's ]

//                (0, 1)
//                  ↑
//                  |
//                  |
//                  |
// (-1, 0) ------ (0, 0)-·---------> (1, 0)
//                  |
//                  |
//                  |
//                  |
//                (0, -1)
