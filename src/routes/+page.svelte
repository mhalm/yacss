<script lang="ts">
	import Websocket from '../components/websocketLayer/WebsocketLayer.svelte';
	import OcppBaseMessageLog from '../components/OcppBaseMessageLog.svelte';
	import { OcppBaseClient } from '$lib/OcppBaseClient';
	import { WebsocketClient } from '$lib/WebsocketClient';

	//create the headless ocpp classes
	var websocketClient = new WebsocketClient();
	var ocppBaseClient: OcppBaseClient = new OcppBaseClient();

	//dependency injection
	ocppBaseClient.websocketSender = (x) => websocketClient.send(x);
	websocketClient.receiver = (x) => ocppBaseClient.onReceived(x);
</script>

<h1 class="text-3xl font-bold underline">Welcome to Yacss</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<button
	class="btn btn-blue"
	on:click={() =>
		ocppBaseClient.request('StatusNotification', {
			status:
				'Available dsfäöajdsöfa jasjflasjdlfj sasaljfladsjfldsajfldsaj dsalfjaldsfj ladslfjaldsjf  adslfjldsajf  adslfj dsal faldsjfl j'
		})}>Send an Ocpp request</button
>

<OcppBaseMessageLog {ocppBaseClient}></OcppBaseMessageLog>
<Websocket {websocketClient} />

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
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
