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
     * @param {string} topic Your Rize Message Queue base topic
     * @param {string} username Your Rize Message Queue username
     * @param {string} password Your Rize Message Queue password
     * @param {RizeMessageQueueConnectOptions} [options]
     * @returns {RizeMessageQueueClient} A RizeMessageQueueClient instance
     */
    connect(clientId: string, topic: string, username: string, password: string, options?: RizeMessageQueueConnectOptions): RizeMessageQueueClient;
}
declare namespace RizeMessageQueue {
    export { RizeMessageQueueConnectOptions };
}
type RizeMessageQueueConnectOptions = {
    environment?: 'sandbox' | 'integration' | 'production';
    maxReconnects?: number;
};
import RizeMessageQueueClient = require("./RizeMessageQueueClient");
