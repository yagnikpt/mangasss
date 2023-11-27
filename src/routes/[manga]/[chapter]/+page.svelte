<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="overflow-x-scroll snap-x snap-mandator flex flex-row-reverse">
	{#each data.data as chapter}
		<div class="shrink-0 flex justify-center w-screen snap-center">
			<img class="h-[100dvh] w-auto" src={chapter.img} alt={chapter.title} />
		</div>
		<div class="bg-white w-96 h-96 flex-nowrap"></div>
	{/each}
</div>
