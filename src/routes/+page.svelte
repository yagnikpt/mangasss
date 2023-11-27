<script lang="ts">
	import Input from '$/lib/components/ui/input/input.svelte';
	import { Github } from 'lucide-svelte';
	import type { ActionData } from './$types';

	// export let data: PageData;
	export let form: ActionData;
	let show = false;

	function keydown(event: KeyboardEvent) {
		if (event.metaKey) return;

		if (event.key === 'Enter')
			document
				.querySelector(`#search-form`)
				?.dispatchEvent(new SubmitEvent('submit', { cancelable: true }));
	}
</script>

<!-- <svelte:window on:keydown={keydown} /> -->

<svelte:head>
	<title>Mangasss</title>
	<meta name="description" content="Here you'll find whatever fuckin manga you wanna read (maybe)." />
</svelte:head>

<div class="flex flex-col items-center gap-8 max-w-lg w-full mx-auto px-8">
	<h1 class="text-5xl lg:text-6xl font-medium mt-40">Mangasss</h1>
	<p class="text-center">Here you'll find whatever fuckin manga you wanna read (maybe).</p>

	<form id="search-form" class="w-full" method="post">
		<Input
			on:keydown={keydown}
			name="search"
			placeholder="Type a manga to search..."
			type="search"
		/>
	</form>

	{#if form}
		<div class="space-y-4 w-full">
			{#each form.data as item}
				<a
					href={item.id}
					class="flex gap-8 hover:bg-neutral-800 rounded-md transition items-center justify-start w-full"
				>
					<img
						class="w-20 object-cover aspect-[10/16] rounded-md"
						src={item.image}
						alt={item.title.english ? item.title.english : item.title.romaji}
					/>
					<p class="text-xl font-semibold">
						{item.title.english ? item.title.english : item.title.romaji}
					</p>
				</a>
			{/each}
		</div>
	{/if}

	{#if !form}
		<div class="fixed bottom-10">
			<div class="flex gap-2 items-center">
				<span class="text-sm">Made by</span>
				<a class="underline underline-offset-2" target="_blank" href="https://x.com/yagnik_pt"
					>@Yagnik</a
				>
				<div class="h-5 border border-neutral-400"></div>

				<a aria-label="Github" target="_blank" href="https://github.com/yagnik-patel-47">
					<Github class="w-5 h-5" />
				</a>
			</div>
		</div>
	{/if}
</div>
