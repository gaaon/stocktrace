const { GoogleSpreadsheet } = require('google-spreadsheet');

let cred;
try {
  cred = require('./stocktrace-cred.json');
} catch (e) {
  cred = {};
}

exports.addStockHistoryRow = async (stockHistory) => {
  const sheetId = process.env.GOOGLE_SPREADSHEET_ID;

  // spreadsheet key is the long id in the sheets URL
  const doc = new GoogleSpreadsheet(sheetId);

// use service account creds
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || cred.client_email,
    private_key: process.env.GOOGLE_PRIVATE_KEY || cred.private_key,
  });

  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]
  const newRow = await sheet.addRow({
    '날짜': stockHistory.createdAt,
    '배당주': stockHistory.accounts[0].earningRateStr(),
    '펀드': stockHistory.accounts[1].earningRateStr(),
    '종합': stockHistory.earningRateStr(),
    '총자산': stockHistory.total() + '',
    'ocrText': stockHistory.ocrText,
  });

  const rowNumber = newRow.rowNumber;

  await sheet.loadCells(`A${rowNumber}:F${rowNumber}`)
  const cell = sheet.getCellByA1(`F${rowNumber}`);
  cell.formula = `=E${rowNumber}-E${rowNumber - 1}`;

  await sheet.saveUpdatedCells();
}
