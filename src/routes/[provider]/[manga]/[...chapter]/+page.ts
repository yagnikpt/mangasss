import axios from 'axios';
import type { PageLoad } from './$types';
export const load: PageLoad = async ({ params }) => {
  const { data } = await axios.get(`https://manga-server.vercel.app/meta/anilist-manga/read`, { params: { chapterId: `${params.chapter}`, provider: params.provider } })
  const { data: { chapters } } = await axios.get(`https://manga-server.vercel.app/meta/anilist-manga/info/${params.manga}`, { params: { provider: params.provider } })
  const currentChpIndex = chapters.findIndex((chapter: any) => chapter.id === `${params.chapter}`)
  console.log(chapters[currentChpIndex])
  return {
    data: data || [],
    mangaId: params.manga,
    provider: params.provider,
    chapter: params.chapter,
    chapterTitle: chapters[currentChpIndex].title,
    next: chapters[currentChpIndex + 1] ? chapters[currentChpIndex + 1] : null
  }
};