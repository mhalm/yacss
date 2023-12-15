<script lang="ts">
	import { WebSocketServer } from 'ws';

	export let receivedMessages: string[] = [];

	function onMount() {
		const wss = new WebSocketServer({ port: 8080 });

		wss.on('connection', function connection(ws) {
			ws.on('error', console.error);

			ws.on('message', function message(data, isBinary) {
				console.log('received: %s', data);
				if (!isBinary) {
					let msg = data.toString();
					receivedMessages.push(msg);
					ws.send('Echo ' + msg);
				}
			});
		});
	}
</script>

<h2>Websocket Server</h2>

<ul>
	{#each receivedMessages as msg}
		<li>{msg}</li>
	{/each}
</ul>
