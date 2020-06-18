export declare class StockHistory {
    private _accounts;
    constructor(_accounts: Account[]);
    get accounts(): Account[];
}
export declare class Account {
    private _id;
    private _total;
    private _earningAmount;
    private _earningRate;
    constructor(_id: string, _total: number, _earningAmount: number, _earningRate: number);
}
export declare const parseOCR: (ocrText: string) => Promise<StockHistory>;
