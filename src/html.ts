import { replaceBreaksWithHtml } from './utils';
import type { Text, Font } from 'excalibur';

const sectionEl = document.getElementById('section-html');

const addHTMLTextFont = (chars: string, font: string, size: number) => {
    const newSectionEl = document.createElement('section');
    newSectionEl.innerHTML = `
        <p>${font}</p>
        <span style="font-family: ${font}; font-size: ${size}px;">${replaceBreaksWithHtml(chars)}</span>
    `;
    sectionEl?.append(newSectionEl);
};

export const addHTMLTextFonts = (chars: string, texts: Text[]) => {
    for (const text of texts) {
        const size = (text.font as Font).size;
        const family = (text.font as Font).family;
        addHTMLTextFont(chars, family, size);
    }
}