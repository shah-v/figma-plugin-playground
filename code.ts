// Create a rectangle (square) node
const square = figma.createRectangle();

// Set size to 100x100 pixels
square.resize(100, 100);

// Set position to x=200, y=300
square.x = 200;
square.y = 300;

// Set a blue fill for visibility
square.fills = [{ type: 'SOLID', color: { r: 0, g: 0.5, b: 1 }, opacity: 1 }];

// Add the square to the current page
figma.currentPage.appendChild(square);

// Log the square's properties for verification
console.log('Square created with properties:', {
  width: square.width,
  height: square.height,
  x: square.x,
  y: square.y,
  fill: square.fills[0]
});

// Close the plugin
figma.closePlugin();