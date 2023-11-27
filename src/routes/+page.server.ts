import type { Actions } from './$types';
import axios from 'axios';

export const actions = {
  default: async ({ request }) => {
    const form = await request.formData()
    try {
      const { data } = await axios.get(`https://manga-server.vercel.app/meta/anilist-manga/${encodeURIComponent(form.get("search")!.toString())}`);
      return {
        data: data.results
      };
    } catch (err) {
      return {
        data: []
      };
    }
  }
} satisfies Actions;