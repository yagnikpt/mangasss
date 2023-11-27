import axios from 'axios';
import type { PageLoad } from './$types';
export const load: PageLoad = async ({ params }) => {
  const { data } = await axios.get(`https://manga-server.vercel.app/meta/anilist-manga/read`, { params: { chapterId: `${params.chapter}`, provider: "mangadex" } })
  // console.log(data)
  return {
    data: data || []
  }
};