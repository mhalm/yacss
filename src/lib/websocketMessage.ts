export class WebsocketEvent {
	type: MessageType;
	payload: string;
	time: Date;

	constructor(type: MessageType, payload: string) {
		this.type = type;
		this.payload = payload;
		this.time = new Date();
	}
}

export function receivedMessage(payload: string): WebsocketEvent {
	return new WebsocketEvent(MessageType.RECEIVED, payload);
}

export function sentMessage(payload: string): WebsocketEvent {
	return new WebsocketEvent(MessageType.SENT, payload);
}

export enum MessageType {
	SENT = 'sent',
	RECEIVED = 'received',
	ERROR = 'error',
	CONNECTION_CLOSED = 'connection closed',
	CONNECTION_OPENED = 'connection opened'
}
