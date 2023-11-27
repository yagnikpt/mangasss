import axios from 'axios';
import type { PageLoad } from './$types';
export const load: PageLoad = async ({ params }) => {
  const { data } = await axios.get(`https://manga-server.vercel.app/meta/anilist-manga/info/${params.manga}`, { params: { provider: "mangakakalot" } })
  return data
};