import {Application, NextFunction, Request, Response, Router} from 'express';
import multer, { memoryStorage } from 'multer';
import {recognize, recognizeBuffer} from 'stocktrace-ocr/lib/tesseract';
import {parseOCR} from 'stocktrace-ocr';

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

    recognizeBuffer(req.file.buffer)
      .then(res => {
        return parseOCR(res.data.text);
      })
      .then(stockHistory => {
        console.log(stockHistory);
      })
      .catch(err => {
        console.error(err);
      });

    return res.status(200).end();
  }
);