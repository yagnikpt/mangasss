<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';

	type $$Props = SelectPrimitive.Props<any>;

	interface Props {
		selected?: $$Props['selected'];
		open?: $$Props['open'];
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { selected = $bindable(undefined), open = $bindable(undefined), children, ...rest }: Props = $props();
</script>

<SelectPrimitive.Root bind:selected bind:open {...rest}>
	{@render children?.()}
</SelectPrimitive.Root>
