export = Auth;
declare class Auth {
    constructor(programUid: any, hmac: any, api: any, tokenMaxAge?: number);
    /** @protected */
    protected _programUid: any;
    /** @protected */
    protected _hmac: any;
    /** @protected */
    protected _api: any;
    /** @protected */
    protected _tokenMaxAge: number;
    getToken(): Promise<any>;
}
