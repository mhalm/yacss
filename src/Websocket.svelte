<script lang="ts">
	import {
		receivedMessage as createReceivedMessage,
		MessageType,
		sentMessage,
		WebsocketEvent
	} from '$lib/websocketMessage';
	import { createEventDispatcher } from 'svelte';
	import WebsocketEventLog from './WebsocketEventLog.svelte';
	import MessageTable from './WebsocketEventLog.svelte';

	export let connected = false;

	const dispatcher = createEventDispatcher();

	var ws: WebSocket;

	let messages: WebsocketEvent[] = [];

	let url: string = 'wss://socketsbay.com/wss/v2/1/demo/';

	let payloadToSend: string;

	$: canSend = payloadToSend != '' && payloadToSend != null && connected;

	let msgFromServer: string;

	function toggleConnection() {
		if (!connected) {
			connect();
		} else {
			disconnect();
		}
	}

	function connect() {
		ws = new WebSocket(url);
		ws.onerror = onError;
		ws.onclose = onClose;
		ws.onopen = onOpen;
		ws.onmessage = (msg) => receive(msg.data.toString());
	}

	function receive(msg: string) {
		messages = [...messages, createReceivedMessage(msg)];
		dispatcher('received', msg);
	}

	function onOpen(ev: Event): void {
		addMsg(MessageType.CONNECTION_OPENED, '');
		connected = true;
	}

	function onError(ev: Event): void {
		addMsg(MessageType.ERROR, '');
	}

	function onClose(ev: Event): void {
		addMsg(MessageType.CONNECTION_CLOSED, '');
		connected = false;
	}

	function addMsg(type: MessageType, payload: string) {
		messages = [...messages, new WebsocketEvent(type, payload)];
	}

	function disconnect() {
		ws.close();
		connected = false;
	}

	function onSendButtonClicked() {
		if (!canSend) {
			return;
		}
		send(payloadToSend);
		payloadToSend = '';
	}

	export function send(message: string) {
		if (!connected) {
			throw Error('no connection');
		}
		ws.send(message);
		addMsg(MessageType.SENT, message);
	}
</script>

<div>
	<h2>Websocket</h2>
	Url:<input bind:value={url} disabled={connected} />
	<button on:click={toggleConnection}>
		{connected ? 'Disconnect' : 'Connect'}
	</button>

	<WebsocketEventLog bind:data={messages} />

	<div>
		<input bind:value={payloadToSend} />
		<button on:click={onSendButtonClicked} disabled={!canSend}>Send!</button>
	</div>

	<h2>Simulate server send</h2>
	<div>
		<textarea bind:value={msgFromServer} />
		<button on:click={(e) => receive(msgFromServer)}>Simulate send from Server</button>
	</div>
</div>
