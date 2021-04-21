export = RizeMessageQueueClient;
/**
 * The RizeMessageQueueClient class
 */
declare class RizeMessageQueueClient extends Stomp.Channel {
    /**
     * @hideconstructor
     * @param {Stomp.ConnectFailover} connectFailover
     */
    constructor(connectFailover: Stomp.ConnectFailover, options: any);
    /** @ignore @protected */
    protected _connectFailover: Stomp.ConnectFailover;
    /** @ignore @protected */
    protected _username: any;
    /** @ignore @protected */
    protected _environment: any;
    /** @ignore @protected */
    protected _validateSubscribeParams(topicSubject: any, subscriptionName: any, messageListener: any, ackHeader: any): void;
    /**
     * Creates a durable Rize Message Queue topic subscription
     * @param {'customer' | 'debit_card' | 'synthetic_account' | 'synthetic_account' | 'transfer' | 'transaction'} topicSubject The subject of the Topic to subscribe to
     * @param {string} subscriptionName Assign a name for the subscription
     * @param {(err: Error, msg: Stomp.Client.Message) => void} messageListener The event message listener
     * @param {'client' | 'client-individual' | 'auto'} [ackHeader]
     * (Default=`'client'`)
     *
     * When the ack mode is `'client'`, then the client MUST use the `msg.ack` to send the server ACK frames for the messages it processes.
     * If the connection fails before a client sends an ACK frame for the message, the server will assume the message has not been processed
     * and MAY redeliver the message to another client. The ACK frames sent by the client will be treated as a cumulative acknowledgment.
     * This means the acknowledgment operates on the message specified in the ACK frame and all messages sent to the subscription before
     * the ACK'ed message.
     *
     * In case the client did not process some messages, it SHOULD use `msg.nack()` to send NACK frames to tell the server it did not consume
     * these messages.
     *
     * When the ack mode is `'client-individual'`, the acknowledgment operates just like the client acknowledgment mode except that the
     * ACK or NACK frames sent by the client are not cumulative. This means that an ACK or NACK frame for a subsequent message MUST NOT cause a
     * previous message to get acknowledged.
     *
     * When the ack mode is `'auto'`, then the client does not need to send the server ACK frames for the messages it receives. The server will
     * assume the client has received the message as soon as it sends it to the client. This acknowledgment mode can cause messages being
     * transmitted to the client to get dropped.
     */
    subscribeToRizeTopic(topicSubject: 'customer' | 'debit_card' | 'synthetic_account' | 'synthetic_account' | 'transfer' | 'transaction', subscriptionName: string, messageListener: (err: Error, msg: Stomp.Client.Message) => void, ackHeader?: 'client' | 'client-individual' | 'auto'): Stomp.Channel.ChannelSubscription;
}
import Stomp = require("stompit");
