<script lang="ts">
	import WebsocketEventLog from './WebsocketEventLog.svelte';
	import { AccordionItem, Button, Input } from 'flowbite-svelte';
	import type { WebsocketClient } from '$lib/WebsocketClient';
	import { v4 as uuidv4 } from 'uuid';
	import MessageComposer from '../ocppLayer/MessageComposer.svelte';
	import { Template } from '$lib/templating';

	export var websocketClient: WebsocketClient;

	const connected = websocketClient?.stores.connected;

	let messages = websocketClient?.stores.eventLog;

	let payloadToSend: string;

	$: canSend = payloadToSend != '' && payloadToSend != null && $connected;

	let url: string = 'wss://socketsbay.com/wss/v2/1/demo/';

	let templates = [
		new Template(
			'SetChargingProfile',
			'[2, "' +
				uuidv4() +
				'", "SetChargingProfileRequest", {"limit": 5.0, "period" : { "from" : "00:00:00", "to" : "01:00:00"}}]'
		),
		new Template(
			'RemoteStopTransactionRequest',
			'[2, "' + uuidv4() + '", "RemoteStopTransactionRequest", {"transactionId": 123}]'
		),
		new Template('Response', '[3, , {}]')
	];

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

<AccordionItem>
	<div slot="header" class="flex flex-row gap-4 items-center">
		<div>Websocket</div>
		<div
			class="w-72"
			on:click|stopPropagation
			on:keydown|stopPropagation
			role="button"
			tabindex="0"
		>
			<Input class="w-full" bind:value={url} disabled={$connected} />
		</div>
		<div on:click|stopPropagation on:keydown|stopPropagation role="button" tabindex="0">
			<Button class="sm" on:click={toggleConnection}>
				{$connected ? 'Disconnect' : 'Connect'}
			</Button>
		</div>
	</div>

	<WebsocketEventLog data={$messages} />
</AccordionItem>

<AccordionItem>
	<div slot="header">Server simulation</div>
	<div>
		<input bind:value={payloadToSend} />
		<button type="button" class="btn btn-blue" on:click={onSendButtonClicked} disabled={!canSend}
			>Send!</button
		>
	</div>

	<h2>Simulate server send</h2>
	<div>
		<MessageComposer
			{templates}
			on:send={(e) => websocketClient.simulateReceive(JSON.stringify(e.detail))}
		/>
	</div>
</AccordionItem>
