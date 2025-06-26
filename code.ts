(async () => {
    // Create a rectangle (square) node
    const square = figma.createRectangle();

    // Set size to 100x100 pixels
    square.resize(100, 100);

    // Set position to x=200, y=300
    square.x = 200;
    square.y = 300;

    // Set a blue fill for visibility
    square.fills = [{ type: 'SOLID', color: { r: 0, g: 0.5, b: 1 }, opacity: 1 }];

    // Add a black, 2-pixel stroke
    square.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 1 }];
    square.strokeWeight = 2;

    // Create a text node and load font asynchronously
    const text = figma.createText();
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
    text.characters = 'My Square';
    text.fontName = { family: 'Inter', style: 'Regular' };
    text.fontSize = 16;
    text.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 1 }];

    // Position the text above the square, centered horizontally
    text.x = square.x + (square.width - text.width) / 2; // Center text relative to square
    text.y = square.y - 30; // 30 pixels above the square

    // Add the square and text to the current page
    figma.currentPage.appendChild(square);
    figma.currentPage.appendChild(text);

    // Log the properties for verification
    console.log('Square created with properties:', {
        width: square.width,
        height: square.height,
        x: square.x,
        y: square.y,
        fill: square.fills[0],
        stroke: square.strokes[0],
        strokeWeight: square.strokeWeight
      });
      console.log('Text created with properties:', {
        content: text.characters,
        x: text.x,
        y: text.y,
        fontName: text.fontName,
        fontSize: text.fontSize,
        fill: text.fills[0]
      });

    // Close the plugin
    figma.closePlugin();

})();