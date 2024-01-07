<script lang="ts">
	import { OcppBaseClient, OcppClientRequest } from '$lib/OcppBaseClient';

	export let ocppBaseClient: OcppBaseClient;

	const requests = ocppBaseClient?.clientReqStore;
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

		{#each $requests as req}
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
					{:else}
						response: {JSON.stringify(req.response.payload)}
					{/if}
				</td>
			</tr>
		{/each}
	</table>
</div>
