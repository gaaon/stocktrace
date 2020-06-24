import createDebug from 'debug';

const debug = createDebug('stocktrace-web:ocr');

export class StockHistory {
  private _createdAt: string = '';

  public constructor(
    private _accounts: Account[],
    private _principal: number,
    private _ocrText: string) {
    if (isNaN(_principal)) {
      throw new Error('principal is not number');
    }
  }

  get accounts(): Account[] {
    return this._accounts;
  }

  set createdAt(createdAt: string) {
    if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(createdAt)) {
      this._createdAt = createdAt.replace(/-/g, '. ');
    } else {
      throw new Error(`invalid createdAt pattern ${createdAt}`);
    }
  }

  get createdAt(): string {
    return this._createdAt;
  }

  get ocrText(): string {
    return this._ocrText;
  }

  public total(): number {
    return this._accounts.reduce((acc: number, cur: Account) => {
      return acc + cur.total;
    }, 0);
  }

  private sumEarningAmount(): number {
    return this._accounts.reduce((acc: number, cur: Account) => {
      return acc + cur.earningAmount;
    }, 0);
  }

  public earningRateStr(): string {
    return (this.sumEarningAmount() / this._principal * 100).toFixed(2);
  }
}

export class Account {
  public constructor(
    private _id: string,
    private _total: number,
    private _earningAmount: number,
    private _earningRate: number) { }

  get total(): number {
    return this._total;
  }

  get earningAmount(): number {
    return this._earningAmount;
  }

  public earningRateStr(): string {
    return this._earningRate.toFixed(2);
  }
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

const principalPattern = /[가-힣 ]+([0-9,]+)/;
const parsePrincipal = (line: string): number => {
  const matched = principalPattern.exec(line);
  if (!matched) {
    throw new Error(`wrong principal format: ${line}`);
  }

  return parseInt(matched[1].replace(/,/g, ''), 10);
}

export const parseOCR = async (ocrText: string): Promise<StockHistory> => {
  debug(ocrText);

  const lines = ocrText.split('\n');

  let accountIdx = 0;
  const accounts: Account[] = [];
  let principal = 0;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === '총자산') {
      ++i;
      principal = parsePrincipal(lines[++i]);
      continue;
    }

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

  return new StockHistory(accounts, principal, ocrText);
};

