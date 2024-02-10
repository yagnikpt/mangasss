<script lang="ts">
	import { Input } from '$/lib/components/ui/input';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as Select from '$lib/components/ui/select';
	import { Github } from 'lucide-svelte';
	import type { ActionData } from './$types';
	import { onMount } from 'svelte';
	import { providers } from '$/lib';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';

	export let form: ActionData;

	function keydown(event: KeyboardEvent) {
		if (event.metaKey) return;

		if (event.key === 'Enter')
			document
				.querySelector(`#search-form`)
				?.dispatchEvent(new SubmitEvent('submit', { cancelable: true }));
	}

	let readprovider: string;
	onMount(() => {
		readprovider = localStorage.getItem('prefered_provider')
			? providers[Number(localStorage.getItem('prefered_provider'))].value
			: '';
	});
</script>

<!-- <svelte:window on:keydown={keydown} /> -->

<svelte:head>
	<title>Mangasss</title>
	<meta
		name="description"
		content="Here you'll find whatever fuckin manga you wanna read (maybe)."
	/>
</svelte:head>

<a
	href={$page.data.user ? '/library' : '/auth'}
	class="block px-4 py-2 text-sm bg-neutral-800 rounded-md absolute top-5 right-8"
>
	{$page.data.user ? 'Library' : 'Login'}</a
>
<div class="flex flex-col items-center gap-8 max-w-lg w-full mx-auto px-8">
	<h1 class="text-5xl lg:text-6xl font-medium" class:mt-40={!form} class:mt-20={!!form}>
		Mangasss
	</h1>
	<p class="text-center">Here you'll find whatever fuckin manga you wanna read (maybe).</p>

	<div class="w-full space-y-2">
		<Select.Root
			selected={readprovider
				? providers[Number(localStorage.getItem('prefered_provider'))]
				: undefined}
			portal={null}
		>
			<Select.Trigger aria-label="Select a provider" class="w-full">
				<Select.Value placeholder="Select a provider" />
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each providers as provider, index}
						<Select.Item
							on:click={() => {
								readprovider = provider.value;
								localStorage.setItem('prefered_provider', index.toString());
							}}
							value={provider.value}
							label={provider.label}>{provider.label}</Select.Item
						>
					{/each}
				</Select.Group>
			</Select.Content>
			<Select.Input name="favoriteFruit" />
		</Select.Root>
		<form use:enhance id="search-form" class="w-full flex gap-3 items-center" method="post">
			<Input
				on:keydown={keydown}
				name="search"
				placeholder="Type a manga to search..."
				type="search"
				required
			/>
		</form>
	</div>

	{#if form}
		<div class="space-y-4 w-full mb-6">
			{#each form.data as item}
				<a
					href={`/${readprovider || 'mangahere'}/${item.id}`}
					class="flex w-full pr-4 gap-8 hover:bg-neutral-800 rounded-md transition items-center justify-start"
				>
					<div class="relative shrink-0">
						<img
							class="w-20 aspect-[10/16] object-cover rounded-md"
							src={item.image}
							alt={item.title.english ? item.title.english : item.title.romaji}
						/>
						<Skeleton class="rounded-md absolute z-[-1] inset-0" />
					</div>
					<div class="space-y-2">
						<p class="text-lg lg:text-xl font-semibold line-clamp-3">
							{item.title.english ? item.title.english : item.title.romaji}
						</p>
						<p class="font-medium text-sm text-neutral-400">
							{item.type === 'MANGA'
								? 'MANGA / MANHWA'
								: item.type === 'ONE_SHOT'
									? 'ONE SHOT'
									: item.type}
						</p>
					</div>
				</a>
			{:else}
				<p class="text-center text-lg font-medium">No results found!</p>
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
					<Github class="size-5" />
				</a>
			</div>
		</div>
	{/if}
</div>
