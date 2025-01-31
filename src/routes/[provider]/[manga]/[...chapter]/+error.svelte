<script lang="ts">
	import { page } from '$app/state';
	import { providers } from '$/lib';

	let providersIds = $derived(
		providers.map((p) => p.value).filter((p) => p !== page.error?.provider)
	);
</script>

<div class="flex flex-col items-center gap-5 mt-12">
	{#if page.error}
		<p class="text-3xl font-medium">
			Can't open manga from {page.error.provider.charAt(0).toUpperCase() +
				page.error.provider.slice(1)}
			:(
		</p>
	{/if}
	<p class="text-2xl">Try using different provider.</p>
	<div class="flex gap-3">
		{#each providersIds as provider}
			<a
				class="block px-4 py-2 bg-neutral-800 rounded-md"
				href={`/${provider}/${page.error?.mangaId}`}
				>{provider.charAt(0).toUpperCase() + provider.slice(1)}</a
			>
		{/each}
	</div>
</div>
