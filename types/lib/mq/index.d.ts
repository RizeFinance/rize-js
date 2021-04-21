export = RizeMessageQueue;
/**
 * The RizeMessageQueue class
 */
declare class RizeMessageQueue {
    /**
     * @hideconstructor
     * @param {{ environment?: string }} [options]
     */
    constructor(options?: {
        environment?: string;
    });
    /** @ignore @protected */
    protected _environment: string;
    /**
     * Connect to the Rize Message Queue server
     * @param {string} clientId Assign a client ID
     * @param {string} username Your Rize Message Queue username
     * @param {string} password Your Rize Message Queue password
     * @param {RizeMessageQueueConnectOptions} [options]
     * @returns {Promise<RizeMessageQueueClient>} A promise that returns a RizeMessageQueueClient when resolved
     */
    connect(clientId: string, username: string, password: string, options?: RizeMessageQueueConnectOptions): Promise<RizeMessageQueueClient>;
}
declare namespace RizeMessageQueue {
    export { RizeMessageQueueConnectOptions };
}
type RizeMessageQueueConnectOptions = {
    environment?: 'sandbox' | 'integration' | 'production';
    maxReconnects?: number;
};
import RizeMessageQueueClient = require("./RizeMessageQueueClient");
