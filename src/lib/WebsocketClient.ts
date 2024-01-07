import { readonly, writable, get } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { MessageType, WebsocketEvent } from './websocketMessage';

export class WebsocketClient {
	private connected = writable(false);

	private ws: WebSocket | undefined;

	private eventLog: Writable<WebsocketEvent[]> = writable([]);

	public stores = {
		eventLog: readonly(this.eventLog),
		connected: readonly(this.connected)
	};

	public receiver: (data: string) => void = () => {};

	public toggleConnection(url: string) {
		if (!get(this.connected)) {
			this.connect(url);
		} else {
			this.disconnect();
		}
	}

	public send(message: string) {
		if (!get(this.connected)) {
			throw Error('no connection');
		}
		this.ws?.send(message);
		this.addMsg(MessageType.SENT, message);
	}

	public simulateReceive = this.receive;

	private connect(url: string) {
		console.log('connecting');
		this.ws = new WebSocket(url);
		this.ws.onerror = () => this.onError;
		this.ws.onclose = (e) => this.onClose(e);
		this.ws.onopen = (e) => this.onOpen(e);
		this.ws.onmessage = (msg) => this.receive(msg.data.toString());
	}

	private receive(msg: string) {
		this.addMsg(MessageType.RECEIVED, msg);
		this.receiver(msg);
	}

	private onOpen(): void {
		this.addMsg(MessageType.CONNECTION_OPENED, '');
		this.connected.set(true);
	}

	private onError(): void {
		this.addMsg(MessageType.ERROR, '');
	}

	private onClose(): void {
		this.addMsg(MessageType.CONNECTION_CLOSED, '');
		this.connected.set(false);
	}

	private addMsg(type: MessageType, payload: string) {
		this.eventLog.update((old) => [...old, new WebsocketEvent(type, payload)]);
	}

	private disconnect() {
		console.log('disconnecting');
		this.ws?.close();
		this.connected.set(false);
	}
}
