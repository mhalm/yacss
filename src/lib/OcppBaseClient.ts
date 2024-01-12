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

	failed() {
		return this.response?.failed() ?? false;
	}

	responded() {
		return this.response?.succeeded() ?? false;
	}
}

class OcppResponse {
	payload: object | undefined;
	error: string | undefined;
	timestamp: Date;

	constructor(response: object | Error) {
		if (response instanceof Error) {
			this.error = response.message;
		} else {
			this.payload = response;
		}
		this.timestamp = new Date();
	}

	failed() {
		return this.error !== undefined;
	}

	public errorMessage() {
		return this.error;
	}

	succeeded() {
		return this.payload !== undefined;
	}
}

export class OcppClientRequest extends OcppRequest {
	constructor(actionId: string, payload: object) {
		super(uuidv4(), actionId, payload);
	}
}

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
			console.log('received server request');
		} else if (data[1] == '3') {
			const callResultFrame: [number, string, object] = JSON.parse(data);
			const messageId = callResultFrame[1];
			const payload = callResultFrame[2];
			const pendingClientReq = this.pendingClientRequests.get(messageId);
			if (pendingClientReq == undefined) {
				console.log('Server sent call result without client req: ' + data);
			} else {
				pendingClientReq.response = new OcppResponse(payload);
				this.requests.set([...this.pendingClientRequests.values()]);
			}
		} else {
			console.log('Cannot parse data: ', data);
		}
	}
}
