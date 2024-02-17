<script lang="ts">
	import { OcppRequest } from '$lib/OcppBaseClient';
	import { Table, TableBody, TableHead, TableHeadCell } from 'flowbite-svelte';
	import RequestRow from './RequestRow.svelte';

	export let requests: OcppRequest[];

	let openRow: number | undefined = undefined;
</script>

<div>
	<div id="serverReqTable" class="overflow-y-auto">
		<Table>
			<TableHead>
				<TableHeadCell>ActionId</TableHeadCell>
				<TableHeadCell class="w-2/5">Payload</TableHeadCell>
				<TableHeadCell class="w-2/5">Response</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each requests as req, i}
					<RequestRow
						{req}
						opened={openRow === i}
						on:open={() => {
							console.log(i);
							openRow = i;
						}}
					>
						<div slot="missingResponse">
							<slot name="missingResponse" {req} />
						</div>
					</RequestRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
