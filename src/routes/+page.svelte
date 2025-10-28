<script lang="ts">
  import { Input } from '$/lib/components/ui/input'
  import { Skeleton } from '$lib/components/ui/skeleton'
  import * as Select from '$lib/components/ui/select'
  import { onMount } from 'svelte'
  import { providers } from '$/lib'
  import { navigating, page } from '$app/state'
  import { enhance } from '$app/forms'
  import type { ActionData } from './$types'
  import LoadingSpinner from '$/lib/components/loading-spinner.svelte'

  interface Props {
    form: ActionData
  }

  let { form }: Props = $props()

  let loading = $state(false)

  function keydown(event: KeyboardEvent & { currentTarget: HTMLInputElement }) {
    if (event.metaKey) return

    if (event.key === 'Enter') {
      document
        .querySelector(`#search-form`)
        ?.dispatchEvent(new SubmitEvent('submit', { cancelable: true }))
      event.currentTarget.blur()
    }
  }

  let readprovider: string = $state('')
  onMount(() => {
    readprovider = localStorage.getItem('prefered_provider') ?? ''
  })
</script>

<svelte:head>
  <title>Mangasss</title>
  <meta
    name="description"
    content="Here you'll find whatever fuckin manga you wanna read (maybe)."
  />
</svelte:head>

{#if navigating.to?.route.id === '/[provider]/[manga]'}
  <LoadingSpinner />
{/if}
<a
  href={page.data.user ? '/library' : '/auth'}
  class="block px-4 py-2 text-sm bg-neutral-800 rounded-md absolute top-5 right-8"
>
  {page.data.user ? 'Library' : 'Login'}</a
>
<div class="flex flex-col items-center gap-8 max-w-lg w-full mx-auto px-8">
  <h1
    class="text-5xl lg:text-6xl font-medium transition-[margin]"
    class:mt-40={!form && !loading}
    class:mt-20={!!form || loading}
  >
    Mangasss
  </h1>
  <p class="text-center">
    Here you'll find whatever fuckin manga you wanna read (maybe).
  </p>

  <div class="w-full space-y-2">
    <Select.Root type="single" bind:value={readprovider}>
      <Select.Trigger aria-label="Select a provider" class="w-full">
        {readprovider !== ''
          ? providers.filter((v) => v.value === readprovider)[0].label
          : 'Select a provider'}
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          {#each providers as provider, index}
            <Select.Item
              onclick={() => {
                readprovider = provider.value
                localStorage.setItem('prefered_provider', readprovider)
              }}
              value={provider.value}
              label={provider.label}>{provider.label}</Select.Item
            >
          {/each}
        </Select.Group>
      </Select.Content>
    </Select.Root>
    <form
      use:enhance={() => {
        loading = true

        return async ({ update }) => {
          await update()
          loading = false
        }
      }}
      id="search-form"
      class="w-full flex gap-3 items-center"
      method="post"
    >
      <Input
        onkeydown={keydown}
        name="search"
        placeholder="Type a manga to search..."
        type="search"
        required
        defaultValue={form?.fieldValue ?? ''}
      />
    </form>
  </div>

  {#if loading}
    <div class="space-y-4 w-full mb-6">
      {#each Array.from({ length: 2 })}
        <div class="flex w-full pr-4 gap-8 items-center justify-start">
          <Skeleton class="w-20 aspect-10/16 rounded-md" />
          <div class="space-y-2">
            <Skeleton class="w-40 h-6 rounded-md" />
            <Skeleton class="w-20 h-4 rounded-md" />
          </div>
        </div>
      {/each}
    </div>
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
              class="w-20 aspect-10/16 object-cover rounded-md"
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

  {#if !form && !loading}
    <div class="fixed bottom-10">
      <div class="flex gap-[0.5ch] items-center">
        <span>Made by</span>
        <a
          class="underline underline-offset-2"
          target="_blank"
          href="https://github.com/yagnikpt">@yagnikpt</a
        >
      </div>
    </div>
  {/if}
</div>
