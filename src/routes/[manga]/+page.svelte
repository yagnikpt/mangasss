<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.title || 'Manga Details'}</title>
	<meta name="description" content={`This page shows details of ${data.title || ''} manga.`} />
</svelte:head>
<section class="py-20 px-8 lg:px-40">
	<div class="flex gap-10 lg:gap-16 lg:items-center max-lg:flex-col">
		<img
			class="w-40 lg:w-60 object-cover aspect-[11/16] rounded"
			src={data.image}
			alt={data.title}
		/>
		<div class="space-y-4">
			<h1 class="text-3xl lg:text-4xl font-semibold">
				{data.title.english ? data.title.english : data.title.romaji}
			</h1>
			<!-- <p class="text-sm">{data.altTitles.join(', ')}</p> -->
			<p class="max-w-[100ch] max-lg:text-sm">{@html data.description}</p>
			<div class="flex gap-2 flex-wrap">
				{#each data.genres as genre}
					<div class="py-1 px-3 border-2 rounded-full text-sm">{genre}</div>
				{/each}
			</div>
			<!-- <p><strong>Author(s): </strong>{data.authors.join(', ')}</p> -->
		</div>
	</div>
	<h2 class="text-3xl mt-12">Chapters</h2>
	<div class="grid grid-cols-1 lg:grid-cols-4 gap-x-10 gap-y-4 mt-6">
		{#each data.chapters as chapter, index}
			<a href={`/${chapter.id}`} class="block py-3 px-4 bg-neutral-800"
				>{index + 1}. {chapter.title}</a
			>
		{/each}
	</div>
</section>
