<script lang="ts">
	import { MessageType } from '$lib/Message';
	import { OcppBaseClient } from '$lib/OcppBaseClient';
	import { TemplateReader } from '$lib/TemplateReader';
	import { Template } from '$lib/templating';
	import MessageComposer from './MessageComposer.svelte';
	import RequestLog from './RequestLog.svelte';
	import { AccordionItem } from 'flowbite-svelte';

	export let ocppBaseClient: OcppBaseClient;

	const clientReqs = ocppBaseClient?.clientReqStore;
	let serverReqs = ocppBaseClient.getServerReqStore();

	function templates(actionId: string): Template[] {
		let messages = new TemplateReader().messagesForType(responseFor(actionId));
		return messages.map((t) => {
			return new Template(t.name, JSON.stringify(t.content));
		});
	}
	function responseFor(actionId: string): MessageType {
		if (actionId == 'SetChargingProfileRequest') {
			return MessageType.SET_CHARGING_PROFILE_RESPONSE;
		}
		// Default case
		return MessageType.SET_CHARGING_PROFILE_RESPONSE;
	}
</script>

<AccordionItem>
	<div slot="header">OCPP</div>
	<div class="p-8 mx-auto">
		<div class="grid grid-cols-2 gap-4">
			<div class="flex flex-col gap-3">
				<div>
					<h3>Client requests:</h3>
				</div>
				<RequestLog requests={$clientReqs} />
			</div>
			<div class="flex flex-col gap-3">
				<div>
					<h3>Server requests:</h3>
				</div>
				<RequestLog requests={$serverReqs}>
					<div slot="missingResponse" let:req>
						<MessageComposer
							templates={templates(req.actionId)}
							on:send={(event) => ocppBaseClient.respondTo(req.messageId, event.detail)}
						/>
					</div>
				</RequestLog>
			</div>
			<div class="h-32">
				<MessageComposer on:send={(e) => ocppBaseClient.request('StatusNotification', e.detail)} />
			</div>
		</div>
	</div>
</AccordionItem>
