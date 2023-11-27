// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production

import type { PageLoad } from './$types';
import axios from 'axios';

export const load: PageLoad = async () => {
  try {
    const { data } = await axios.get(`https://manga-server.vercel.app/meta/anilist-manga/${encodeURIComponent("Chainsaw Man")}`);
    return {
      data: data.results
    };
  } catch (err) {
    return {
      data: []
    };
  }
};
