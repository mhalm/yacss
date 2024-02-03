<script lang="ts">
	import { Template } from '$lib/templating';
	import { Listgroup, ListgroupItem, Textarea, Button } from 'flowbite-svelte';
	import { PapperPlaneOutline } from 'flowbite-svelte-icons';
	import { createEventDispatcher } from 'svelte';

	type TemplateItem = { template: Template; selected: boolean };

	let sendDispatcher = createEventDispatcher();

	let templates = [new Template('empty', '{}'), new Template('Accepted', '{"status":"Accepted"}')];

	let templateItems: TemplateItem[] = templates.map((t) => {
		return { template: t, selected: false };
	});

	templateItems[0].selected = true;

	let payloadToSend = templateItems[0].template.content;

	function toggleTemplate(item: TemplateItem) {
		templateItems.forEach((other) => {
			other.selected = false;
		});
		item.selected = true;
		templateItems = templateItems;
		payloadToSend = item.template.content;
	}

	function send() {
		sendDispatcher('send', JSON.parse(payloadToSend));
	}
</script>

<div class=" flex flex-row gap-3 h-48">
	<Listgroup id="templateList" active class="overflow-auto  w-48">
		{#each templateItems as item}
			<ListgroupItem on:click={() => toggleTemplate(item)} bind:current={item.selected}
				>{item.template.name}</ListgroupItem
			>
		{/each}
	</Listgroup>

	<Textarea bind:value={payloadToSend} placeholder="Your payload here" class="font-mono">
		<div slot="footer" class="flex items-center justify-end">
			<Button size="sm" on:click={send}>
				<PapperPlaneOutline class="w-5 h-5 rotate-45" />
			</Button>
		</div>
	</Textarea>
</div>
