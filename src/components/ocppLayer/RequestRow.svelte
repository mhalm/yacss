<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { OcppBaseClient, OcppServerRequest } from '$lib/OcppBaseClient';

	import MessageComposer from './MessageComposer.svelte';
	import {
		Alert,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Badge,
		Textarea,
		Label,
		Button
	} from 'flowbite-svelte';
	import { CirclePlusOutline } from 'flowbite-svelte-icons';
	import { createEventDispatcher } from 'svelte';
	import StatusBadge from './StatusBadge.svelte';
	import Payload from './Payload.svelte';

	export let opened = false;

	export let req: OcppServerRequest;

	let dispatcher = createEventDispatcher();

	export let ocppBaseClient: OcppBaseClient;

	function sendResponse(payload: object, request: OcppServerRequest) {
		ocppBaseClient.respondTo(request.messageId, payload);
		req = req;
	}

	function toggleOpen() {
		if (opened) {
			opened = false;
		} else {
			openRow();
		}
	}

	function openRow() {
		opened = true;
		dispatcher('open');
	}
</script>

{#if opened}
	<TableBodyRow>
		<TableBodyCell colspan="3" class="">
			<div class="flex flex-col gap-2" transition:slide={{ duration: 200, axis: 'y' }}>
				<div class="flex flex-row w-full">
					<div class="basis-1/2">
						{req.actionId} <i class="font-light">({req.messageId})</i>
					</div>

					<div class="basis-1/2 flex justify-end">
						<a on:click={toggleOpen}><CirclePlusOutline class="rotate-45" /></a>
					</div>
				</div>
				<div class="flex flex-row h-48 gap-2">
					<div class="flex flex-col basis-1/2 gap-1">
						Request at {req.timestamp.toLocaleTimeString()}
						<div class="grow">
							<Payload payload={req.payload} />
						</div>
					</div>
					<div class="flex flex-col basis-1/2 h-full gap-1">
						<div class="">
							Response <StatusBadge {req} />
						</div>
						<div class="grow">
							{#if req.response !== undefined}
								<Payload payload={req.response.payload} />
							{:else}
								<MessageComposer on:send={(event) => sendResponse(event.detail, req)} />
							{/if}
						</div>
					</div>
				</div>
			</div>
		</TableBodyCell>
	</TableBodyRow>
{:else}
	<TableBodyRow on:click={toggleOpen}>
		<TableBodyCell>{req.actionId}</TableBodyCell>
		<TableBodyCell>
			<div class="font-mono truncate">
				{JSON.stringify(req.payload)}
			</div>
		</TableBodyCell>
		<TableBodyCell>
			<div class="truncate">
				<StatusBadge {req} />
				{#if req.response !== undefined}
					<span class="font-mono truncate">
						{JSON.stringify(req.response.payload)}
					</span>
				{/if}
			</div>
		</TableBodyCell>
	</TableBodyRow>
{/if}
