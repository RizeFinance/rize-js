export = Auth;
declare function Auth(programUid: any, hmac: any, api: any): void;
declare class Auth {
    constructor(programUid: any, hmac: any, api: any);
    getToken: () => Promise<any>;
}
