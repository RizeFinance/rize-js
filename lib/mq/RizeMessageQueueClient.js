const validator = require('validator').default;
const _ = require('lodash');

/**
 * The RizeMessageQueueClient class
 */
class RizeMessageQueueClient {
    /**
     * @ignore
     * @param {import('stompit').Client} stompClient 
     */
    constructor(stompClient) {
        /** @ignore @protected */
        this._stompClient = stompClient;
    }

    /** @ignore @protected */
    _validateSubscribeParams(topicSubject, subscriptionName, messageListener, ackHeader) {
        const subjects = [
            'customer',
            'debit_card',
            'synthetic_account',
            'transfer',
            'transaction',
        ];

        const ackHeaders = [
            'auto',
            'client',
            'client-individual'
        ];

        if (!subjects.includes(topicSubject)) {
            throw new Error(`Invalid topicSubject. Accepted values are: ${subjects.join(' | ')}`);
        }

        if (!_.isString(subscriptionName)) {
            throw new Error('"subscriptionName" must be a string.');
        }

        if (validator.isEmpty(subscriptionName, { ignore_whitespace: true })) {
            throw new Error('"subscriptionName" is required.');
        }

        if (!messageListener) {
            throw new Error('"messageListener" is required.');
        }

        if (!_.isFunction(messageListener)) {
            throw new Error('"messageListener" must be a function.');
        }

        if (!ackHeaders.includes(ackHeader)) {
            throw new Error(`Invalid ackHeader. Accepted values are: ${ackHeaders.join(' | ')}`);
        }
    }

    /**
     * Subscribe to a Rize Message Queue topic
     * @param {'customer' | 'debit_card' | 'synthetic_account' | 'synthetic_account' | 'transfer' | 'transaction'} topicSubject The subject of the Topic to subscribe to
     * @param {string} subscriptionName Assign a name for the subscription
     * @param {(err: any, msg: any, consumptionSuccess: () => void, consumptionFailed: () => void)} messageListener The event message listener
     * @param {'client' | 'client-individual' | 'auto'} [ackHeader]
     * (Default=`'client'`)
     * 
     * When the ack mode is `'client'`, then the client MUST use the `consumptionSuccess` function that was passed to the `messageListener` 
     * to send the server ACK frames for the messages it processes. 
     * If the connection fails before a client sends an ACK frame for the message, the server will assume the message has not been processed 
     * and MAY redeliver the message to another client. The ACK frames sent by the client will be treated as a cumulative acknowledgment. 
     * This means the acknowledgment operates on the message specified in the ACK frame and all messages sent to the subscription before 
     * the ACK'ed message.
     * 
     * In case the client did not process some messages, it SHOULD use the `consumptionFailed` function that was passed to the `messageListener` 
     * to send NACK frames to tell the server it did not consume these messages.
     * 
     * When the ack mode is `'client-individual'`, the acknowledgment operates just like the client acknowledgment mode except that the 
     * ACK or NACK frames sent by the client are not cumulative. This means that an ACK or NACK frame for a subsequent message MUST NOT cause a 
     * previous message to get acknowledged.
     * 
     * When the ack mode is `'auto'`, then the client does not need to send the server ACK frames for the messages it receives. The server will 
     * assume the client has received the message as soon as it sends it to the client. This acknowledgment mode can cause messages being 
     * transmitted to the client to get dropped. 
     */
    subscribe(topicSubject, subscriptionName, messageListener, ackHeader = 'client') {
        this._validateSubscribeParams(
            topicSubject,
            subscriptionName,
            messageListener,
            ackHeader
        );

        const topic = `/topic/${this._stompClient.username}.${this._stompClient.environment}.${topicSubject}`;

        const headers = {
            destination: topic,
            ack: ackHeader || 'client',
            'activemq.subscriptionName': subscriptionName
        };

        return this._stompClient.subscribe(headers, (err, msg) => {
            const consumptionSuccess = () => {
                this._stompClient.ack(msg);
            };

            const consumptionFailed = () => {
                this._stompClient.nack(msg);
            };

            messageListener(err, msg, consumptionSuccess, consumptionFailed);
        });
    }
}

module.exports = RizeMessageQueueClient;