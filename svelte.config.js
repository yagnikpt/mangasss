import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],
	kit: {
		adapter: adapter(),
		alias: {
			$: "src",
		},
		csrf: {
			trustedOrigins: ["http://localhost:5173", "http://localhost:4173", "http://localhost:3000"],
		},
		serviceWorker: {
			register: false,
		},
	},
};

export default config;
