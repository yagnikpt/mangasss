<script lang="ts">
	import '@fontsource-variable/rubik';
	import '../app.pcss';
	import { pwaInfo } from 'virtual:pwa-info';
	import { onMount } from 'svelte';

	onMount(async () => {
		if (pwaInfo) {
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({
				immediate: true
			});
		}
	});

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
	<meta name="theme-color" content="#171717" />
	{@html webManifestLink}
</svelte:head>
<slot />
