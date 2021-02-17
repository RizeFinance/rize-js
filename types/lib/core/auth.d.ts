export = Auth;
declare class Auth {
    constructor(programUid: any, hmac: any, api: any, tokenMaxAge?: number);
    /** @ignore @protected */ protected _programUid: any;
    /** @ignore @protected */ protected _hmac: any;
    /** @ignore @protected */ protected _api: any;
    /** @ignore @protected */ protected _tokenMaxAge: number;
    /**
     * Gets the Rize auth token.
     * @returns {Promise<string>} A promise that returns the Rize auth token if resolved.
     */
    getToken(): Promise<string>;
}
