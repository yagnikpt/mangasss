<script lang="ts">
	import { onMount } from 'svelte';
	import { X, MoveLeft, MoveRight } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import type { LibraryRead } from '$/lib';
	export let data: PageData;

	const refers: Record<string, string> = {
		mangakakalot: 'https://mangakakalot.com',
		mangadex: 'https://mangadex.org',
		mangahere: 'https://www.mangahere.cc'
	};

	let currentPage = 1;
	let showToolbar = true;
	let timeoutId: NodeJS.Timeout;

	function syncToLocal() {
		const read = {
			id: data.mangaId,
			provider: data.provider,
			chapter: data.chapter,
			page: currentPage
		};
		const lib: LibraryRead[] = JSON.parse(localStorage.getItem('reads') ?? '[]');
		const currentReadIndex = lib.findIndex((read) => read.id === data.mangaId);
		if (currentReadIndex === -1) lib.unshift(read);
		else lib[currentReadIndex] = read;
		localStorage.setItem('reads', JSON.stringify(lib));
	}

	onMount(() => {
		syncToLocal();
		timeoutId = setTimeout(() => (showToolbar = false), 2000);
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.intersectionRatio > 0 && entry.isIntersecting) {
						currentPage = Number(entry.target.getAttribute('data-page'));
						syncToLocal();
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

	function handleNextPage() {
		const pages = document.querySelectorAll('.page');
		if (currentPage === pages.length) document.querySelector('.end-page')?.scrollIntoView();
		else pages[currentPage].scrollIntoView();
	}

	function handlePrevPage() {
		const pages = document.querySelectorAll('.page');
		pages[currentPage - 2].scrollIntoView();
	}

	function handleKeyNavigation(e: KeyboardEvent) {
		if (e.key === 'ArrowRight') handlePrevPage();
		if (e.key === 'ArrowLeft') handleNextPage();
	}
</script>

<svelte:head>
	<title>Chapter Page</title>
	<meta name="description" content={`This page shows images of a chapter.`} />
</svelte:head>

<svelte:window on:keydown={handleKeyNavigation} />

<div
	class="max-lg:fixed max-lg:top-0 max-lg:w-full max-lg:py-2 max-lg:px-4 max-lg:justify-between bg-neutral-900 border-b border-neutral-300 flex items-center lg:justify-around lg:h-[5dvh] z-10"
	class:max-lg:hidden={!showToolbar}
>
	<span>{currentPage}/{data.data.length}</span>
	<button
		on:click={() => goto(`/${data.provider}/${data.mangaId}`, { replaceState: true })}
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
			<div
				class="w-12 h-12 border-4 lg:border-[6px] border-neutral-500 rounded-full border-t-current animate-spin text-neutral-950 absolute z-[-1]"
			></div>
			<img
				class="lg:h-[90dvh] lg:w-auto w-screen h-auto"
				src={`https://m3u8-proxy-cors-alpha-two.vercel.app/cors?url=${
					chapter.img
				}&headers={"referer":"${refers[data.provider]}"}`}
				alt={chapter.page}
				on:error={(e) => {
					// @ts-ignore
					e.currentTarget.src = `https://m3u8-proxy-cors-alpha-two.vercel.app/cors?url=${
						chapter.img
					}&headers={"referer":"${refers[data.provider]}"}`;
				}}
			/>
		</div>
	{/each}
	{#if data.next}
		<div
			class="shrink-0 flex flex-col gap-4 justify-center w-screen h-[100dvh] child items-center end-page"
		>
			<p>{data.next.title}</p>
			<a
				data-sveltekit-reload
				href={`/${data.provider}/${data.mangaId}/${data.next.id}`}
				class="block py-2 px-4 bg-neutral-800 rounded-md">Read next chapter</a
			>
		</div>
	{:else}
		<div
			class="shrink-0 flex flex-col gap-4 justify-center w-screen h-[100dvh] child items-center end-page"
		>
			<p>That was the latest chapter.</p>
			<a data-sveltekit-reload href={`/`} class="block py-2 px-4 bg-neutral-800 rounded-md">Home</a>
		</div>
	{/if}
</div>
<div
	class="max-lg:hidden bg-neutral-900 border-t border-neutral-300 flex items-center lg:justify-around lg:h-[5dvh] z-10"
	class:max-lg:hidden={!showToolbar}
>
	<button on:click={handleNextPage} class="p-2 flex">
		<MoveLeft class="mr-2" /> Next
	</button>
	<button
		disabled={currentPage === 1}
		on:click={handlePrevPage}
		class="p-2 flex items-center disabled:opacity-30"
	>
		Prev <MoveRight class="ml-2" />
	</button>
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
