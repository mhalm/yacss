<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';

	class OcppRequest {
		payload: object;
		timestamp: Date;
		messageId: string; //a UUID
		actionId: string; //e.g. "BootNotification"
		response?: OcppResponse;

		constructor(messageId: string, actionId: string, payload: object) {
			this.payload = payload;
			this.timestamp = new Date();
			this.messageId = messageId;
			this.actionId = actionId;
		}
	}

	class OcppResponse {
		payload: object | Error;
		timestamp: Date;

		constructor(payload: object | Error) {
			this.payload = payload;
			this.timestamp = new Date();
		}
	}

	class OcppClientRequest extends OcppRequest {
		constructor(actionId: string, payload: object) {
			super(uuidv4(), actionId, payload);
		}
	}

	class OcppServerRequest extends OcppRequest {}

	export var websocketSender: (x: string) => void = console.log;

	var pendingClientRequests: Map<string, OcppClientRequest> = new Map();

	var requests: OcppClientRequest[] = [];

	const pendingServerRequests: OcppRequest[] = [];

	export function request(actionId: string, payload: object) {
		const req = new OcppClientRequest(actionId, payload);
		pendingClientRequests.set(req.messageId, req);
		try {
			websocketSender(JSON.stringify([2, req.messageId, req.actionId, req.payload]));
		} catch (e) {
			if (e instanceof Error) {
				req.response = new OcppResponse(e);
			}
		}
		requests = [...pendingClientRequests.values()];
	}

	function onReceived(data: string): void {
		if (data[1] == '2') {
			const callFrame: [number, string, string, object] = JSON.parse(data);
			const req: OcppServerRequest = new OcppServerRequest(
				callFrame[1],
				callFrame[2],
				callFrame[3]
			);
			pendingServerRequests.push(req);
		} else if (data[1] == '3') {
			const callResultFrame: [number, string, object] = JSON.parse(data);
			const messageId = callResultFrame[1];
			const payload = callResultFrame[2];
			const pendingClientReq = pendingClientRequests.get(messageId);
			if (pendingClientReq == undefined) {
				console.log('Server sent call result without client req: ' + data);
			} else {
				pendingClientReq!.response = new OcppResponse(payload);
				requests = [...pendingClientRequests.values()];
			}
		}
	}
	
</script>

<div>
	<h2>Ocpp</h2>
	<h3>Client requests:</h3>
	<table>
		<tr>
			<th>time</th>
			<th>messageId</th>
			<th>actionId</th>
			<th>payload</th>
			<th>response</th>
		</tr>

		{#each requests as req}
			<tr>
				<td style="font-style:italic">{req.timestamp.toLocaleTimeString()}</td>
				<td>{req.messageId}</td>
				<td>{req.actionId}</td>
				<td>{JSON.stringify(req.payload)}</td>
				<td>
					{#if req.response == undefined}
						pending
					{:else if req.response.payload instanceof Error}
						failed: {req.response.payload.message}
					{/if}
				</td>
			</tr>
		{/each}
	</table>
</div>
