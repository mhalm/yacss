<script lang="ts">
	import { OcppBaseClient, OcppServerRequest } from '$lib/OcppBaseClient';
	import MessageComposer from './MessageComposer.svelte';
	import RequestLog from './RequestLog.svelte';
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
	let serverReqs = ocppBaseClient.getServerReqStore();
</script>

<AccordionItem>
	<div slot="header">OCPP</div>
	<div class="p-8 mx-auto">
		<div class="grid grid-cols-2 gap-4">
			<div class="flex flex-col gap-3">
				<div>
					<h3>Client requests:</h3>
				</div>
				<RequestLog requests={$clientReqs} />
			</div>
			<div class="flex flex-col gap-3">
				<div>
					<h3>Server requests:</h3>
				</div>
				<RequestLog requests={$serverReqs}>
					<div slot="missingResponse" let:req>
						<MessageComposer
							on:send={(event) => ocppBaseClient.respondTo(req.messageId, event.detail)}
						/>
					</div>
				</RequestLog>
			</div>
			<div class="h-32">
				<MessageComposer on:send={(e) => ocppBaseClient.request('StatusNotification', e.detail)} />
			</div>
		</div>
	</div>
</AccordionItem>
