declare global {
	namespace App {
		interface Locals {
			credentials: string; // base64 "user:pass"
			username: string;
		}
	}
}
export {};
