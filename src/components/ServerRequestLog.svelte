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
		Badge, Button
	} from 'flowbite-svelte';

	export let ocppBaseClient: OcppBaseClient;

	let serverReqs = ocppBaseClient.serverReqStore;

	let openRow;
	let response;

    function openResponse(i: int) {
        openRow = openRow == i ? undefined : i;
    }
</script>

<div>
	<h3>Server requests:</h3>
	<div class="overflow-y-auto">
		<Table>
			<TableHead>
				<TableHeadCell></TableHeadCell>
				<TableHeadCell>Sent</TableHeadCell>
				<TableHeadCell class="w-2">messageId</TableHeadCell>
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
                            <div class="justify-center">
                                {#if req.response === undefined}
								<Button class="h-4 w-3/4" on:click={() => (openResponse(i))}>
                                    {#if openRow === i}/\{:else}Respond{/if}
                                
                                </Button>
							{/if}
                                    
                            </div>
							
						</TableBodyCell>
					</TableBodyRow>
					{#if openRow === i}
						<TableBodyRow>
							<TableBodyCell colspan="5" class="p-0">
								<div class="px-6 py-2" transition:slide={{ duration: 300, axis: 'y' }}>
									<textarea class="font-mono w-full flex-1/4" {response} />
								</div>
							</TableBodyCell>
                            <TableBodyCell>
								    <Button on:click={() => console.log('responding')}>Send</Button>
                            </TableBodyCell>
						</TableBodyRow>
					{/if}
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
