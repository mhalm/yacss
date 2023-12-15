<script lang="ts">
	import { receivedMessage as createReceivedMessage, sentMessage as createSentMessage, MessageType, WebsocketMessage } from "$lib/websocketMessage";

	export let connected = false;

	var ws: WebSocket;

	let messages: WebsocketMessage[] = [];

    let payloadToSend: string;

	function toggleConnection() {
		if (!connected) {
			connect();
		} else {
            disconnect();
        }
	}

	function connect() {
		ws = new WebSocket('wss://socketsbay.com/wss/v2/1/demo/');
	    ws.onerror = appendErrorMessage;
        ws.onclose = onClose;
        ws.onopen = onOpen;
		ws.onmessage = function message(msg) {
            messages = [...messages, createReceivedMessage(msg.data.toString())];
		};
	}

    function onOpen(ev: Event): void {
        addMsg(MessageType.CONNECTION_OPENED, ev.toString());
        connected = true;
    }



    function appendErrorMessage(ev: Event): void {
        addMsg(MessageType.ERROR, ev.toString());
    }

    function onClose(ev: Event): void {
        addMsg(MessageType.CONNECTION_CLOSED, ev.toString());
        connected = false;
    }

    function addMsg(type: MessageType, payload: string) {
        messages = [...messages, new WebsocketMessage(type, payload)];
    }


	function disconnect() {
        ws.close()
        connected = false
    }

	function sendData() {
        if (!connected) {
            return;
        }
		ws.send(payloadToSend);
        addMsg(MessageType.SENT, payloadToSend);
	}

</script>

<div>
	<h2>Websocket</h2>
	<button on:click={toggleConnection}>
		{connected ? 'Disconnect' : 'Connect'}
	</button>


    <div>
        <input bind:value={payloadToSend} />
        <button on:click={sendData} disabled={payloadToSend == null || !connected}>Send </button>
    </div>
	

    <!-- TODO: move message log to own component -->

    Received:
    <ul>
        {#each messages as msg}
            <li>{msg.type.toString()} {msg.payload}</li>
        {/each}
    </ul>
</div>
