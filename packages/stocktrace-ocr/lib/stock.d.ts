export declare class StockHistory {
    private _accounts;
    private _principal;
    private _earningAmount;
    private _createdAt;
    constructor(_accounts: Account[], _principal: number, _earningAmount: number);
    get accounts(): Account[];
    set createdAt(createdAt: string);
    get createdAt(): string;
    total(): number;
    earningRateStr(): string;
}
export declare class Account {
    private _id;
    private _total;
    private _earningAmount;
    private _earningRate;
    constructor(_id: string, _total: number, _earningAmount: number, _earningRate: number);
    get total(): number;
    earningRateStr(): string;
}
export declare const parseOCR: (ocrText: string) => Promise<StockHistory>;
