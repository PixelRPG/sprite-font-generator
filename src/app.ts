import { Engine, Text, Font, FontUnit, FontStyle, TextAlign, BaseAlign, Direction, ScreenElement, DisplayMode, Loader, Color } from 'excalibur';
import { addFontPreviews, initDownloadButton, initFontSelect, saveCanvasAsPNG, setCodeCharset, waitForFontLoad } from './html';
import { getUnicodeStringByNames } from './unicode';
import type { FontOptions } from './types';

const loader = new Loader([]);

const unicodeText = getUnicodeStringByNames(['Basic Latin', 'Latin-1 Supplement'], 10);

const engine = new Engine({
  antialiasing: false,
  snapToPixel: false,
  suppressPlayButton: true,
  backgroundColor: Color.Transparent,
  displayMode: DisplayMode.Fixed,
  width: 600,
  height: 800,
  canvasElementId: 'canvas',
});

// Without that the download button will not work
engine.useCanvas2DFallback();

const baseFontOptions: FontOptions = {
  unit: FontUnit.Px,
  quality: 1,
  padding: 0, // for rounding errors?
  smoothing: false,
  style: FontStyle.Normal,
  bold: false,
  textAlign: TextAlign.Left,
  baseAlign: BaseAlign.Top,
  direction: Direction.LeftToRight,
  color: Color.Black,
}

const fonts: FontOptions[] = [
  // Ark Pixel
  {
    size: 10,
    family: 'ark-pixel-10px-monospaced-latin',
  },
  {
    size: 12,
    family: 'ark-pixel-12px-monospaced-latin',
  },
  {
    size: 16,
    family: 'ark-pixel-16px-monospaced-latin',
  },
];

const texts: Text[] = [];

for (const fontData of fonts) {
  texts.push(new Text({
    text: unicodeText,
    font: new Font({
      ...baseFontOptions,
      ...fontData,
    }),
  }));
}

const actor = new ScreenElement({});

for (const text of texts) {
  const size = (text.font as Font).size
  const family = (text.font as Font).family
  await waitForFontLoad(`${size}px '${family}'`); // e.g. '10px ark-pixel-10px-monospaced-latin'
  actor.graphics.add(family, text);
}

let activeFontIndex = 0;

const setFixedScreenSize = (width: number, height: number) => {
  engine.screen.viewport.width = width;
  engine.screen.viewport.height = height;

  engine.screen.resolution.width = width;
  engine.screen.resolution.height = height;

  engine.screen.applyResolutionAndViewport()
}

const switchFont = (index: number) => {
  if (index < 0 || index >= texts.length) {
    return;
  }
  const text = texts[index];
  const family = (text.font as Font).family;
  const size = (text.font as Font).size;
  console.info(`Switching to font ${family} ${size}px`);
  actor.graphics.use(family);

  // Set canvas size to match text size
  const width = actor.graphics.getGraphic(family)?.width ?? 0;
  const height = actor.graphics.getGraphic(family)?.height ?? 0;

  setFixedScreenSize(width, height);

  activeFontIndex = index;
}

switchFont(0);

engine.add(actor);

// Add HTML text fonts
addFontPreviews(fonts);

setCodeCharset(unicodeText);

initDownloadButton(engine, () => {
  const family = (texts[activeFontIndex].font as Font).family;
  saveCanvasAsPNG(engine.canvas, `${family}.png`);
});

initFontSelect(fonts, (font: string) => {
  const index = texts.findIndex((text) => {
    return (text.font as Font).family  === font;
  });
  switchFont(index);
});

// Start canvas renderer
await engine.start(loader)
