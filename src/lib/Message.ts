export enum MessageType {
	SET_CHARGING_PROFILE_RESPONSE = 'SetChargingProfileResponse'
}

function newMessageTypeFrom(value: string): MessageType {
	return value as MessageType;
}

export interface MessageJSON {
	name: string;
	type: string;
	content: JSON;
}

export class Message {
	name: string;
	type: MessageType;
	content: JSON;

	constructor(message: MessageJSON) {
		this.name = message.name;
		this.type = newMessageTypeFrom(message.type);
		this.content = message.content;
	}
}
