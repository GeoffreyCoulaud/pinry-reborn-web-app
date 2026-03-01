export interface Tag {
	name: string;
}

export interface Pin {
	id: string;
	authorId: string;
	sourceContextUrl: string;
	sourceMediaUrl: string;
	description: string;
	tags: Tag[];
	softDeletedAt: string | null;
}

export interface PinPage {
	pins: Pin[];
	pagination: { previousCursor: string | null; nextCursor: string | null };
}

export interface PinSearchResult {
	pin: Pin;
	score: number;
}

export interface TagSearchResult {
	tag: Tag;
	score: number;
}

export interface UserResponse {
	id: string;
	name: string;
}
