"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOCR = exports.Account = exports.StockHistory = void 0;
var StockHistory = /** @class */ (function () {
    function StockHistory(_accounts, _principal, _earningAmount) {
        this._accounts = _accounts;
        this._principal = _principal;
        this._earningAmount = _earningAmount;
        this._createdAt = '';
    }
    Object.defineProperty(StockHistory.prototype, "accounts", {
        get: function () {
            return this._accounts;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(StockHistory.prototype, "createdAt", {
        get: function () {
            return this._createdAt;
        },
        set: function (createdAt) {
            if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(createdAt)) {
                this._createdAt = createdAt.replace(/-/g, '. ');
            }
            else {
                throw new Error('invalid createdAt pattern');
            }
        },
        enumerable: false,
        configurable: true
    });
    StockHistory.prototype.total = function () {
        return this._accounts.reduce(function (acc, cur) {
            return acc + cur.total;
        }, 0);
    };
    StockHistory.prototype.earningRateStr = function () {
        return (this._earningAmount / this._principal * 100).toFixed(2);
    };
    return StockHistory;
}());
exports.StockHistory = StockHistory;
var Account = /** @class */ (function () {
    function Account(_id, _total, _earningAmount, _earningRate) {
        this._id = _id;
        this._total = _total;
        this._earningAmount = _earningAmount;
        this._earningRate = _earningRate;
    }
    Object.defineProperty(Account.prototype, "total", {
        get: function () {
            return this._total;
        },
        enumerable: false,
        configurable: true
    });
    Account.prototype.earningRateStr = function () {
        return this._earningRate.toFixed(2);
    };
    return Account;
}());
exports.Account = Account;
var totalLinePattern = /([0-9,]+).*[원왼]/;
var parseTotal = function (line) {
    var matched = totalLinePattern.exec(line);
    if (!matched) {
        throw new Error("wrong total line format: " + line);
    }
    return parseInt(matched[1].replace(/,/g, ''), 10);
};
var earningAmountAndRatePattern = /([0-9,+\-]+).*[원왼][^(0-9.+\-)]*([0-9.+\-]+)%/;
var parseEarningAmountAndRate = function (line) {
    var matched = earningAmountAndRatePattern.exec(line);
    if (!matched) {
        throw new Error("wrong earning amount and rate format: " + line);
    }
    return [
        parseInt(matched[1].replace(/,/g, ''), 10),
        parseFloat(matched[2]),
    ];
};
var parseAccountID = function (line) {
    var accountIDLinePattern = /^([0-9-]{8,}).+$/;
    var matched = accountIDLinePattern.exec(line);
    return matched ? matched[1] : null;
};
var principalPattern = /[가-힣 ]+([0-9,]+)/;
var parsePrincipal = function (line) {
    var matched = principalPattern.exec(line);
    if (!matched) {
        throw new Error("wrong principal format: " + line);
    }
    return parseInt(matched[1].replace(/,/g, ''), 10);
};
var totalEarningRatePattern = /[가-힣 ]+([0-9-,]+)/;
var parseTotalEarningRate = function (line) {
    var matched = totalEarningRatePattern.exec(line);
    if (!matched) {
        throw new Error("wrong total earning rate format: " + line);
    }
    return parseFloat(matched[1].replace(/,/g, ''));
};
exports.parseOCR = function (ocrText) { return __awaiter(void 0, void 0, void 0, function () {
    var lines, accountIdx, accounts, principal, totalEarningRate, i, id, total, _a, earningAmount, earningRate;
    return __generator(this, function (_b) {
        lines = ocrText.split('\n');
        accountIdx = 0;
        accounts = [];
        principal = 0;
        totalEarningRate = 0;
        for (i = 0; i < lines.length; i++) {
            if (lines[i] === '총자산') {
                ++i;
                principal = parsePrincipal(lines[++i]);
                totalEarningRate = parseTotalEarningRate(lines[++i]);
            }
            id = parseAccountID(lines[i]);
            if (id) {
                total = parseTotal(lines[++i]);
                _a = parseEarningAmountAndRate(lines[++i]), earningAmount = _a[0], earningRate = _a[1];
                accounts[accountIdx++] = new Account(id, total, earningAmount, earningRate);
            }
        }
        return [2 /*return*/, new StockHistory(accounts, principal, totalEarningRate)];
    });
}); };
