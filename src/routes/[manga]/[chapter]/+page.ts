import axios from 'axios';
import type { PageLoad } from './$types';
export const load: PageLoad = async ({ params, url }) => {
  const next = url.searchParams.get("next")
  const { data } = await axios.get(`https://manga-server.vercel.app/meta/anilist-manga/read`, { params: { chapterId: `${params.manga}/${params.chapter}`, provider: "mangakakalot" } })
  const { data: { chapters } } = await axios.get(`https://manga-server.vercel.app/manga/mangakakalot/info`, { params: { id: params.manga } })
  const currentChpIndex = chapters.findIndex((chapter: any) => chapter.id === `${params.manga}/${params.chapter}`)
  return {
    data: data || [],
    next: chapters[currentChpIndex - 1] ? chapters[currentChpIndex - 1].id : null
  }
};