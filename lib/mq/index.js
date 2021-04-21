const Stomp = require('stompit');
const RizeMessageQueueClient = require('./RizeMessageQueueClient');

/**
 * The RizeMessageQueue class
 */
class RizeMessageQueue {
    /**
     * @hideconstructor
     * @param {{ environment?: string }} [options]
     */
    constructor(options) {
        /** @ignore @protected */
        this._environment = options ? options.environment : undefined;
    }

    /**
     * Connect to the Rize Message Queue server
     * @param {string} clientId Assign a client ID
     * @param {string} username Your Rize Message Queue username
     * @param {string} password Your Rize Message Queue password
     * @param {RizeMessageQueueConnectOptions} [options]
     * @returns {Promise<RizeMessageQueueClient>} A promise that returns a RizeMessageQueueClient when resolved
     */
    async connect(clientId, username, password, options) {
        const opts = options || {};

        const environment = opts.environment || this._environment;

        const connectOptions = {
            'host': 'b-cdfaa84a-a94d-4401-9520-931f5c2293c7-1.mq.us-east-1.amazonaws.com',
            'port': 61614,
            // 'heartbeatDelayMargin': 2500, // add wait delay for server beat interval
            // 'heartbeatOutputMargin': 500, // substract delay for client beat interval
            'connectHeaders': {
                'client-id': clientId,
                'login': username,
                'passcode': password,
                'heart-beat': '5000,5000',
            },
            'ssl': true
        };

        const reconnectOptions = {
            maxReconnects: (!isNaN(opts.maxReconnects) && opts.maxReconnects >= 0)
                ? options.maxReconnects 
                : -1, // Unlimited reconnects
        };

        const connectFailover = new Stomp.ConnectFailover([connectOptions], reconnectOptions);

        return new RizeMessageQueueClient(connectFailover, { username, environment });
    }
}

module.exports = RizeMessageQueue;

/**
 * @typedef {Object} RizeMessageQueueConnectOptions
 * @property {'sandbox' | 'integration' | 'production'} [environment]
 * @property {number} [maxReconnects]
 */