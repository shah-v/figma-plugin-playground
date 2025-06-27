(async () => {
    // Show UI
    figma.showUI(__html__, { width: 300, height: 300 });
  
    // Handle UI messages
    figma.ui.onmessage = (msg) => {
      const shape = msg.shapeType === 'rectangle' ? figma.createRectangle() : figma.createEllipse();
      shape.resize(msg.size, msg.size);
      shape.x = msg.x;
      shape.y = msg.y;
      shape.fills = msg.useFill ? [{
        type: 'SOLID',
        color: {
          r: parseInt(msg.fillColor.slice(1, 3), 16) / 255,
          g: parseInt(msg.fillColor.slice(3, 5), 16) / 255,
          b: parseInt(msg.fillColor.slice(5, 7), 16) / 255
        },
        opacity: 1
      }] : [];
      shape.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 1 }];
      shape.strokeWeight = 2;
  
      figma.currentPage.appendChild(shape);
  
      console.log(`Shape (${msg.shapeType}) created with properties:`, {
        width: shape.width,
        height: shape.height,
        x: shape.x,
        y: shape.y,
        fill: shape.fills.length ? shape.fills[0] : null,
        stroke: shape.strokes[0],
        strokeWeight: shape.strokeWeight
      });
  
      figma.closePlugin();
    };
  })();