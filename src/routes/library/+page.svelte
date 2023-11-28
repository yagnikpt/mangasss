<script lang="ts">
	import type { LibraryRead } from '$/lib';
	import axios from 'axios';
	import { onMount } from 'svelte';

	let reads: LibraryRead[] = [];
	onMount(() => {
		reads = JSON.parse(localStorage.getItem('reads') ?? '[]');
	});

	function handleRemove(index: number) {
		reads.splice(index, 1);
		localStorage.setItem('reads', JSON.stringify(reads));
	}
</script>

<section class="py-20 px-8 lg:px-40">
	<h1 class="text-2xl lg:text-3xl">Continue reading where you left.</h1>
	<div class="grid grid-cols-1 lg:grid-cols-5 gap-5 mt-10">
		{#each reads as read, index}
			{#await axios.get(`https://manga-server.vercel.app/meta/anilist-manga/info/${read.id}?provider=${read.provider}`)}
				<!-- promise is pending -->
				<div class="w-full h-80 flex justify-center items-center bg-neutral-900">
					<div
						class="w-8 h-8 border-4 border-neutral-500 rounded-full border-t-current animate-spin text-neutral-900 absolute"
					></div>
				</div>
			{:then value}
				<div class="w-full flex flex-col gap-4 bg-neutral-900 p-4">
					<img
						class="object-cover aspect-[11/16] rounded"
						src={value.data.image}
						alt={value.data.title.english ? value.data.title.english : value.data.title.romaji}
					/>
					<p class="text-2xl">
						{value.data.title.english ? value.data.title.english : value.data.title.romaji}
					</p>
					<a
						href={`/${read.provider}/${read.id}/${read.chapter}`}
						class="block text-center bg-neutral-200 text-neutral-800 p-2 rounded-md"
					>
						Read
					</a>
					<button on:click={() => handleRemove(index)} class="bg-red-600 p-2 rounded-md">
						Remove
					</button>
				</div>
			{:catch error}
				<p>Something went wrong: {error.message}</p>
			{/await}
		{/each}
	</div>
</section>
