export class WebsocketMessage {
    type: MessageType
    payload: string

    constructor(type: MessageType, payload: string) {
        this.type = type
        this.payload = payload
    }
}

export function receivedMessage(payload: string): WebsocketMessage {
    return new WebsocketMessage(MessageType.RECEIVED, payload);
}

export function sentMessage(payload: string): WebsocketMessage {
    return new WebsocketMessage(MessageType.SENT, payload);
}

export enum MessageType {
    SENT = "sent",
    RECEIVED = "received",
    ERROR = "error",
    CONNECTION_CLOSED = "connection closed",
    CONNECTION_OPENED = "connection opened"
}