<script lang="ts">
	import { slide } from 'svelte/transition';
	import { OcppBaseClient } from '$lib/OcppBaseClient';
	import { readable } from 'svelte/store';
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

	let serverReqs = ocppBaseClient.serverReqStore;

	let openRow;
	let response;
</script>

<div>
	<h3>Server requests:</h3>
	<div class="overflow-y-auto">
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
				{#each $serverReqs as req, i}
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
							{#if req.response === undefined}
								<button class=".btn-blue" on:click={() => (openRow = i)}>Respond</button>
							{/if}
						</TableBodyCell>
					</TableBodyRow>
					{#if openRow === i}
						<TableBodyRow>
							<TableBodyCell colspan="6" class="p-0">
								<div class="px-2 py-3" transition:slide={{ duration: 300, axis: 'y' }}>
									<textarea {response} />
									<button on:click={() => console.log('responding')}>Send</button>
								</div>
							</TableBodyCell>
						</TableBodyRow>
					{/if}
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
