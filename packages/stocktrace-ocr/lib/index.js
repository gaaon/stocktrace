"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stock_1 = require("./stock");
Object.defineProperty(exports, "parseOCR", { enumerable: true, get: function () { return stock_1.parseOCR; } });
var tesseract_1 = require("./tesseract");
Object.defineProperty(exports, "initScheduler", { enumerable: true, get: function () { return tesseract_1.initScheduler; } });
Object.defineProperty(exports, "closeScheduler", { enumerable: true, get: function () { return tesseract_1.closeScheduler; } });
Object.defineProperty(exports, "recognizeBuffer", { enumerable: true, get: function () { return tesseract_1.recognizeBuffer; } });
