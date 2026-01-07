import { createError, getHeader, getRequestIP } from 'h3';
import { timingSafeEqual } from 'node:crypto';

type AccessMode = 'none' | 'basic' | 'cloudflare';

function parseBasicAuth(header: string): { user: string; pass: string } | null {
  const [, encoded] = header.split(' ');
  if (!encoded) {
    return null;
  }
  const decoded = Buffer.from(encoded, 'base64').toString('utf8');
  const [user, pass] = decoded.split(':');
  if (!user || pass === undefined) {
    return null;
  }
  return { user, pass };
}

function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) {
    return false;
  }
  return timingSafeEqual(bufferA, bufferB);
}

function ipv4ToNumber(ip: string): number | null {
  const parts = ip.split('.');
  if (parts.length !== 4) {
    return null;
  }
  const nums = parts.map(part => Number(part));
  if (nums.some(num => Number.isNaN(num) || num < 0 || num > 255)) {
    return null;
  }
  return ((nums[0] << 24) >>> 0) + (nums[1] << 16) + (nums[2] << 8) + nums[3];
}

function isIpAllowed(ip: string, rule: string): boolean {
  if (!rule) {
    return false;
  }
  if (!rule.includes('/')) {
    return ip === rule;
  }
  const [range, bits] = rule.split('/');
  const maskBits = Number(bits);
  if (!range || Number.isNaN(maskBits) || maskBits < 0 || maskBits > 32) {
    return false;
  }
  const ipNum = ipv4ToNumber(ip);
  const rangeNum = ipv4ToNumber(range);
  if (ipNum === null || rangeNum === null) {
    return false;
  }
  const mask = maskBits === 0 ? 0 : (~0 << (32 - maskBits)) >>> 0;
  return (ipNum & mask) === (rangeNum & mask);
}

export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const accessConfig = config.accessControl || {};
  const mode = (accessConfig.mode || 'none') as AccessMode;
  const allowlist = (accessConfig.allowlist || '')
    .split(',')
    .map(entry => entry.trim())
    .filter(Boolean);

  if (allowlist.length > 0) {
    const ip = getRequestIP(event, { xForwardedFor: true }) || '';
    const allowed = allowlist.some(rule => isIpAllowed(ip, rule));
    if (!allowed) {
      throw createError({ statusCode: 403, statusMessage: 'Access denied' });
    }
  }

  if (mode === 'none') {
    return;
  }

  if (mode === 'cloudflare') {
    const jwt = getHeader(event, 'cf-access-jwt-assertion');
    const email = getHeader(event, 'cf-access-authenticated-user-email');
    if (!jwt && !email) {
      throw createError({ statusCode: 401, statusMessage: 'Cloudflare Access required' });
    }
    return;
  }

  const user = accessConfig.basicUser;
  const pass = accessConfig.basicPass;
  if (!user || !pass) {
    throw createError({ statusCode: 500, statusMessage: 'Basic auth is not configured' });
  }

  const authHeader = getHeader(event, 'authorization');
  if (!authHeader || !authHeader.toLowerCase().startsWith('basic ')) {
    event.node.res.setHeader('WWW-Authenticate', 'Basic realm="mptext-downloader"');
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const parsed = parseBasicAuth(authHeader);
  if (!parsed || !safeEqual(parsed.user, user) || !safeEqual(parsed.pass, pass)) {
    event.node.res.setHeader('WWW-Authenticate', 'Basic realm="mptext-downloader"');
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
});
