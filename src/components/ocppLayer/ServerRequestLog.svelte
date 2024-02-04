<script lang="ts">
	import { OcppBaseClient, OcppServerRequest } from '$lib/OcppBaseClient';
	import {
		Label,
		Table,
		TableBody,
		TableHead,
		TableHeadCell,
	} from 'flowbite-svelte';
	import RequestRow from './RequestRow.svelte';

	export let ocppBaseClient: OcppBaseClient;

	let serverReqs = ocppBaseClient.serverReqStore;

	let openRow: number | undefined = undefined;
</script>

<div>
	<Label for="serverReqTable">Server requests:</Label>
	<div id="serverReqTable" class="overflow-y-auto">
		<Table>
			<TableHead>
				<TableHeadCell>ActionId</TableHeadCell>
				<TableHeadCell>Payload</TableHeadCell>
				<TableHeadCell>Response</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each $serverReqs as req, i}
					<RequestRow
						{req}
						{ocppBaseClient}
						opened={openRow === i}
						on:open={(e) => {
							console.log(i);
							openRow = i;
						}}
					/>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
