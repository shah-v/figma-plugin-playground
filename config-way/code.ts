interface ShapeConfig {
  type: 'rectangle' | 'ellipse';
  size: number;
  x: number;
  y: number;
  fill: Paint | null;
  stroke: Paint;
  strokeWeight: number;
}

const config: ShapeConfig[] = require('./config.json');

(async () => {
  for (const cfg of config) {
    const shape = cfg.type === 'rectangle' ? figma.createRectangle() : figma.createEllipse();
    shape.resize(cfg.size, cfg.size);
    shape.x = cfg.x;
    shape.y = cfg.y;
    shape.fills = cfg.fill ? [cfg.fill] : [];
    shape.strokes = [cfg.stroke];
    shape.strokeWeight = cfg.strokeWeight;
    figma.currentPage.appendChild(shape);
    console.log(`Shape (${cfg.type}) created with properties:`, {
      width: shape.width,
      height: shape.height,
      x: shape.x,
      y: shape.y,
      fill: shape.fills.length ? shape.fills[0] : null,
      stroke: shape.strokes[0],
      strokeWeight: shape.strokeWeight
    });
  }
  figma.closePlugin();
})();