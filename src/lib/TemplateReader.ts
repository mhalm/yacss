import messageJSON from '../../templates/response/Messages.json';
import schemaOne from '../../schemas/SetChargingProfileResponse.json';
import { Message, MessageType, type MessageJSON } from './Message';
import { OCPPRequestGenerator } from './OCPPRequestGenerator';
export class TemplateReader {
	messageJSONs: MessageJSON[] = messageJSON;
	messages: Message[];
	messagesMap = new Map<MessageType, Message[]>();

	constructor() {
		Object.values(MessageType).forEach((element) => {
			this.messagesMap.set(element, []);
		});
		this.messages = this.messageJSONs.map((messageJSON) => new Message(messageJSON));
		this.messages.forEach((element) => {
			this.messagesMap.get(element.type)?.push(element);
		});
	}

	messagesForType(type: MessageType): Message[] {
		const result = this.messagesMap.get(type);
		if (result == null) {
			return [];
		}
		if (type === MessageType.SET_CHARGING_PROFILE_RESPONSE) {
			const generator = new OCPPRequestGenerator(schemaOne);
			const myMessage: MessageJSON = {
				name: 'from schema',
				type: 'SetChargingProfileResponse',
				content: JSON
			};
			myMessage.content = generator.generateRequest();
			result.push(new Message(myMessage));
		}
		return result;
	}
}
