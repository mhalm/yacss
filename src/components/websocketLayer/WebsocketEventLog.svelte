<script lang="ts">
	import type { WebsocketEvent } from '$lib/websocketMessage';

	export let data: WebsocketEvent[] = [];
</script>

<div style="overflow-y:scroll; height:300px">
	<table>
		<tr
			><th>timestamp</th>
			<th>type</th>
			<th>data</th>
		</tr>
		{#each data as d}
			<tr>
				<td style="font-style:italic">{d.time.toLocaleTimeString()}</td>
				<td>{d.type}</td>
				<td>{d.payload}</td>
			</tr>
		{/each}
	</table>
</div>
