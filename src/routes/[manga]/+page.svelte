<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<section class="py-20 px-40">
	<div class="flex gap-16 items-center">
		<img class="w-60 object-cover aspect-[11/16] rounded" src={data.image} alt={data.title} />
		<div class="space-y-4">
			<h1 class="text-4xl font-semibold">
				{data.title.english ? data.title.english : data.title.romaji}
			</h1>
			<!-- <p class="text-sm">{data.altTitles.join(', ')}</p> -->
			<p class="max-w-[100ch]">{@html data.description}</p>
			<div class="flex gap-2">
				{#each data.genres as genre}
					<div class="py-1 px-3 border-2 rounded-full text-sm">{genre}</div>
				{/each}
			</div>
			<!-- <p><strong>Author(s): </strong>{data.authors.join(', ')}</p> -->
		</div>
	</div>
	<h2 class="text-3xl mt-12">Chapters</h2>
	<div class="grid grid-cols-4 gap-x-10 gap-y-4 mt-6">
		{#each data.chapters as chapter, index}
			<a href={`/${data.id}/${chapter.id}`} class="block py-3 px-4 bg-neutral-800"
				>{index + 1}. {chapter.title}</a
			>
		{/each}
	</div>
</section>
