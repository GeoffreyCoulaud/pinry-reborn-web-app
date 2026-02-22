import type { Cookies } from '@sveltejs/kit';
import { dev } from '$app/environment';

const AUTH_COOKIE_NAME = 'pinry_auth';

export function setAuthCookie(cookies: Cookies, credentials: string): void {
	cookies.set(AUTH_COOKIE_NAME, credentials, {
		path: '/',
		httpOnly: true,
		secure: !dev,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 7 // 7 days
	});
}

export function clearAuthCookie(cookies: Cookies): void {
	cookies.delete(AUTH_COOKIE_NAME, { path: '/' });
}

export function getAuthCookie(cookies: Cookies): string | undefined {
	return cookies.get(AUTH_COOKIE_NAME);
}

export function decodeUsername(credentials: string): string {
	const decoded = atob(credentials);
	return decoded.split(':')[0];
}
