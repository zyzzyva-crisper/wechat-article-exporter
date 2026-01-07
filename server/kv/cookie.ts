import { type CookieEntity } from '~/server/utils/CookieStore';

export type CookieKVKey = string;

export interface CookieKVValue {
  token: string;
  cookies: CookieEntity[];
}

const memoryStore = new Map<string, CookieKVValue>();

export async function setMpCookie(key: CookieKVKey, data: CookieKVValue): Promise<boolean> {
  memoryStore.set(key, data);
  return true;
}

export async function getMpCookie(key: CookieKVKey): Promise<CookieKVValue | null> {
  return memoryStore.get(key) || null;
}

export function clearMpCookies(): void {
  memoryStore.clear();
}
