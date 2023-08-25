import { Engine, Text, Font, FontUnit, FontStyle, TextAlign, BaseAlign, Direction, ScreenElement, DisplayMode, Loader, Color, KeyEvent, Keys, FontOptions, GraphicOptions, RasterOptions } from 'excalibur';
import { waitForFontLoad } from './utils';
import { addHTMLTextFonts } from './html';
import { getUnicodeStringByNames } from './unicode';

const loader = new Loader([]);

console.log("getUnicodeCharacterListByName", );

const unicodeText = getUnicodeStringByNames(['Basic Latin', 'Latin-1 Supplement'], 10);

const engine = new Engine({
  antialiasing: false,
  snapToPixel: false,
  suppressPlayButton: true,
  backgroundColor: Color.White,
  displayMode: DisplayMode.Fixed,
  width: 600,
  height: 800,
  canvasElementId: 'canvas',
});

const baseFontOptions: FontOptions & GraphicOptions & RasterOptions = {
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
  // Fusion Pixel

  // 8px to small?
  // {
  //   size: 8,
  //   family: 'fusion-pixel-8px-monospaced-latin',
  // },
  {
    size: 10,
    family: 'fusion-pixel-10px-monospaced-latin',
  },
  {
    size: 12,
    family: 'fusion-pixel-12px-monospaced-latin',
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
    // maxWidth: engine.drawWidth,
  }));
}

const actor = new ScreenElement({
  // width: engine.drawWidth,
  // height: engine.drawHeight,
});

for (const text of texts) {
  const size = (text.font as Font).size
  const family = (text.font as Font).family
  await waitForFontLoad(`${size}px '${family}'`); // e.g. '10px ark-pixel-10px-monospaced-latin'
  actor.graphics.add(family, text);
}

let activeFontIndex = -1;

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

  console.debug('width', width);
  console.debug('height', height);

  engine.screen.viewport.width = width;
  engine.screen.viewport.height = height;

  engine.screen.resolution.width = width;
  engine.screen.resolution.height = height;

  engine.screen.applyResolutionAndViewport()

}

const nextFont = () => {
  ++activeFontIndex;
  if (activeFontIndex >= texts.length) {
    activeFontIndex = 0;
  }
  switchFont(activeFontIndex);
}

const prevFont = () => {
  --activeFontIndex;
  if (activeFontIndex < 0) {
    activeFontIndex = texts.length - 1;
  }
  switchFont(activeFontIndex);
}

nextFont();

engine.add(actor);

engine.input.keyboard.on("release", (evt: KeyEvent) => {
  switch (evt.key) {
    case Keys.F1:
      engine.toggleDebug();
      break;
    case Keys.ArrowRight:
      nextFont();
      break;
    case Keys.ArrowLeft:
      prevFont();
      break;
    default:
      break;
  }
});

// Add HTML text fonts
addHTMLTextFonts(unicodeText, texts);

// Start canvas renderer
await engine.start(loader)
