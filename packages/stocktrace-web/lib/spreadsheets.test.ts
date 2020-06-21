import {addStockHistoryRow} from './spreadsheets';
import {Account, StockHistory} from 'stocktrace-ocr';

describe('spreadsheet api', () => {
  it('should add a row with columns.', async () => {
    // given
    const principal = 1000;
    const accounts = [
      new Account('1234', 500, -50, -10.0),
      new Account('12345', 1000, 10, 1.0),
    ];

    // when
    const stockHistory = new StockHistory(accounts, principal, -40);
    stockHistory.createdAt = '2020-06-22';

    await addStockHistoryRow(stockHistory);
  })
});