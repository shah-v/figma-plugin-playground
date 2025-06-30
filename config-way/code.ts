interface NodeConfig {
  type: 'rectangle' | 'ellipse' | 'text' | 'group';
  x?: number;
  y?: number;
  rotation?: number;
  fill?: Paint | null;
  stroke?: Paint;
  strokeWeight?: number;
  size?: number;
  text?: {
    content: string;
    fontName: { family: string; style: string };
    fontSize: number;
  };
  children?: NodeConfig[];
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
  
  async function createNode(cfg: NodeConfig): Promise<SceneNode | null> {
    console.log('Node config:', cfg);
    if (cfg.type === 'text') {
      if (!cfg.text || typeof cfg.text.content !== 'string' || !cfg.text.fontName || typeof cfg.text.fontSize !== 'number' || cfg.text.fontSize <= 0) {
        console.error(`Invalid text config: ${JSON.stringify(cfg)}. Skipping node.`);
        return null;
      }
      try {
        console.log('Text: Starting font load:', cfg.text.fontName);
        await figma.loadFontAsync(cfg.text.fontName);
        console.log('Text: Font loaded successfully');
      } catch (e) {
        console.error(`Failed to load font ${JSON.stringify(cfg.text.fontName)}: ${e}`);
        return null;
      }
      console.log('Text: Creating text node');
      const text = figma.createText();
      console.log('Text: Setting fontName:', cfg.text.fontName);
      text.fontName = cfg.text.fontName;
      console.log('Text: Setting characters:', cfg.text.content);
      text.characters = cfg.text.content;
      console.log('Text: Setting fontSize:', cfg.text.fontSize);
      text.fontSize = cfg.text.fontSize;
      console.log('Text: Setting x:', cfg.x);
      text.x = cfg.x ?? 0;
      console.log('Text: Setting y:', cfg.y);
      text.y = cfg.y ?? 0;
      console.log('Text: Setting fills:', cfg.fill);
      text.fills = cfg.fill ? [cfg.fill] : [];
      if (cfg.rotation !== undefined) {
        console.log('Text: Setting rotation:', cfg.rotation);
        text.rotation = cfg.rotation;
      }
      return text;
    } else if (cfg.type === 'group') {
      if (!cfg.children || !Array.isArray(cfg.children) || cfg.children.length === 0) {
        console.error(`Invalid group config: ${JSON.stringify(cfg)}. Skipping group.`);
        return null;
      }
      const childNodes: SceneNode[] = [];
      for (const childCfg of cfg.children) {
        const child = await createNode(childCfg);
        if (child) childNodes.push(child);
      }
      if (childNodes.length === 0) {
        console.error('No valid children in group:', JSON.stringify(cfg));
        return null;
      }
      const group = figma.group(childNodes, figma.currentPage);
      if (cfg.x !== undefined && cfg.y !== undefined) {
        group.x = cfg.x;
        group.y = cfg.y;
      }
      if (cfg.rotation !== undefined) group.rotation = cfg.rotation;
      console.log(`Group created with properties:`, {
        x: group.x,
        y: group.y,
        children: group.children.map(c => c.type),
        rotation: group.rotation
      });
      return group;
    } else {
      if (typeof cfg.size !== 'number' || cfg.size <= 0) {
        console.error(`Invalid size for ${cfg.type}: ${cfg.size}. Skipping shape.`);
        return null;
      }
      const shape = cfg.type === 'rectangle' ? figma.createRectangle() : figma.createEllipse();
      shape.resize(cfg.size, cfg.size);
      shape.x = cfg.x ?? 0;
      shape.y = cfg.y ?? 0;
      shape.fills = cfg.fill ? [cfg.fill] : [];
      shape.strokes = cfg.stroke ? [cfg.stroke] : [];
      shape.strokeWeight = cfg.strokeWeight ?? 1;
      if (cfg.rotation !== undefined) shape.rotation = cfg.rotation;
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
      return shape;
    }
  }
  
  for (const cfg of parsedConfig) {
    const node = await createNode(cfg);
    if (node) figma.currentPage.appendChild(node);
  }
  
  figma.closePlugin();
})();