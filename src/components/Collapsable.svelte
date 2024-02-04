<script lang="ts">
	import { AccordionItem } from 'flowbite-svelte';
</script>

<AccordionItem>
	<div slot="header" class="flex flex-row gap-4 items-center">
		<slot name="header" />
	</div>
	<slot />
</AccordionItem>
