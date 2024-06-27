import type { PageServerLoad } from './$types';
import { db } from '$/lib/server/db';
import axios, { AxiosError } from 'axios';
import type { LibraryRead } from '$/lib';

export const load: PageServerLoad = async ({ locals, params }) => {
	try {
		let reads: LibraryRead[] = [];
		if (locals.user) {
			const res = await db.query.user.findFirst({
				columns: {
					reads: true
				},
				where: (user, { eq }) => eq(user.id, locals.user?.id ?? '')
			});
			if (res?.reads) reads = res.reads;
		}
		const { data } = await axios.get(`https://manga-server.vercel.app/meta/anilist-manga/read`, {
			params: { chapterId: `${params.chapter}`, provider: params.provider }
		});
		const {
			data: { chapters }
		} = await axios.get(`https://manga-server.vercel.app/meta/anilist-manga/info/${params.manga}`, {
			params: { provider: params.provider }
		});
		const currentChpIndex = chapters.findIndex(
			(chapter: any) => chapter.id === `${params.chapter}`
		);
		return {
			pages: data || [],
			mangaId: params.manga,
			provider: params.provider,
			chapter: params.chapter,
			chapterTitle: chapters[currentChpIndex].title,
			next: chapters[currentChpIndex + 1] ? chapters[currentChpIndex + 1] : null,
			reads
		};
	} catch (error) {
		if (error instanceof AxiosError) {
			const errorObj: any = error.toJSON();
			return {
				error: error.message,
				status: errorObj.status,
				provider: params.provider,
				id: params.manga
			};
		}
		return { error: 'Server Error', status: 500, provider: params.provider, id: params.manga };
	}
};
