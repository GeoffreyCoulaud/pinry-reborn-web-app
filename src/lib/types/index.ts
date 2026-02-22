/**
 * Shared TypeScript interfaces live here.
 * Re-export everything from domain-specific files as the project grows.
 */

/** Example domain entity — replace with your own. */
export interface Pin {
	id: string;
	title: string;
	imageUrl: string;
	description?: string;
}

export interface UserResponse {
	id: string;
	name: string;
}
