<script lang="ts">
	import OcppBaseClient from '../OcppBaseClient.svelte';
	import Websocket from '../Websocket.svelte';

	var websocket: Websocket;

	var ocppBase: OcppBaseClient;

	let send = (x: string) => websocket.send(x);

	//  onMount(async () => {
	// 	// setInterval(() =>  ocppBase.request("foo", {}), 1000);
	// });
</script>

<h1>Welcome to Yacss</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<button on:click={(e) => ocppBase.request('StatusNotification', { status: 'Available' })}
	>Send an Ocpp request</button
>

<!-- How can we inject the dependency to the websocket sending function into the component? This solution here seems kinda ugly. -->
<OcppBaseClient bind:this={ocppBase} bind:websocketSender={send}></OcppBaseClient>
<Websocket bind:this={websocket} />
