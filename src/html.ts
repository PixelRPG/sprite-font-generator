import type { Engine } from 'excalibur';
import type { FontOptions } from './types';

const DOWNLOAD_BUTTON_ID = 'download-button';
const SECTION_HTML_ID = 'section-html';
const FONT_SELECT_ID = 'font-select';

const sectionEl = document.getElementById(SECTION_HTML_ID);

const addFontPreview = (font: FontOptions) => {
    if(!font.family || !font.size) {
        console.error('Font family or size missing', font);
        return
    }
    const newSectionEl = document.createElement('section');
    newSectionEl.innerHTML = `<span style="font-family: ${font.family}; font-size: ${font.size}px;">${font.family} ${font.size}</span>`;
    sectionEl?.append(newSectionEl);
};

export const addFontPreviews = (fonts: FontOptions[]) => {
    for (const font of fonts) {
        addFontPreview(font);
    }
}

export function saveCanvasAsPNG(canvas: HTMLCanvasElement, filename: string) {
    let link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL("image/png;base64");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export const initDownloadButton = (engine: Engine, onClick: () => void) => {
    const downloadButton = document.getElementById(DOWNLOAD_BUTTON_ID);
    downloadButton?.addEventListener('click', () => {
        engine.stop();
        onClick();
        engine.start();
    });
}

export const initFontSelect = (fonts: FontOptions[], onChange: (font: string) => void) => {
    const fontSelectEl = document.getElementById(FONT_SELECT_ID);

    if(!fontSelectEl) {
        return;
    }

    for (const font of fonts) {
        let optionElement = document.createElement('option');
        if(!font.family) {
            continue;
        }
        optionElement.value = font.family;
        optionElement.textContent = `${font.family} ${font.size}`;
        fontSelectEl.appendChild(optionElement);
    }

    fontSelectEl?.addEventListener('change', (evt) => {
        const font = (evt.target as HTMLSelectElement).value;
        onChange(font);
    });
}