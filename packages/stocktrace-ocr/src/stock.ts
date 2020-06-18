export class StockHistory {
  public constructor(private _accounts: Account[]) { }

  get accounts(): Account[] {
    return this._accounts;
  }
}

export class Account {
  public constructor(
    private _id: string,
    private _total: number,
    private _earningAmount: number,
    private _earningRate: number) { }
}

const totalLinePattern = /([0-9,]+).*[원왼]/;
const parseTotal = (line: string): number => {
  const matched = totalLinePattern.exec(line);
  if (!matched) {
    throw new Error(`wrong total line format: ${line}`);
  }

  return parseInt(matched[1].replace(/,/g, ''), 10);
};

const earningAmountAndRatePattern = /([0-9,+\-]+).*[원왼][^(0-9.+\-)]*([0-9.+\-]+)%/
const parseEarningAmountAndRate = (line: string): [number, number] => {
  const matched = earningAmountAndRatePattern.exec(line);
  if (!matched) {
    throw new Error(`wrong earning amount and rate format: ${line}`);
  }

  return [
    parseInt(matched[1].replace(/,/g, ''), 10),
    parseFloat(matched[2]),
  ];
};

const parseAccountID = (line: string): string|null => {
  const accountIDLinePattern = /^([0-9-]{8,}).+$/;

  const matched = accountIDLinePattern.exec(line);
  return matched ? matched[1] : null;
}

export const parseOCR = async (ocrText: string): Promise<StockHistory> => {
  const lines = ocrText.split('\n');

  let accountIdx = 0;
  const accounts: Account[] = [];

  for (let i = 0; i < lines.length; i++) {
    const id = parseAccountID(lines[i]);
    if (id) {
      const total = parseTotal(lines[++i]);
      const [earningAmount, earningRate] = parseEarningAmountAndRate(lines[++i]);
      accounts[accountIdx++] = new Account(
        id,
        total,
        earningAmount,
        earningRate,
      );
    }
  }

  return new StockHistory(accounts);
};

