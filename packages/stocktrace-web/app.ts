import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import initStockRouter from './routes/api/stocks';
import {initScheduler} from 'stocktrace-ocr';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false,
  limit: '10mb',
  parameterLimit: 1000000,
}));

app.use(cookieParser());

initStockRouter(app);

export default app;
