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
     * @param {string} hosts Assign the connection host(s). Comma delimited string.
     * @param {string} clientId Assign a client ID
     * @param {string} topic Your Rize Message Queue base topic
     * @param {string} username Your Rize Message Queue username
     * @param {string} password Your Rize Message Queue password
     * @param {RizeMessageQueueConnectOptions} [options]
     * @returns {RizeMessageQueueClient} A RizeMessageQueueClient instance
     */
    connect(hosts, clientId, topic, username, password, options) {
        const opts = options || {};

        const environment = opts.environment || this._environment;

        const parsedHosts = hosts.replace(/\s/g, '').split(',');

        const servers = parsedHosts.map(host => ({
            'host': host,
            'port': 61614,
            'connectHeaders': {
                'client-id': clientId,
                'login': username,
                'passcode': password,
                'heart-beat': '5000,5000',
            },
            'ssl': true
        }));

        const reconnectOptions = {
            maxReconnects: (!isNaN(opts.maxReconnects) && opts.maxReconnects >= 0)
                ? options.maxReconnects 
                : -1, // Unlimited reconnects
        };

        const connectFailover = new Stomp.ConnectFailover(servers, reconnectOptions);

        return new RizeMessageQueueClient(connectFailover, { topic, username, environment });
    }
}

module.exports = RizeMessageQueue;

/**
 * @typedef {Object} RizeMessageQueueConnectOptions
 * @property {'sandbox' | 'integration' | 'production'} [environment]
 * @property {number} [maxReconnects]
 */