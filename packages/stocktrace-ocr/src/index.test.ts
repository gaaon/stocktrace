import fs from 'fs';
import { recognizeBuffer, closeScheduler, initScheduler, parseOCR } from './';

describe('index', () => {
  beforeEach(async () => {
    await initScheduler();
  });

  afterEach(async () => {
    await closeScheduler();
  });

  describe('if stock image is given,', () => {
    it('should return stock history instance.', async () => {
      // given
      const stockImagePath = './data/stock_img.png';
      const expectedStockImagePath = './data/stock_history.json';

      const stockImage = await fs.promises.readFile(stockImagePath);
      const expectedStockHistory = JSON.parse(
        await fs.promises.readFile(expectedStockImagePath, 'utf8')
      )

      // when
      const stockHistoryRaw = await recognizeBuffer(stockImage);
      const stockHistory = await parseOCR(stockHistoryRaw.data.text);

      // then
      expect(stockHistory).toEqual(expectedStockHistory);
    }, 60000);
  });
});
