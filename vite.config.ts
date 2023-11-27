import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

export default defineConfig({
	plugins: [sveltekit(), SvelteKitPWA({
		srcDir: './src',
		scope: '/',
		base: '/',
		selfDestroying: process.env.SELF_DESTROYING_SW === 'true',
		manifest: {
			short_name: 'Mangasss',
			name: 'Mangasss',
			start_url: '/',
			scope: '/',
			display: 'standalone',
			theme_color: "#171717",
			background_color: "#0a0a0a",
			icons: [
				{
					src: '/pwa-192x192.png',
					sizes: '192x192',
					type: 'image/png',
				},
				{
					src: '/pwa-512x512.png',
					sizes: '512x512',
					type: 'image/png',
				},
				{
					src: '/pwa-512x512.png',
					sizes: '512x512',
					type: 'image/png',
					purpose: 'any maskable',
				},
			],
		},
		devOptions: {
			enabled: true,
			suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
			type: 'module',
			navigateFallback: '/',
		},
	})],
	define: {
		'process.env.NODE_ENV': process.env.NODE_ENV === 'production'
			? '"production"'
			: '"development"'
	}
});
