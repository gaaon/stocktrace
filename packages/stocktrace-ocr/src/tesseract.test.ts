import {closeScheduler, initScheduler, recognizeLocalFile} from './tesseract';
import fs from 'fs';

describe('tesseract', () => {
  beforeEach(async () => {
    await initScheduler();
  });

  afterEach(async () => {
    await closeScheduler();
  });

  it('should recognize stock image and return ocr text.', async () => {
    // given
    const imagePath = './data/stock_img.png';

    // when
    const resp = await recognizeLocalFile(imagePath);

    // then
    expect(resp.data.text).not.toEqual('');
  }, 60000);
});