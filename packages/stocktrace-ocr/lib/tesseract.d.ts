/// <reference types="node" />
import { Scheduler } from 'tesseract.js';
import Jimp from 'jimp';
export declare const initScheduler: () => Promise<Scheduler>;
export declare const closeScheduler: () => Promise<any>;
export declare const recognizeBuffer: (buf: Buffer) => Promise<import("tesseract.js").RecognizeResult | import("tesseract.js").ConfigResult | import("tesseract.js").DetectResult>;
export declare const recognizeLocalFile: (filePath: string) => Promise<import("tesseract.js").RecognizeResult | import("tesseract.js").ConfigResult | import("tesseract.js").DetectResult>;
export declare const recognizeWithJimp: (image: Jimp) => Promise<import("tesseract.js").RecognizeResult | import("tesseract.js").ConfigResult | import("tesseract.js").DetectResult>;
export declare const recognize: (buffer: Buffer) => Promise<import("tesseract.js").RecognizeResult | import("tesseract.js").ConfigResult | import("tesseract.js").DetectResult>;
