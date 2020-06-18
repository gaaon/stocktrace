import fs from 'fs';

import {parseOCR} from './stock';

describe('stock ocr parse', () => {
  it('should return stock history instance.', async () => {
    // given
    const filePath = './data/stock_ocr.txt';
    const fileRaw = await fs.promises.readFile(filePath, 'utf8');
    const expectedStockHistoryPath = './data/stock_history.json';
    const expectedStockHistory = JSON.parse(
      await fs.promises.readFile(expectedStockHistoryPath, 'utf8')
    );

    // when
    const stockHistory = await parseOCR(fileRaw);

    // then
    expect(stockHistory.accounts).toHaveLength(expectedStockHistory._accounts.length);

    for (let i = 0; i < stockHistory.accounts.length; i++) {
      const account = stockHistory.accounts[i];
      const expectedAccount = expectedStockHistory._accounts[i];

      expect(account).toEqual(expectedAccount);
    }
  });
});