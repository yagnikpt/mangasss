<script lang="ts">
	import { onMount } from 'svelte';
	import { X } from 'lucide-svelte';
	import { goto, afterNavigate } from '$app/navigation';
	import { base } from '$app/paths';
	import type { PageData } from './$types';
	export let data: PageData;

	let currentPage = 1;
	let showToolbar = true;
	let timeoutId: NodeJS.Timeout;

	let previousPage: string = base;
	afterNavigate(({ from }) => {
		previousPage = from?.url.pathname || previousPage;
	});

	onMount(() => {
		timeoutId = setTimeout(() => (showToolbar = false), 2000);
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.intersectionRatio > 0 && entry.isIntersecting) {
						currentPage = Number(entry.target.getAttribute('data-page'));
					}
				});
			},
			{ threshold: 1 }
		);
		const pages = document.querySelectorAll('.page');
		pages.forEach((page) => {
			observer.observe(page);
		});
	});

	function handleToolbarToggle() {
		if (!showToolbar) {
			showToolbar = true;
			timeoutId = setTimeout(() => (showToolbar = false), 2000);
		} else {
			showToolbar = false;
			if (timeoutId) clearTimeout(timeoutId);
		}
	}
</script>

<svelte:head>
	<title>Chapter Page</title>
	<meta name="description" content={`This page shows images of a chapter.`} />
</svelte:head>

<div
	class="max-lg:fixed max-lg:top-0 max-lg:w-full max-lg:py-2 max-lg:px-4 max-lg:justify-between bg-neutral-900 border-b border-neutral-300 flex items-center lg:justify-around lg:h-[5dvh] z-10"
	class:hidden={!showToolbar}
>
	<span>{currentPage}/{data.data.length}</span>
	<button
		on:click={() => goto(previousPage, { replaceState: true })}
		aria-label="Close"
		class="p-2"
	>
		<X />
	</button>
</div>
<div
	class="overflow-x-scroll overflow-y-hidden parent flex flex-row-reverse hide-scroll h-[100dvh] lg:h-[90dvh]"
	on:click={handleToolbarToggle}
	role="presentation"
>
	{#each data.data as chapter, index}
		<div
			data-page={index + 1}
			class="shrink-0 flex justify-center w-screen h-[100dvh] lg:h-[90dvh] child items-center relative page"
		>
			<div class="flex"></div>
			<img
				class="lg:h-[90dvh] lg:w-auto w-screen h-auto"
				src={`https://m3u8-proxy-cors-alpha-two.vercel.app/cors?url=${chapter.img}&headers={"referer":"${chapter.headerForImage.Referer}"}`}
				alt={chapter.title}
			/>
		</div>
	{/each}
	{#if data.next}
		<div class="shrink-0 flex flex-col gap-4 justify-center w-screen h-[100dvh] child items-center">
			<p>{data.next.title}</p>
			<a
				data-sveltekit-reload
				href={`/${data.next.id}`}
				class="block py-2 px-4 bg-neutral-800 rounded-md">Read next chapter</a
			>
		</div>
	{:else}
		<div class="shrink-0 flex flex-col gap-4 justify-center w-screen h-[100dvh] child items-center">
			<p>That was the latest chapter.</p>
			<a data-sveltekit-reload href={`/`} class="block py-2 px-4 bg-neutral-800 rounded-md">Home</a>
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
