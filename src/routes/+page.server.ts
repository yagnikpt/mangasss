import type { Actions, PageServerLoad } from './$types';
import axios from 'axios';

export const load: PageServerLoad = async (event) => {
	// const { data } = await axios.get(
	// 	`https://api.anify.tv/search`
	// 	, {
	// 		params: {
	// 			type: "manga",
	// 			query: "blue lock",
	// 			perPage: "5"
	// 		}
	// 	});
	// console.log(data.results[0].mappings);

	return {
		user: event.locals.user
	};
};

export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		try {
			const { data } = await axios.get(
				`https://manga-server.vercel.app/meta/anilist-manga/${encodeURIComponent(
					form.get('search')!.toString()
				)}`
			);
			return {
				data: data.results
			};
		} catch (err) {
			return {
				data: []
			};
		}
	}
} satisfies Actions;
