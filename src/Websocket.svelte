<script lang="ts">
	import {
		receivedMessage as createReceivedMessage,
		MessageType,
		WebsocketEvent
	} from '$lib/websocketMessage';
	import WebsocketEventLog from './WebsocketEventLog.svelte';
	import MessageTable from './WebsocketEventLog.svelte';

	export let connected = false;

	var ws: WebSocket;

	let messages: WebsocketEvent[] = [];

	let url: string = 'wss://socketsbay.com/wss/v2/1/demo/';

	let payloadToSend: string;

	$: canSend = payloadToSend != '' && payloadToSend != null && connected;

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
		ws.onmessage = function message(msg) {
			messages = [...messages, createReceivedMessage(msg.data.toString())];
		};
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

	function send(message: string) {
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
</div>
