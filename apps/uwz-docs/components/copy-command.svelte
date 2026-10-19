<script lang="ts">
	import { Button } from "@farben/ui/components/ui/button";

	let { command }: { command: string } = $props();

	let copied = $state(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(command);
			copied = true;
			setTimeout(() => (copied = false), 1500);
		} catch {
			// Clipboard access can be blocked, in which case the command stays selectable.
		}
	}
</script>

<div class="my-4 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted px-3 py-2">
	<code class="me-auto font-mono text-sm">{command}</code>
	<Button size="sm" variant="outline" onclick={copy}>
		{copied ? "Copied" : "Copy"}
	</Button>
</div>
