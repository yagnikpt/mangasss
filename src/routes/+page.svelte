<script lang="ts">
	import { Input } from '$/lib/components/ui/input';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import {
		Select,
		SelectTrigger,
		SelectValue,
		SelectGroup,
		SelectContent,
		SelectItem
	} from '$lib/components/ui/select';
	import { onMount } from 'svelte';
	import { providers } from '$/lib';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';

	export let form;

	let loading = false;

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
		<Select
			selected={readprovider
				? providers[Number(localStorage.getItem('prefered_provider'))]
				: undefined}
			portal={null}
		>
			<SelectTrigger aria-label="Select a provider" class="w-full">
				<SelectValue placeholder="Select a provider" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{#each providers as provider, index}
						<SelectItem
							on:click={() => {
								readprovider = provider.value;
								localStorage.setItem('prefered_provider', index.toString());
							}}
							value={provider.value}
							label={provider.label}>{provider.label}</SelectItem
						>
					{/each}
				</SelectGroup>
			</SelectContent>
		</Select>
		<form
			use:enhance={() => {
				loading = true;

				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
			id="search-form"
			class="w-full flex gap-3 items-center"
			method="post"
		>
			<Input
				on:keydown={keydown}
				name="search"
				placeholder="Type a manga to search..."
				type="search"
				required
			/>
		</form>
	</div>

	{#if loading}
		<div class="flex w-full justify-center mt-20">Loading...</div>
	{/if}

	{#if form && !loading}
		<div class="space-y-4 w-full mb-6">
			{#each form.data as item}
				<a
					href={`/${readprovider || 'mangapill'}/${item.id}`}
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
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="size-5"
						><path
							d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
						></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg
					>
				</a>
			</div>
		</div>
	{/if}
</div>
