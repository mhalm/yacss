import { readonly, writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

class OcppRequest {
	payload: object;
	timestamp: Date;
	messageId: string; //a UUID
	actionId: string; //e.g. "BootNotification"
	response?: OcppResponse;

	constructor(messageId: string, actionId: string, payload: object) {
		this.payload = payload;
		this.timestamp = new Date();
		this.messageId = messageId;
		this.actionId = actionId;
	}
}

class OcppResponse {
	payload: object | Error;
	timestamp: Date;

	constructor(payload: object | Error) {
		this.payload = payload;
		this.timestamp = new Date();
	}
}

export class OcppClientRequest extends OcppRequest {
	constructor(actionId: string, payload: object) {
		super(uuidv4(), actionId, payload);
	}
}

class OcppServerRequest extends OcppRequest {}

export class OcppBaseClient {
	private pendingClientRequests: Map<string, OcppClientRequest> = new Map();

	private requests: Writable<OcppClientRequest[]> = writable([]);

	public websocketSender: (x: string) => void = console.log;

	public clientReqStore = readonly(this.requests);

	public request(actionId: string, payload: object) {
		const req = new OcppClientRequest(actionId, payload);
		this.pendingClientRequests.set(req.messageId, req);
		try {
			this.websocketSender(JSON.stringify([2, req.messageId, req.actionId, req.payload]));
		} catch (e) {
			if (e instanceof Error) {
				req.response = new OcppResponse(e);
			}
		}
		this.requests.set([...this.pendingClientRequests.values()]);
	}

	public onReceived(data: string): void {
		if (data[1] == '2') {
			const callFrame: [number, string, string, object] = JSON.parse(data);
			const req: OcppServerRequest = new OcppServerRequest(
				callFrame[1],
				callFrame[2],
				callFrame[3]
			);
			console.log('received server request');
		} else if (data[1] == '3') {
			const callResultFrame: [number, string, object] = JSON.parse(data);
			const messageId = callResultFrame[1];
			const payload = callResultFrame[2];
			const pendingClientReq = this.pendingClientRequests.get(messageId);
			if (pendingClientReq == undefined) {
				console.log('Server sent call result without client req: ' + data);
			} else {
				pendingClientReq!.response = new OcppResponse(payload);
				this.requests.set([...this.pendingClientRequests.values()]);
			}
		} else {
			console.log('Cannot parse data: ', data);
		}
	}
}
