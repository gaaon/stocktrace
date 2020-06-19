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
    '날짜': '2020. 6. 19',
    '배당주': '-20.45',
    '펀드': '2.14',
    '종합': '-1.29',
    '총자산': '47621174',
  });

  console.log(newRow.rowNumber);
  console.log(newRow.rowIndex);

  console.log(newRow);
}
