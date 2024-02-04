<script lang="ts">
	import { OcppBaseClient, OcppServerRequest } from '$lib/OcppBaseClient';
	import MessageComposer from './MessageComposer.svelte';
	import ServerRequestLog from './ServerRequestLog.svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Badge,
		AccordionItem
	} from 'flowbite-svelte';

	export let ocppBaseClient: OcppBaseClient;

	const clientReqs = ocppBaseClient?.clientReqStore;
</script>

<AccordionItem>
	<div slot="header">OCPP</div>
	<div class="p-8 mx-auto">
		<div class="grid grid-cols-2 gap-4">
			<div class="flex flex-col gap-3">
				<div>
					<h3>Client requests:</h3>
				</div>
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
				<div class="h-32">
					<MessageComposer
						on:send={(e) => ocppBaseClient.request('StatusNotification', e.detail)}
					/>
				</div>
			</div>
			<ServerRequestLog {ocppBaseClient} />
		</div>
	</div>
</AccordionItem>
