<script lang="ts">
	import { OcppBaseClient } from '$lib/OcppBaseClient';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Checkbox,
		TableSearch,
		Badge
	} from 'flowbite-svelte';

	export let ocppBaseClient: OcppBaseClient;

	const requests = ocppBaseClient?.clientReqStore;
</script>

<div class="p-8 mx-auto">
	<h2>Ocpp</h2>
	<h3>Client requests:</h3>
	<div class="overflow-y-auto h-64">
		<Table>
			<TableHead>
				<TableHeadCell></TableHeadCell>
				<TableHeadCell>Sent</TableHeadCell>
				<TableHeadCell>messageId</TableHeadCell>
				<TableHeadCell>ActionId</TableHeadCell>
				<TableHeadCell>Payload</TableHeadCell>
				<TableHeadCell>Response</TableHeadCell>
			</TableHead>
			<TableBody class="divide-y">
				{#each $requests as req}
					<TableBodyRow>
						<TableBodyCell
							>{#if req.failed()}
								<Badge color="red">Failed</Badge>
							{:else if req.responded()}
								<Badge color="green">OK</Badge>
							{:else}
								<Badge color="dark">Pending</Badge>
							{/if}</TableBodyCell
						>
						<TableBodyCell>{req.timestamp.toLocaleTimeString()}</TableBodyCell>
						<TableBodyCell>{req.messageId}</TableBodyCell>
						<TableBodyCell>{req.actionId}</TableBodyCell>
						<TableBodyCell class="font-mono">{JSON.stringify(req.payload)}</TableBodyCell>
						<TableBodyCell>
							{#if req.responded()}
								{JSON.stringify(req?.response?.payload)}
							{:else if req.failed()}
								<span class="text-red-500">{req?.response?.errorMessage()}</span>
							{/if}
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
