<script lang="ts">
	import { onMount } from 'svelte';
	import Websocket from '../Websocket.svelte';
	import OcppBaseMessageLog from '../OcppBaseMessageLog.svelte';
	import { OcppBaseClient } from '$lib/OcppBaseClient';

	var websocket: Websocket;

	let send: (x:string) => void = (x: string) => websocket.send(x);

	var ocppBaseClient: OcppBaseClient = new OcppBaseClient(send);

</script>

<h1>Welcome to Yacss</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<button on:click={(e) => ocppBaseClient.request('StatusNotification', { status: 'Available' })}
	>Send an Ocpp request</button
>

<!-- How can we inject the dependency to the websocket sending function into the component? This solution here seems kinda ugly. -->
<OcppBaseMessageLog bind:ocppBaseClient={ocppBaseClient}></OcppBaseMessageLog>
<Websocket bind:this={websocket} on:received={data => ocppBaseClient.onReceived(data.detail)} />
