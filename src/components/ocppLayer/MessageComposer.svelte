<script lang="ts">
	import { Template } from '$lib/templating';
	import { Listgroup, ListgroupItem, Textarea, Alert, ToolbarButton } from 'flowbite-svelte';
	import { PapperPlaneOutline } from 'flowbite-svelte-icons';
	import { createEventDispatcher } from 'svelte';

	type TemplateItem = { template: Template; selected: boolean };

	let sendDispatcher = createEventDispatcher();

	// default
	export let templates = [
		new Template('empty', '{}'),
		new Template('Accepted', '{"status":"Accepted"}')
	];

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

<Alert color="dark" class="h-full">
	<div class=" flex flex-row gap-3 h-full">
		<Listgroup id="templateList" active class="overflow-auto w-48 h-full">
			{#each templateItems as item}
				<ListgroupItem
					class="py-1"
					on:click={() => toggleTemplate(item)}
					bind:current={item.selected}>{item.template.name}</ListgroupItem
				>
			{/each}
		</Listgroup>

		<Textarea bind:value={payloadToSend} class="font-mono h-full">
			<!-- <div slot="header" class="flex items-center justify-end">
                <Button size="sm" on:click={send}>
                    <PapperPlaneOutline class="w-5 h-5 rotate-45" />
                </Button>
            </div> -->
		</Textarea>

		<ToolbarButton type="submit" class="text-primary-600 dark:text-primary-500" on:click={send}>
			<PapperPlaneOutline class="w-5 h-5 rotate-45" />
			<span class="sr-only">Send message</span>
		</ToolbarButton>
		<!-- <div class="flex flex-col justify-end">
            <div>
                <PapperPlaneOutline class="w-5 h-5 rotate-45" />  
            </div>
        </div> -->
	</div>
</Alert>
