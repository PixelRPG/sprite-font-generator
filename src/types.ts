import type { FontOptions as ExFontOptions, GraphicOptions, RasterOptions } from 'excalibur';

export type FontOptions = ExFontOptions & GraphicOptions & RasterOptions;

export interface UnicodeBlock {
    begin: number;
    end: number;
    name: string;
}