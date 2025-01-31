<div
	class="fixed inset-0 bg-black/75 backdrop-blur-xs grid place-content-center z-30 animate-in fade-in"
>
	<div class={`relative inline-block size-8`}>
		{#each Array(12) as _, i}
			<div class="absolute top-0 left-0 w-full h-full spin" style="--delay: {i * 0.1}s;">
				<div
					class="absolute top-0 left-[46%] w-[8%] h-[24%] bg-neutral-200 rounded"
					style="transform: rotate({i * 30}deg) translateY(-150%);"
				></div>
			</div>
		{/each}
	</div>
</div>

<style>
	.spin {
		animation: fade 1.2s linear var(--delay) infinite;
	}

	@keyframes fade {
		0%,
		100% {
			opacity: 0.1;
		}
		50% {
			opacity: 1;
		}
	}
</style>
