export = Auth;
declare class Auth {
    constructor(programUid: any, hmac: any, api: any, tokenMaxAge?: number);
    /** @ignore @protected */ protected _programUid: any;
    /** @ignore @protected */ protected _hmac: any;
    /** @ignore @protected */ protected _api: any;
    /** @ignore @protected */ protected _tokenMaxAge: number;
    getToken(): Promise<any>;
}
