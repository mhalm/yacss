<script lang="ts">
	import WebsocketEventLog from './WebsocketEventLog.svelte';
	import type { WebsocketClient } from '$lib/WebsocketClient';

	export var websocketClient: WebsocketClient;

	const connected = websocketClient?.stores.connected;

	let messages = websocketClient?.stores.eventLog;

	let payloadToSend: string;

	$: canSend = payloadToSend != '' && payloadToSend != null && $connected;

	let msgFromServer: string;

	let url: string = 'wss://socketsbay.com/wss/v2/1/demo/';

	function toggleConnection() {
		websocketClient.toggleConnection(url);
	}

	function onSendButtonClicked() {
		if (!canSend) {
			return;
		}
		websocketClient.send(payloadToSend);
		payloadToSend = '';
	}
</script>

<div>
	<h2>Websocket</h2>
	Url:<input bind:value={url} disabled={$connected} />
	<button class="btn btn-blue" on:click={toggleConnection}>
		{$connected ? 'Disconnect' : 'Connect'}
	</button>

	<WebsocketEventLog data={$messages} />

	<div>
		<input bind:value={payloadToSend} />
		<button class="btn btn-blue" on:click={onSendButtonClicked} disabled={!canSend}>Send!</button>
	</div>

	<h2>Simulate server send</h2>
	<div>
		<textarea bind:value={msgFromServer} />
		<button class="btn btn-blue" on:click={() => websocketClient.simulateReceive(msgFromServer)}
			>Simulate send from Server</button
		>
		<button
			class="btn btn-blue"
			on:click={() =>
				websocketClient.simulateReceive('[2, "msgId12345", "SetChargingProfile", {"limit": 5.0}]')}
			>Simulate Request from Server</button
		>
	</div>
</div>

<style lang="postcss">
	.btn {
		@apply font-bold py-2 px-4 rounded;
	}
	.btn-blue {
		@apply bg-blue-500 text-white;
	}
	.btn-blue:hover {
		@apply bg-blue-700;
	}
</style>
