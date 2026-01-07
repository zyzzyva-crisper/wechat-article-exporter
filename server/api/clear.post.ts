import { setCookie } from 'h3';
import { clearMpCookies } from '~/server/kv/cookie';
import { cookieStore } from '~/server/utils/CookieStore';

export default defineEventHandler(async event => {
  cookieStore.clearAll();
  clearMpCookies();

  setCookie(event, 'auth-key', '', { maxAge: 0, path: '/' });
  setCookie(event, 'uuid', '', { maxAge: 0, path: '/' });
  setCookie(event, 'switch_account', '', { maxAge: 0, path: '/' });

  return {
    ok: true,
  };
});
