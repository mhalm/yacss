<script lang="ts">
	import Websocket from '../components/websocketLayer/WebsocketLayer.svelte';
	import OcppBaseMessageLog from '../components/ocppLayer/OcppBaseMessageLog.svelte';
	import { OcppBaseClient } from '$lib/OcppBaseClient';
	import { WebsocketClient } from '$lib/WebsocketClient';
	import { Accordion } from 'flowbite-svelte';

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
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
