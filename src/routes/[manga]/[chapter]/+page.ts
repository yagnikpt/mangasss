import axios from 'axios';
import type { PageLoad } from './$types';
export const load: PageLoad = async ({ params }) => {
  const { data } = await axios.get(`https://manga-server.vercel.app/meta/anilist-manga/read`, { params: { chapterId: `${params.chapter}`, provider: "mangadex" } })
  const { data: { chapters } } = await axios.get(`https://manga-server.vercel.app/meta/anilist-manga/info/${params.manga}`, { params: { provider: "mangadex" } })
  // const currentChpIndex = chapters.findIndex((chapter: any) => chapter.id === `${params.manga}/${params.chapter}`)
  console.log(data)
  const currentChpIndex = chapters.findIndex((chapter: any) => chapter.id === `${params.chapter}`)
  return {
    data: data || [],
    mangaId: params.manga,
    // next: null
    next: chapters[currentChpIndex + 1] ? chapters[currentChpIndex + 1] : null
  }
};