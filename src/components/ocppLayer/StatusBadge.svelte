<script lang="ts">
	import type { OcppClientRequest, OcppServerRequest } from '$lib/OcppBaseClient';
	import { Badge } from 'flowbite-svelte';

	export let req: OcppServerRequest;
</script>

{#if req.failed()}
	<Badge color="red">Failed</Badge>
{:else if req.responded()}
	<Badge color="green">OK</Badge>
{:else}
	<Badge color="dark">Pending</Badge>
{/if}
