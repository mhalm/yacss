<script lang="ts">
	import { Alert } from 'flowbite-svelte';
	export let payload: object | undefined;
</script>

<Alert color="dark" class="px-3 py-2 h-full font-mono ">
	{JSON.stringify(payload, null, 4)}
</Alert>
