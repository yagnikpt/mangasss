<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	// const observer = new IntersectionObserver(() => {}, {threshold: 1})
</script>

<div class="overflow-x-scroll parent flex flex-row-reverse hide-scroll">
	{#each data.data as chapter}
		<div class="shrink-0 flex justify-center w-screen h-[100dvh] child items-center relative">
			<div class="flex"></div>
			<img
				class="lg:h-[100dvh] lg:w-auto w-screen h-auto"
				src={`https://m3u8-proxy-cors-alpha-two.vercel.app/cors?url=${chapter.img}&headers={"referer":"${chapter.headerForImage.Referer}"}`}
				alt={chapter.title}
			/>
		</div>
	{/each}
	{#if data.next}
		<div class="shrink-0 flex justify-center w-screen h-[100dvh] child items-center">
			<a
				data-sveltekit-reload
				href={`/${data.next}`}
				class="block py-2 px-4 bg-neutral-900 rounded-md">Read next chapter</a
			>
		</div>
	{/if}
</div>

<style>
	.hide-scroll::-webkit-scrollbar {
		display: none;
	}
	.parent {
		scroll-snap-type: x mandatory;
		-webkit-overflow-scrolling: touch;
	}
	.child {
		scroll-snap-align: start;
		scroll-snap-stop: always;
	}
</style>
