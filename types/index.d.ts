declare enum RizeEnvironments {
    'sandbox',
    'integration',
    'production'
}

export class Rize {
    static Rize: typeof Rize;

    constructor(programUid: string, hmacKey: string, environment?: keyof typeof RizeEnvironments);
}

export default Rize;