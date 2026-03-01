import type { Pin } from '$lib/types';

declare global {
	namespace App {
		interface Locals {
			credentials: string; // base64 "user:pass"
			username: string;
		}

		interface PageState {
			showPinModal?: boolean;
			pin?: Pin;
		}
	}
}
export {};
