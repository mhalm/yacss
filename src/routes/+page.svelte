<script lang="ts">
	import { onMount } from 'svelte';
	import Websocket from '../Websocket.svelte';
	import OcppBaseMessageLog from '../OcppBaseMessageLog.svelte';
	import { OcppBaseClient } from '$lib/OcppBaseClient';
	import { WebsocketClient } from '$lib/WebsocketClient';

	//create the headless ocpp classes
	var websocketClient = new WebsocketClient();
	var ocppBaseClient: OcppBaseClient = new OcppBaseClient();

	//dependency injection
	ocppBaseClient.websocketSender = (x) => websocketClient.send(x);
	websocketClient.receiver = ocppBaseClient.onReceived;
</script>

<h1>Welcome to Yacss</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<button on:click={(e) => ocppBaseClient.request('StatusNotification', { status: 'Available' })}
	>Send an Ocpp request</button
>

<OcppBaseMessageLog {ocppBaseClient}></OcppBaseMessageLog>
<Websocket {websocketClient} />
