import axios, { AxiosError } from 'axios';
import type { PageLoad } from './$types';
export const load: PageLoad = async ({ params }) => {
  try {
    const { data } = await axios.get(`https://manga-server.vercel.app/meta/anilist-manga/info/${params.manga}`, { params: { provider: "mangadex" } })
    console.log(data.id)
    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorObj: any = error.toJSON()
      return { error: error.message, status: errorObj.status }
    }
    return { error: "Server Error", status: 500 }
  }
};