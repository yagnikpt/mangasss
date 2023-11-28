<script lang="ts">
	import { providers } from '$/lib';
	import type { PageData } from './$types';
	export let data: PageData;
	const providersIds = providers.map((p) => p.value).filter((p) => p !== data.provider);
</script>

<svelte:head>
	<title
		>{!data.error
			? data.title.english
				? data.title.english
				: data.title.romaji
			: 'Manga Details'}</title
	>
	<meta
		name="description"
		content={`This page shows details of ${
			!data.error ? (data.title.english ? data.title.english : data.title.romaji) : ''
		} manga.`}
	/>
</svelte:head>
<section class="py-20 px-8 lg:px-40">
	{#if !data.error}
		<div class="flex gap-10 lg:gap-16 lg:items-center max-lg:flex-col">
			<img
				class="w-40 lg:w-60 object-cover aspect-[11/16] rounded"
				src={data.image}
				alt={data.title.english ? data.title.english : data.title.romaji}
			/>
			<div class="space-y-4">
				<h1 class="text-3xl lg:text-4xl font-semibold">
					{data.title.english ? data.title.english : data.title.romaji}
				</h1>
				<p class="max-w-[100ch] max-lg:text-sm">{@html data.description}</p>
				<div class="flex gap-2 flex-wrap">
					{#each data.genres as genre}
						<div class="py-1 px-3 border-2 rounded-full text-sm">{genre}</div>
					{/each}
				</div>
			</div>
		</div>
		<h2 class="text-3xl mt-12">Change provider</h2>
		<div class="flex gap-3 mt-4">
			{#each providersIds as provider}
				<a
					data-sveltekit-reload
					class="block px-4 py-2 bg-neutral-800 rounded-md"
					href={`/${provider}/${data.id}`}>{provider.charAt(0).toUpperCase() + provider.slice(1)}</a
				>
			{/each}
		</div>
		<h2 class="text-3xl mt-12">Chapters</h2>
		<div class="grid grid-cols-1 lg:grid-cols-4 gap-x-10 gap-y-4 mt-6">
			{#each data.chapters as chapter, index}
				<a
					href={`/${data.provider}/${data.id}/${chapter.id}`}
					class="block py-3 px-4 bg-neutral-800 rounded-md">{index + 1}. {chapter.title}</a
				>
			{/each}
		</div>
	{:else if data.status === 404}
		<div class="flex flex-col items-center gap-5">
			<p class="text-3xl font-medium">
				Manga not found for {data.provider.charAt(0).toUpperCase() + data.provider.slice(1)} :(
			</p>
			<p class="text-2xl">Try using different provider.</p>
			<div class="flex gap-3">
				{#each providersIds as provider}
					<a
						data-sveltekit-reload
						class="block px-4 py-2 bg-neutral-800 rounded-md"
						href={`/${provider}/${data.id}`}
						>{provider.charAt(0).toUpperCase() + provider.slice(1)}</a
					>
				{/each}
			</div>
		</div>
	{:else}
		<p class="text-3xl text-center font-medium">Server error.</p>
	{/if}
</section>
