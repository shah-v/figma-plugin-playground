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
  console.log('Config type:', typeof config);
  console.log('Config content:', config);
  let parsedConfig: ShapeConfig[];
  try {
    parsedConfig = typeof config === 'string' ? JSON.parse(config) : config;
  } catch (e) {
    console.error('Failed to parse config:', e);
    figma.closePlugin('Error: Invalid config.json format');
    return;
  }
  for (const cfg of parsedConfig) {
    console.log('Shape config:', cfg);
    if (typeof cfg.size !== 'number' || cfg.size <= 0) {
      console.error(`Invalid size for ${cfg.type}: ${cfg.size}. Skipping shape.`);
      continue;
    }
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