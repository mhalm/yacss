<script lang="ts">
	import Websocket from '../components/websocketLayer/WebsocketLayer.svelte';
	import OcppBaseMessageLog from '../components/ocppLayer/OcppBaseMessageLog.svelte';
	import { OcppBaseClient } from '$lib/OcppBaseClient';
	import { WebsocketClient } from '$lib/WebsocketClient';
	import { Accordion, Button, Heading } from 'flowbite-svelte';

	//create the headless ocpp classes
	var websocketClient = new WebsocketClient();
	var ocppBaseClient: OcppBaseClient = new OcppBaseClient();

	//dependency injection
	ocppBaseClient.websocketSender = (x) => websocketClient.send(x);
	websocketClient.receiver = (x) => ocppBaseClient.onReceived(x);
</script>

<div class="p-4">
	<Accordion class="bg-white" multiple>
		<OcppBaseMessageLog {ocppBaseClient}></OcppBaseMessageLog>
		<Websocket {websocketClient} />
	</Accordion>
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
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
