interface NodeConfig {
  type: 'rectangle' | 'ellipse' | 'text';
  x: number;
  y: number;
  rotation?: number;
  fill?: Paint | null;
  stroke?: Paint;
  strokeWeight?: number;
  size?: number; // For shapes
  text?: {
    content: string;
    fontName: { family: string; style: string };
    fontSize: number;
  }; // For text
}

const config: NodeConfig[] = require('./config.json');

(async () => {
  console.log('Config type:', typeof config);
  console.log('Config content:', config);
  let parsedConfig: NodeConfig[];
  try {
    parsedConfig = typeof config === 'string' ? JSON.parse(config) : config;
  } catch (e) {
    console.error('Failed to parse config:', e);
    figma.closePlugin('Error: Invalid config.json format');
    return;
  }
  for (const cfg of parsedConfig) {
    console.log('Node config:', cfg);
    if (cfg.type === 'text') {
      if (!cfg.text || typeof cfg.text.content !== 'string' || !cfg.text.fontName || typeof cfg.text.fontSize !== 'number' || cfg.text.fontSize <= 0) {
        console.error(`Invalid text config: ${JSON.stringify(cfg)}. Skipping node.`);
        continue;
      }
      console.log('Text: Starting font load:', cfg.text.fontName);
      try {
        await figma.loadFontAsync(cfg.text.fontName);
        console.log('Text: Font loaded successfully');
      } catch (e) {
        console.error(`Failed to load font ${JSON.stringify(cfg.text.fontName)}: ${e}`);
        continue;
      }
      console.log('Text: Creating text node');
      const text = figma.createText();
      console.log('Text: Setting characters:', cfg.text.content);
      text.characters = cfg.text.content;
      console.log('Text: Setting fontName:', cfg.text.fontName);
      text.fontName = cfg.text.fontName;
      console.log('Text: Setting fontSize:', cfg.text.fontSize);
      text.fontSize = cfg.text.fontSize;
      console.log('Text: Setting x:', cfg.x);
      text.x = cfg.x;
      console.log('Text: Setting y:', cfg.y);
      text.y = cfg.y;
      console.log('Text: Setting fills:', cfg.fill);
      text.fills = cfg.fill ? [cfg.fill] : [];
      if (cfg.rotation !== undefined) {
        console.log('Text: Setting rotation:', cfg.rotation);
        text.rotation = cfg.rotation;
      }
      console.log('Text: Appending to page');
      figma.currentPage.appendChild(text);
      console.log(`Text node created with properties:`, {
        content: text.characters,
        x: text.x,
        y: text.y,
        fontName: text.fontName,
        fontSize: text.fontSize,
        fill: text.fills.length ? text.fills[0] : null,
        rotation: text.rotation
      });
    } else {
      if (typeof cfg.size !== 'number' || cfg.size <= 0) {
        console.error(`Invalid size for ${cfg.type}: ${cfg.size}. Skipping shape.`);
        continue;
      }
      const shape = cfg.type === 'rectangle' ? figma.createRectangle() : figma.createEllipse();
      shape.resize(cfg.size, cfg.size);
      shape.x = cfg.x;
      shape.y = cfg.y;
      shape.fills = cfg.fill ? [cfg.fill] : [];
      shape.strokes = cfg.stroke ? [cfg.stroke] : [];
      shape.strokeWeight = cfg.strokeWeight ?? 1;
      if (cfg.rotation !== undefined) shape.rotation = cfg.rotation;
      figma.currentPage.appendChild(shape);
      console.log(`Shape (${cfg.type}) created with properties:`, {
        width: shape.width,
        height: shape.height,
        x: shape.x,
        y: shape.y,
        fill: shape.fills.length ? shape.fills[0] : null,
        stroke: shape.strokes.length ? shape.strokes[0] : null,
        strokeWeight: shape.strokeWeight,
        rotation: shape.rotation
      });
    }
  }
  figma.closePlugin();
})();