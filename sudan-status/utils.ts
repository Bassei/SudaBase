import crypto from 'crypto';
import * as cheerio from 'cheerio';
import { REQUEST_TIMEOUT_MS } from './config';

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function normalizeText(text: string | null | undefined): string {
  return String(text || '')
    .replace(/\u200f/g, ' ')
    .replace(/\u200e/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function sha1(...parts: Array<string | number | null | undefined>) {
  return crypto.createHash('sha1').update(parts.map((p) => String(p || '')).join('|')).digest('hex');
}

export function normalizeUrl(input: unknown, baseUrl?: string): string | null {
  if (input === null || input === undefined) return null;
  let raw = String(input).trim();
  if (!raw || ['nan', 'none', 'null', '#', 'javascript:void(0)'].includes(raw.toLowerCase())) return null;

  try {
    if (baseUrl) raw = new URL(raw, baseUrl).toString();
    if (raw.startsWith('//')) raw = `https:${raw}`;
    if (!/^https?:\/\//i.test(raw)) return null;

    const url = new URL(raw);
    url.hash = '';
    url.hostname = url.hostname.toLowerCase();
    url.protocol = url.protocol.toLowerCase();
    if (!url.pathname) url.pathname = '/';
    return url.toString();
  } catch {
    return null;
  }
}

export function normalizedForUnique(urlString: string): string {
  const url = new URL(urlString);
  const params = new URLSearchParams(url.search);
  for (const key of [...params.keys()]) {
    const lower = key.toLowerCase();
    if (lower.startsWith('utm_') || ['fbclid', 'gclid'].includes(lower)) params.delete(key);
  }
  url.search = params.toString();
  url.hash = '';
  url.hostname = url.hostname.toLowerCase().replace(/^www\./, '');
  url.pathname = url.pathname.replace(/\/$/, '') || '/';
  return url.toString();
}

export function platformFromUrl(urlString: string) {
  const host = new URL(urlString).hostname.toLowerCase().replace(/^www\./, '');
  if (host.includes('facebook.com') || host.includes('fb.com')) return 'facebook';
  if (host === 't.me' || host.endsWith('.t.me') || host.includes('telegram.me')) return 'telegram';
  if (host.includes('youtube.com') || host.includes('youtu.be')) return 'youtube';
  if (host.includes('twitter.com') || host.includes('x.com')) return 'x_twitter';
  if (host.includes('linkedin.com')) return 'linkedin';
  if (host.includes('whatsapp.com') || host.includes('wa.me')) return 'whatsapp';
  return 'official_website';
}

export function sourceTypeFrom(platform: string, category: string) {
  if (platform === 'facebook' && category === 'community') return 'Student Facebook Group';
  if (platform === 'telegram' && category === 'community') return 'Student Telegram Group';
  if (platform === 'facebook') return 'Official Facebook Page';
  if (platform === 'telegram') return 'Official Telegram Channel';
  if (platform === 'youtube') return 'Official YouTube Channel';
  if (platform === 'x_twitter') return 'Official X/Twitter Account';
  if (platform === 'linkedin') return 'Official LinkedIn Page';
  if (platform === 'official_website') return 'Official Website';
  return 'Candidate Link';
}

export function looksLikeGroup(url: string, title = '', snippet = '') {
  const combined = `${url} ${title} ${snippet}`.toLowerCase();
  return [
    'facebook.com/groups',
    '/groups/',
    'student group',
    'students group',
    'قروب',
    'جروب',
    'مجموعة',
    'طلاب',
    'طلبة',
    'خريجين',
    'graduates',
    'community',
  ].some((x) => combined.includes(x));
}

export function looksOfficial(url: string, title: string, snippet: string, nameEn?: string | null, nameAr?: string | null) {
  const combined = normalizeText(`${url} ${title} ${snippet}`).toLowerCase();
  const officialSignals = [
    'official',
    'الصفحة الرسمية',
    'الرسمية',
    'الموقع الرسمي',
    'official page',
    'official website',
    'جامعة',
    'university',
    'admission',
    'registrar',
    'deanship',
    'عمادة',
    'إدارة',
    'الإعلام',
    'اعلام',
  ];

  const names = [nameEn, nameAr, nameEn?.replace(/university/gi, '').trim()]
    .filter(Boolean)
    .map((x) => String(x).toLowerCase());

  return officialSignals.some((x) => combined.includes(x)) && names.some((x) => x && combined.includes(x));
}

export function classifyCandidate(args: {
  url: string;
  title?: string | null;
  snippet?: string | null;
  nameEn?: string | null;
  nameAr?: string | null;
  fromOfficialSite?: boolean;
}) {
  const platform = platformFromUrl(args.url);
  let source_category: 'official' | 'likely_official' | 'community' | 'candidate' = 'candidate';
  let confidence: 'High' | 'Medium' | 'Low' = 'Low';

  if (args.fromOfficialSite) {
    source_category = 'official';
    confidence = 'High';
  } else if (looksLikeGroup(args.url, args.title || '', args.snippet || '')) {
    source_category = 'community';
    confidence = 'Low';
  } else if (looksOfficial(args.url, args.title || '', args.snippet || '', args.nameEn, args.nameAr)) {
    source_category = 'likely_official';
    confidence = 'Medium';
  }

  return {
    source_platform: platform,
    source_category,
    source_type: sourceTypeFrom(platform, source_category),
    confidence,
  };
}

export function telegramPublicUrl(urlString: string) {
  try {
    const url = new URL(urlString);
    const host = url.hostname.toLowerCase();
    if ((host === 't.me' || host === 'telegram.me') && !url.pathname.startsWith('/s/')) {
      const channel = url.pathname.split('/').filter(Boolean)[0];
      if (channel) return `https://t.me/s/${channel}`;
    }
  } catch {}
  return urlString;
}

export async function fetchHtml(url: string): Promise<{ finalUrl: string; title: string; text: string; html: string } | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(telegramPublicUrl(url), {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'SudaneseDatabaseStatusBot/0.3 (+official-source-research)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ar,en;q=0.9',
      },
    });

    if (!res.ok) return null;
    const type = res.headers.get('content-type') || '';
    if (type && !type.includes('text/html') && !type.includes('application/xhtml')) return null;

    const html = await res.text();
    if (!html || html.length < 150) return null;

    const $ = cheerio.load(html);
    $('script,style,noscript,svg,canvas,iframe').remove();
    const title = normalizeText($('title').first().text());
    const text = normalizeText($.text());

    return { finalUrl: res.url, title, text, html };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export function parseUrlList(value: unknown): string[] {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) return value.map((x) => normalizeUrl(x)).filter(Boolean) as string[];
  if (typeof value === 'object') return Object.values(value).map((x) => normalizeUrl(x)).filter(Boolean) as string[];

  const s = String(value).trim();
  if (!s || ['nan', 'none', 'null'].includes(s.toLowerCase())) return [];

  try {
    const parsed = JSON.parse(s);
    return parseUrlList(parsed);
  } catch {
    return s.split(/[,;\n]+/).map((x) => normalizeUrl(x)).filter(Boolean) as string[];
  }
}

export function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return '';
  const cols = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const esc = (v: unknown) => {
    if (v === null || v === undefined) return '';
    const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
}
