export const providers = [
  { value: 'mangadex', label: 'Mangadex (Manga + some Manhwa)' },
  { value: 'mangakakalot', label: 'Mangakakalot (Manga)' },
  { value: 'mangahere', label: 'Mangahere (Manga + Manhwa)' }
];
export interface LibraryRead {
  id: string;
  provider: string;
  chapter: string;
  chapterTitle: string;
  page: number;
}