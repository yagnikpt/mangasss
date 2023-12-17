<script lang="ts">
	import type { LibraryRead } from '$/lib';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';

	let reads: LibraryRead[] = [];
	onMount(() => {
		reads = JSON.parse(localStorage.getItem('reads') ?? '[]');
	});

	function handleRemove(index: number) {
		reads.splice(index, 1);
		localStorage.setItem('reads', JSON.stringify(reads));
		location.reload();
	}
</script>

<svelte:head>
	<title>Library</title>
	<meta name="description" content="Continue reading from where you left." />
</svelte:head>

<section class="py-20 px-6 lg:px-40">
	<h1 class="text-2xl lg:text-3xl">Continue from where you left.</h1>
	<div
		class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-10"
	>
		{#each reads as read, index}
			{#await axios.get(`https://manga-server.vercel.app/meta/anilist-manga/info/${read.id}?provider=${read.provider}`)}
				<div class="w-full flex flex-col gap-4 bg-neutral-900 p-4 rounded">
					<Skeleton class="w-full aspect-[11/16] h-auto rounded" />
					<Skeleton class="w-full h-4 lg:h-5 rounded" />
					<Skeleton class="w-full h-8 lg:h-10 rounded" />
					<Skeleton class="w-full h-8 lg:h-10 rounded" />
				</div>
			{:then value}
				<div class="w-full flex flex-col gap-4 bg-neutral-900 p-4 rounded">
					<img
						class="object-cover aspect-[11/16] rounded"
						src={value.data.image}
						alt={value.data.title.english ? value.data.title.english : value.data.title.romaji}
					/>
					<a
						href={`/${read.provider || 'mangahere'}/${read.id}`}
						class="lg:text-xl block max-lg:text-center"
					>
						{value.data.title.english ? value.data.title.english : value.data.title.romaji}
					</a>
					<a
						href={`/${read.provider}/${read.id}/${read.chapter}#page-${read.page}`}
						class="block text-center bg-neutral-200 text-neutral-800 max-lg:text-sm p-2 rounded-md line-clamp-1 whitespace-nowrap px-5 text-ellipsis font-medium mt-auto"
					>
						{read.chapterTitle}
					</a>
					<button
						on:click={() => handleRemove(index)}
						class="bg-red-600 p-2 rounded-md max-lg:text-sm"
					>
						Remove
					</button>
				</div>
			{:catch error}
				<p>Something went wrong: {error.message}</p>
			{/await}
		{:else}
			<p class="col-span-2">Nothing to show! Start reading right now.</p>
		{/each}
	</div>
</section>
