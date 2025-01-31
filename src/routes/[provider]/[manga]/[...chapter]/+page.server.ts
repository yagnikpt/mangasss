import type { PageServerLoad } from './$types';
import { db } from '$/lib/server/db';
import axios, { AxiosError } from 'axios';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params, fetch }) => {
	async function getUserReads() {
		if (!locals.user) return [];
		const res = await db.query.user.findFirst({
			columns: {
				reads: true
			},
			where: (user, { eq }) => eq(user.id, locals.user?.id ?? '')
		});
		return res?.reads || [];
	}
	async function getPages() {
		try {
			const { data } = await axios.get(`https://manga-server.vercel.app/meta/anilist-manga/read`, {
				params: { chapterId: `${params.chapter}`, provider: params.provider }
			});
			return data || [];
		} catch (e) {
			if (e instanceof AxiosError) {
				const errorObj: any = e.toJSON();
				error(errorObj.status, {
					message: e.message,
					// provider: params.provider,
					// id: params.manga
				})
			}
			error(500, {
				message: 'Server Error'
			})
		}
	}
	async function getChapterInfo() {
		try {
			const { data: { chapters } } = await axios.get(`https://manga-server.vercel.app/meta/anilist-manga/info/${params.manga}`, {
				params: { provider: params.provider }
			});
			const currentChpIndex = chapters.findIndex(
				(chapter: any) => chapter.id === `${params.chapter}`
			);
			return { title: chapters[currentChpIndex].title, next: chapters[currentChpIndex + 1] ? chapters[currentChpIndex + 1] : null };
		} catch (e) {
			if (e instanceof AxiosError) {
				const errorObj: any = e.toJSON();
				error(errorObj.status, {
					message: e.message,
					// provider: params.provider,
					// id: params.manga
				})
			}
			error(500, {
				message: 'Server Error'
			})
		}
	}

	return {
		pages: await getPages(),
		mangaId: params.manga,
		provider: params.provider,
		chapter: params.chapter,
		chapterInfo: getChapterInfo(),
		reads: getUserReads()
	};
};
