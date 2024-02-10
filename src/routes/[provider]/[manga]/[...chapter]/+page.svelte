<script lang="ts">
	import { onMount } from 'svelte';
	import {
		X,
		MoveLeft,
		MoveRight,
		BookOpenText,
		GalleryVertical,
		GalleryHorizontal
	} from 'lucide-svelte';
	import type { PageData } from './$types';
	import { refers } from '$/lib';
	import * as Popover from '$lib/components/ui/popover';
	import { Input } from '$/lib/components/ui/input';
	import { cn } from '$/lib/utils';

	export let data: PageData;

	let currentPage = 1;
	let popoverOpen = false;
	let showToolbar = true;
	let timeoutId: NodeJS.Timeout;
	let mode: 'horizontal' | 'vertical' = 'horizontal';
	let isPWA = false;

	async function syncToLocal() {
		const read = {
			id: data.mangaId,
			provider: data.provider,
			chapter: data.chapter,
			chapterTitle: data.chapterTitle ?? '',
			page: currentPage
		};
		let lib = data.reads;
		const currentReadIndex = lib.findIndex((read) => read.id === data.mangaId);
		if (currentReadIndex === -1) lib.unshift(read);
		else {
			lib = lib.filter((manga) => manga.id !== data.mangaId);
			lib.unshift(read);
		}
		await fetch('/api/sync', {
			method: 'POST',
			body: JSON.stringify(lib),
			headers: {
				'content-type': 'application/json'
			}
		});
	}

	onMount(() => {
		if (window.matchMedia('(display-mode: standalone)').matches) isPWA = true;
		syncToLocal();
		mode = (localStorage.getItem('read_mode') as 'horizontal' | 'vertical') ?? 'horizontal';
		timeoutId = setTimeout(() => (showToolbar = false), 2000);
		const observer = new IntersectionObserver(
			(entries) => {
				// console.clear();
				entries.forEach((entry) => {
					if (entry.intersectionRatio > 0 && entry.isIntersecting) {
						currentPage = Number(entry.target.getAttribute('data-page'));
						const panels = document.querySelector('.panel__container');
						panels?.children[currentPage]?.children[1]?.removeAttribute('loading');
						panels?.children[currentPage + 1]?.children[1]?.removeAttribute('loading');
						syncToLocal();
					}
				});
			},
			{ threshold: 0.9 }
		);
		const pages = document.querySelectorAll('.page');
		pages.forEach((page) => {
			observer.observe(page);
		});
	});

	function handleToolbarToggle() {
		if (!showToolbar) {
			showToolbar = true;
			timeoutId = setTimeout(() => {
				if (!popoverOpen) showToolbar = false;
			}, 2000);
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
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			handlePrevPage();
		}
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			handleNextPage();
		}
	}

	function pageJump(event: KeyboardEvent & { currentTarget: HTMLInputElement }) {
		if (event.metaKey) return;
		if (event.key === 'Enter')
			document.getElementById(`page-${event.currentTarget.value}`)?.scrollIntoView();
	}
</script>

<svelte:head>
	<title>Chapter Page</title>
	<meta name="description" content={`This page shows images of a chapter.`} />
</svelte:head>

<svelte:window on:keydown={handleKeyNavigation} />

<div
	class={`max-lg:fixed max-lg:top-0 max-lg:w-full max-lg:py-2 max-lg:px-4 max-lg:justify-between bg-neutral-900 border-b border-neutral-300 flex items-center lg:justify-around lg:h-[5dvh] z-10 ${
		mode === 'vertical' ? 'fixed top-0 w-full py-2 px-4' : ''
	}`}
	class:max-lg:hidden={!showToolbar}
>
	<span>{currentPage}/{data.pages.length}</span>
	<div class="flex items-center gap-2">
		<Popover.Root onOpenChange={(state) => (popoverOpen = state)}>
			<Popover.Trigger class="p-2">
				<BookOpenText />
			</Popover.Trigger>
			<Popover.Content align="end" class="w-60 space-y-4">
				<span>Jump to a page</span>
				<Input on:keydown={pageJump} class="p-2" min={1} max={data.pages.length} type="number" />
			</Popover.Content>
		</Popover.Root>
		{#if mode === 'vertical'}
			<button
				on:click={() => {
					mode = 'horizontal';
					localStorage.setItem('read_mode', 'horizontal');
				}}
				aria-label="Read horizontal"
				class="p-2"
			>
				<GalleryHorizontal />
			</button>
		{:else}
			<button
				on:click={() => {
					mode = 'vertical';
					localStorage.setItem('read_mode', 'vertical');
				}}
				class="p-2"
				aria-label="Read verticle"
			>
				<GalleryVertical />
			</button>
		{/if}
		<a
			href={`/${data.provider}/${data.mangaId}`}
			data-sveltekit-replacestate
			aria-label="Close"
			class="p-2 block"
		>
			<X />
		</a>
	</div>
</div>
<div
	class={`flex panel__container hide-scroll ${
		mode === 'horizontal'
			? 'h-[100dvh] lg:h-[90dvh] overflow-y-hidden overflow-x-scroll parent flex-row-reverse'
			: 'flex-col overflow-x-hidden mt-20'
	}`}
	on:click={handleToolbarToggle}
	role="presentation"
>
	{#each data.pages as panel, index}
		<div
			data-page={index + 1}
			class={cn(
				'shrink-0 flex justify-center w-screen child items-center relative page',
				mode === 'horizontal' && isPWA ? 'h-screen lg:h-[90dvh]' : 'h-[100dvh] lg:h-[90dvh]'
			)}
			id={`page-${index + 1}`}
		>
			<div
				class="w-12 h-12 border-4 lg:border-[6px] border-neutral-500 rounded-full border-t-current animate-spin text-neutral-950 absolute z-[-1]"
			></div>
			<img
				class="lg:h-[90dvh] lg:w-auto w-[200vw] h-auto"
				src={`https://m3u8-proxy-cors-alpha-two.vercel.app/cors?url=${
					panel.img
				}&headers={"referer":"${
					panel.headerForImage ? panel.headerForImage.Referer : refers[data.provider]
				}"}`}
				alt={panel.page}
				loading="lazy"
				on:error={(e) => {
					// @ts-ignore
					e.currentTarget.src = `https://m3u8-proxy-cors-alpha-two.vercel.app/cors?url=${
						panel.img
					}&headers={"referer":"${
						panel.headerForImage ? panel.headerForImage.Referer : refers[data.provider]
					}"}`;
				}}
			/>
		</div>
	{/each}
	{#if data.next}
		<div
			class="shrink-0 flex flex-col gap-4 justify-center w-screen h-[100dvh] child items-center end-page"
		>
			<p class="lg:text-lg">{data.next.title}</p>
			<a
				data-sveltekit-reload
				href={`/${data.provider}/${data.mangaId}/${data.next.id}`}
				class="block py-2 px-4 lg:text-lg bg-neutral-800 rounded-md">Read next chapter</a
			>
		</div>
	{:else}
		<div
			class="shrink-0 flex flex-col gap-4 justify-center w-screen h-[100dvh] child items-center end-page"
		>
			<p>That was the latest chapter.</p>
			<a data-sveltekit-replacestate href={`/`} class="block py-2 px-4 bg-neutral-800 rounded-md"
				>Home</a
			>
		</div>
	{/if}
</div>
<div
	class="max-lg:hidden bg-neutral-900 border-t border-neutral-300 flex items-center lg:justify-around lg:h-[5dvh] z-10"
	class:lg:hidden={mode === 'vertical'}
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
