import adapter from "@sveltejs/adapter-vercel";
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
			trustedOrigins: [
				"http://localhost:3000",
			],
		},
		serviceWorker: {
			register: false,
		},
	},
};

export default config;
