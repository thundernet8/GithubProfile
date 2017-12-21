export default class RateLimit {
    private _limit: number;
    private _remain: number;
    private _reset: number;

    constructor(limit: number, remain: number, reset: number) {
        this._limit = limit;
        this._remain = remain;
        this._reset = reset;
    }

    public get limit() {
        return this._limit || 0;
    }

    public get remain() {
        return this._remain || 0;
    }

    public get reset() {
        return this._reset;
    }
}
