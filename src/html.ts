import type { Engine } from 'excalibur';
import type { FontOptions } from './types';

const DOWNLOAD_BUTTON_ID = 'download-button';
const SECTION_HTML_ID = 'section-html';
const FONT_SELECT_ID = 'font-select';
const CODE_CHARSET_ID = 'code-charset';

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

export const setCodeCharset = (code: string) => {
    const codeCharsetEl = document.getElementById(CODE_CHARSET_ID);
    if(!codeCharsetEl) {
        return;
    }
    codeCharsetEl.innerText = code;
}

export const saveCanvasAsPNG = (canvas: HTMLCanvasElement, filename: string) => {
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

export const waitForFontLoad = async (font: string, timeout = 2000, interval = 100) => {
    return new Promise((resolve, reject) => {
        const poller = setInterval(async () => {
        try {
            console.debug('Load font', font);
            await document.fonts.load(font);
        } catch (err) {
            reject(err);
        }
        if (document.fonts.check(font)) {
            clearInterval(poller);
            resolve(true);
        }
        }, interval);
        setTimeout(() => clearInterval(poller), timeout);
    });
}

export const replaceBreaksWithHtml = (input: string) => {
    return input.replace(/\n/g, '<br>');
}