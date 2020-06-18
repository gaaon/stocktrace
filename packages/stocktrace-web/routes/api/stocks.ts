import {Application, NextFunction, Request, Response, Router} from 'express';
import multer, { memoryStorage } from 'multer';
import {closeScheduler, recognize, recognizeBuffer} from 'stocktrace-ocr/lib/tesseract';
import {initScheduler, parseOCR} from 'stocktrace-ocr';
import createDebug from 'debug';

const debug = createDebug('stocktrace-web:server');

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

export default (app: Application) => {
  app.use('/api/v1/stocks', router);
}

router.post('/upload',
  upload.single('img'),
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.file);

    (async () => {
      await initScheduler();
      debug('Initializing scheduler');

      try {
        const res = await recognizeBuffer(req.file.buffer);
        const stockHistory = await parseOCR(res.data.text);
        console.log(stockHistory);
      } catch (e) {
        console.error(e);
      } finally {
        await closeScheduler();
        debug('Close scheduler');
      }
    })();

    return res.status(200).end();
  }
);