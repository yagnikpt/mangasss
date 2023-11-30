export const providers = [
  { value: 'mangadex', label: 'Mangadex' },
  { value: 'mangakakalot', label: 'Mangakakalot' },
  { value: 'mangahere', label: 'Mangahere' }
];
export interface LibraryRead {
  id: string;
  provider: string;
  chapter: string;
  chapterTitle: string;
  page: number;
}