<script lang="ts">
	import { OcppBaseClient } from '$lib/OcppBaseClient';
	import ServerRequestLog from './ServerRequestLog.svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Badge
	} from 'flowbite-svelte';

	export let ocppBaseClient: OcppBaseClient;

	const clientReqs = ocppBaseClient?.clientReqStore;
</script>

<div class="p-8 mx-auto">
	<h2>Ocpp</h2>
	<div class="grid grid-cols-2 gap-4">
		<div>
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
					<TableBody>
						{#each $clientReqs as req}
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
								<TableBodyCell tdClass="font-mono">{JSON.stringify(req.payload)}</TableBodyCell>
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
		<ServerRequestLog {ocppBaseClient} />
	</div>
</div>
