import { fail } from '@sveltejs/kit';
import axios from 'axios';

export const load = async (event) => {
	return {
		user: event.locals.user
	};
};

export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		if (form.get('search')!.toString() === '') return fail(400)
		try {
			const { data } = await axios.get(
				`https://manga-server.vercel.app/meta/anilist-manga/${encodeURIComponent(
					form.get('search')!.toString()
				)}`
			);
			return {
				data: data.results,
				fieldValue: form.get('search')!.toString()
			};
		} catch (err) {
			return {
				data: [],
				fieldValue: form.get('search')!.toString()
			};
		}
	}
}
