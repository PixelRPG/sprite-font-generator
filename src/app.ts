import { Engine, Text, Font, FontUnit, FontStyle, TextAlign, BaseAlign, Direction, ScreenElement, DisplayMode, Loader, Color, KeyEvent, Keys, FontOptions, GraphicOptions, RasterOptions } from 'excalibur';
import { waitForFontLoad } from './utils';
import { addHTMLTextFonts } from './html'

const loader = new Loader([]);

const unicodeText =
`ABCDEFGHIJKLMNOPQRSTUVWXYZ
abcdefghijklmnopqrstuvwxyz
0123456789 !"#$%&'()*+,-./
:;<=>?@[\\]^_\`{|}~¡¢£¤¥¦§¨ª
«¬¯°±²³´µ¶¸¹º»¿ÀÁÂÃÄÅÆÇÈÉÊ
ËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãä
åæçèéêëìíîïðñòóôõö÷øùúûüýþ
ÿĀāĂăĆćĈĉĊċČčĐđĒēĔĕĖėĚěĜĝĞ
ğĠġĨĩĪīĬĭŃńŇňŌōŎŏŔŕŨũŪūŬŭŴ
ŵŶŷŸŹźŻżŽžƒǍǎǏǐǑǒǓǔǕǖǗǘǙǚǛ
ǜǝǞǟǠǡǢǣǸǹǼǽȞȟȲȳ‑‒–‘’‚‛“”„
‟․‥…‧‾⁋⁌⁍⁰ⁱ⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁿ₀₁₂
₃₄₅₆₇₈₉₊₋₌₍₎ₐₑₒₓₔₕₖₗₘₙₚₛₜ█`

const engine = new Engine({
  antialiasing: false,
  snapToPixel: false,
  suppressPlayButton: true,
  backgroundColor: Color.White,
  displayMode: DisplayMode.Fixed,
  width: 300,
  height: 300,
  canvasElementId: 'canvas',
});

const baseFontOptions: FontOptions & GraphicOptions & RasterOptions = {
  unit: FontUnit.Px,
  quality: 1,
  padding: 1, // 1px padding for rounding errors?
  smoothing: false,
  style: FontStyle.Normal,
  bold: false,
  textAlign: TextAlign.Left,
  baseAlign: BaseAlign.Top,
  direction: Direction.LeftToRight,
  color: Color.Black,
}

const texts = [
  // Ark Pixel
  new Text({
    text: unicodeText,
    font: new Font({
      ...baseFontOptions,
      size: 10,
      family: 'ark-pixel-10px-monospaced-latin',
    }),
    maxWidth: engine.drawWidth,
  }),
  new Text({
    text: unicodeText,
    font: new Font({
      ...baseFontOptions,
      size: 12,
      family: 'ark-pixel-12px-monospaced-latin',
    }),
    maxWidth: engine.drawWidth,
  }),
  new Text({
    text: unicodeText,
    font: new Font({
      ...baseFontOptions,
      size: 16,
      family: 'ark-pixel-16px-monospaced-latin',
    }),
    maxWidth: engine.drawWidth,
  }),

  // Fusion Pixel
  new Text({
    text: unicodeText,
    font: new Font({
      ...baseFontOptions,
      size: 8,
      family: 'fusion-pixel-8px-monospaced-latin',
    }),
    maxWidth: engine.drawWidth,
  }),
  new Text({
    text: unicodeText,
    font: new Font({
      ...baseFontOptions,
      size: 10,
      family: 'fusion-pixel-10px-monospaced-latin',
    }),
    maxWidth: engine.drawWidth,
  }),
  new Text({
    text: unicodeText,
    font: new Font({
      ...baseFontOptions,
      size: 12,
      family: 'fusion-pixel-12px-monospaced-latin',
    }),
    maxWidth: engine.drawWidth,
  }),
];


const actor = new ScreenElement({
  width: engine.drawWidth,
  height: engine.drawHeight,
});

for (const text of texts) {
  const size = (text.font as Font).size
  const family = (text.font as Font).family
  await waitForFontLoad(`${size}px ${family}`); // e.g. '10px ark-pixel-10px-monospaced-latin'
  actor.graphics.add(family, text);
}

let activeFontIndex = -1;

const nextFont = () => {
  ++activeFontIndex;
  if (activeFontIndex >= texts.length) {
    activeFontIndex = 0;
  }
  const text = texts[activeFontIndex];
  const family = (text.font as Font).family;
  const size = (text.font as Font).size;
  console.info(`Switching to font ${family} ${size}px`);
  actor.graphics.use(family);
}

const prevFont = () => {
  --activeFontIndex;
  if (activeFontIndex < 0) {
    activeFontIndex = texts.length - 1;
  }
  const text = texts[activeFontIndex];
  const family = (text.font as Font).family;
  const size = (text.font as Font).size;
  console.info(`Switching to font ${family} ${size}px`);
  actor.graphics.use(family);
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
