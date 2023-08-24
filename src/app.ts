import { Engine, Text, Font, FontUnit, FontStyle, TextAlign, BaseAlign, Direction, ScreenElement, DisplayMode, Loader, Color } from 'excalibur';
import { waitForFontLoad } from './utils';

const loader = new Loader([]);

const unicodeText = `ABCDEFGHIJKLMNOPQRSTUVWXYZ
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
‟․‥…‧※‾⁋⁌⁍⁰ⁱ⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁿ₀
₁₂₃₄₅₆₇₈₉₊₋₌₍₎ₐₑₒₓₔₕₖₗₘₙₚₛ
ₜ
`

const engine = new Engine({
  antialiasing: false,
  snapToPixel: false,
  suppressPlayButton: true,
  backgroundColor: Color.White,
  displayMode: DisplayMode.Fixed,
  width: 200,
  height: 400,
});

// engine.showDebug(true);

const arkPixel16Text = new Text({
  text: unicodeText,
  font: new Font({
    size: 10,
    unit: FontUnit.Px,
    quality: 1,
    padding: 0,
    smoothing: false,
    family: 'ark-pixel-10px-monospaced-latin',
    style: FontStyle.Normal,
    bold: false,
    textAlign: TextAlign.Left,
    baseAlign: BaseAlign.Top,
    direction: Direction.LeftToRight,
    color: Color.Black,
  }),
  maxWidth: engine.drawWidth,
});


const actor = new ScreenElement({
  width: engine.drawWidth,
  height: engine.drawHeight,
});
actor.graphics.use(arkPixel16Text);

// actor.graphics.offset = vec(0, 10); // Bug?

engine.add(actor);

await waitForFontLoad('10px ark-pixel-10px-monospaced-latin');
await waitForFontLoad('12px ark-pixel-12px-monospaced-latin');
await waitForFontLoad('16px ark-pixel-16px-monospaced-latin');

await engine.start(loader)
