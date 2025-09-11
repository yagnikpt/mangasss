export const providers = [
	{ value: 'mangadex', label: 'Mangadex (Manga + some Manhwa)' },
	{ value: 'mangahere', label: 'Mangahere (Manga + Manhwa)' },
	{ value: 'mangapill', label: 'Mangapill (?)' }
];
export interface LibraryRead {
	id: string;
	provider: string;
	chapter: string;
	chapterTitle: string;
	page: number;
}
export const refers: Record<string, string> = {
	mangakakalot: 'https://mangakakalot.com',
	mangadex: 'https://mangadex.org',
	mangahere: 'https://www.mangahere.cc',
	mangapill: 'https://mangapill.com'
};
