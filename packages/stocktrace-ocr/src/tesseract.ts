import {createScheduler, createWorker, OEM, Scheduler} from 'tesseract.js';
import Jimp from 'jimp';

const COUNT_WORKER = 1;

let scheduler: Scheduler;

export const initScheduler = async () => {
  scheduler = createScheduler();

  for (let i = 0; i < COUNT_WORKER; i++) {
    const logger = process.env.NODE_ENV === 'dev' ? console.log : () => {};

    const worker = createWorker({ logger });
    await worker.load();
    await worker.loadLanguage('kor');
    await worker.initialize('kor', OEM.LSTM_ONLY);

    scheduler.addWorker(worker);
  }

  return scheduler;
}

export const closeScheduler = async () => {
  if (scheduler) {
    return scheduler.terminate();
  }
}

export const recognizeBuffer = async(buf: Buffer) => {
  const imageBuffer = await Jimp.read(buf);
  return recognizeWithJimp(imageBuffer);
}

export const recognizeLocalFile = async (filePath: string) => {
  const localFile = await Jimp.read(filePath);
  return recognizeWithJimp(localFile);
}

export const recognizeWithJimp = async (image: Jimp) => {
  const converted = await image.greyscale().getBufferAsync(Jimp.MIME_PNG);
  return recognize(converted);
}

export const recognize = async (buffer: Buffer) => {
  return scheduler.addJob('recognize', buffer);
}