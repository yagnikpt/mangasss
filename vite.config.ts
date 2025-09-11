import path from "node:path";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		sveltekit(),
		tailwindcss(),
		SvelteKitPWA({
			srcDir: "./src",
			base: "/",
			selfDestroying: process.env.SELF_DESTROYING_SW === "true",
			manifest: {
				short_name: "Mangasss",
				name: "Mangasss",
				start_url: "/",
				scope: "/",
				display: "standalone",
				theme_color: "#171717",
				background_color: "#0a0a0a",
				icons: [
					{
						src: "/web-app-manifest-192x192.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "maskable",
					},
					{
						src: "/web-app-manifest-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
			},
			workbox: {
				globPatterns: ["client/**/*.{js,css,ico,png,svg,webp,woff,woff2}"],
				globIgnores: ["server/**", "server/sw.js", "server/workbox-*.js"],
			},
			devOptions: {
				enabled: false,
				suppressWarnings: process.env.SUPPRESS_WARNING === "true",
				type: "module",
				navigateFallback: "/",
			},
			kit: {
				includeVersionFile: true,
			},
		}),
	],
	define: {
		"process.env.NODE_ENV":
			process.env.NODE_ENV === "production" ? '"production"' : '"development"',
	},
	build: {
		rollupOptions: {
			external: ["workbox-window"],
		},
	},
	resolve: {
		alias: {
			$lib: path.resolve("./src/lib"),
		},
	},
});
