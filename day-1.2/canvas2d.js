const canvas1 = document.querySelector("#canvas-1");
const canvas2 = document.querySelector("#canvas-2");
const context1 = canvas1.getContext("2d");
const context2 = canvas2.getContext("2d");

// Draws a black rectangle, built-in function
// (Fills every pixel inside a 100x50 pixel area with black)
context1.fillRect(0, 0, 100, 50);

// Calculates each pixel's index in the data array
function calculatePixelIndices(top, left, width, height) {
  const pixelIndices = [];
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const pixelsLeft = (x + left) * 4; // Pixels to skip from left
      const pixelsTop = (y + top) * canvas2.width * 4; // Pixels to skip from top

      const i = pixelsLeft + pixelsTop;
      pixelIndices.push(i);
    }
  }

  return pixelIndices;
}

// Custom fillRect function to demonstrate how the above one works
function customFillRect(top, left, width, height) {
  // Each pixel is a color encoded in 4 integers:
  // R, G, B channel and alpha (red, green, and blue levels and transparency)

  // To store the info of each pixel in the canvas, we will need a Uint8ClampedArray,
  // an array which stores integer values between 0-255 (i.e. a 8-bit integer)

  // The array size is canvas.width * canvas.height * 4 (i.e. the pixel count times the
  // number of channels)
  const pixelStore = new Uint8ClampedArray(canvas2.width * canvas2.height * 4);

  // Get the pixels to iterate over
  const pixelIndices = calculatePixelIndices(top, left, width, height);

  // Fills the pixel data array
  pixelIndices.forEach(i => {
    pixelStore[i] = 255; // R
    pixelStore[i + 1] = 0; // G
    pixelStore[i + 2] = 0; // B
    pixelStore[i + 3] = 255; // Alpha, notice it varies between 0 and 255, not 0 and 1
  });

  // Special canvas renderable class
  // It allows us to render our pixels from their data
  const imageData = new ImageData(pixelStore, canvas2.width, canvas2.height);
  context2.putImageData(imageData, 0, 0);
}

customFillRect(10, 10, 100, 50);
