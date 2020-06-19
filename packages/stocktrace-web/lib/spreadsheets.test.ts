import {addStockHistoryRow} from './spreadsheets';
import {Account, StockHistory} from 'stocktrace-ocr';

describe('spreadsheet api', () => {
  it('should add a row with columns.', async () => {
    // given
    const accounts = [
      new Account('1234', 100, -10, -10.0),
      new Account('12345', 1000, 10, 1.0),
    ];

    // when
    await addStockHistoryRow(new StockHistory(accounts));
  })
});