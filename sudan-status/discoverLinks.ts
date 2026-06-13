import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { supabaseAdmin, selectAll } from './supabaseAdmin';
import {
  classifyCandidate,
  fetchHtml,
  normalizeText,
  normalizeUrl,
  normalizedForUnique,
  parseUrlList,
  platformFromUrl,
  sleep,
  toCsv,
} from './utils';
import {
  MAX_LINKS_PER_UNIVERSITY,
  MAX_SEARCH_RESULTS_PER_QUERY,
  SLEEP_BETWEEN_REQUESTS_MS,
  SOCIAL_DOMAINS,
} from './config';

type University = {
  university_id: string;
  name_en: string | null;
  name_ar: string | null;
  website: string | null;
  source_urls?: unknown;
};

const OUTPUT_DIR = path.join(process.cwd(), 'status_output');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function duckduckgoSearch(query: string) {
  const url = new URL('https://duckduckgo.com/html/');
  url.searchParams.set('q', query);

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 SudaneseDatabaseLinkDiscovery/0.3',
        'Accept-Language': 'ar,en;q=0.9',
      },
    });
    if (!res.ok) return [];
    const html = await res.text();
    const $ = cheerio.load(html);
    const out: Array<{ url: string; title: string; snippet: string }> = [];

    $('.result').each((_, el) => {
      if (out.length >= MAX_SEARCH_RESULTS_PER_QUERY) return;
      const a = $(el).find('.result__a').first();
      const title = normalizeText(a.text());
      const snippet = normalizeText($(el).find('.result__snippet').first().text());
      let href = a.attr('href') || '';

      if (href.includes('duckduckgo.com/l/')) {
        try {
          const parsed = new URL(href);
          href = parsed.searchParams.get('uddg') || href;
        } catch {}
      }

      const clean = normalizeUrl(href);
      if (clean) out.push({ url: clean, title, snippet });
    });

    return out;
  } catch {
    return [];
  }
}

function buildQueries(u: University) {
  const names = [u.name_en, u.name_ar].filter(Boolean) as string[];
  const queries: Array<{ query: string; method: 'search_engine' | 'student_group_search' }> = [];

  for (const name of names) {
    queries.push(
      { query: `"${name}" official facebook`, method: 'search_engine' },
      { query: `"${name}" "الصفحة الرسمية" فيسبوك`, method: 'search_engine' },
      { query: `"${name}" official telegram`, method: 'search_engine' },
      { query: `"${name}" site:facebook.com`, method: 'search_engine' },
      { query: `"${name}" site:t.me`, method: 'search_engine' },
      { query: `"${name}" students group facebook`, method: 'student_group_search' },
      { query: `"${name}" "قروب الطلاب"`, method: 'student_group_search' },
      { query: `"${name}" "جروب الطلاب"`, method: 'student_group_search' },
    );
  }
  return queries;
}

async function extractSocialLinksFromWebsite(u: University) {
  const website = normalizeUrl(u.website);
  if (!website) return [];
  const page = await fetchHtml(website);
  if (!page) return [];

  const $ = cheerio.load(page.html);
  const links: Record<string, unknown>[] = [];

  $('a[href]').each((_, el) => {
    const href = normalizeUrl($(el).attr('href'), page.finalUrl);
    if (!href) return;
    const host = new URL(href).hostname.toLowerCase();
    if (!SOCIAL_DOMAINS.some((d) => host.includes(d))) return;

    const cls = classifyCandidate({
      url: href,
      title: normalizeText($(el).text()) || page.title,
      snippet: page.text.slice(0, 700),
      nameEn: u.name_en,
      nameAr: u.name_ar,
      fromOfficialSite: true,
    });

    links.push({
      university_id: u.university_id,
      url: href,
      normalized_url: normalizedForUnique(href),
      discovery_method: 'official_website_extract',
      title: normalizeText($(el).text()).slice(0, 300) || page.title.slice(0, 300),
      snippet: page.text.slice(0, 700),
      ...cls,
    });
  });

  return links;
}

async function discoverForUniversity(u: University) {
  const collected: Record<string, unknown>[] = [];

  collected.push(...await extractSocialLinksFromWebsite(u));

  for (const existing of parseUrlList(u.source_urls)) {
    const cls = classifyCandidate({ url: existing, nameEn: u.name_en, nameAr: u.name_ar });
    collected.push({
      university_id: u.university_id,
      url: existing,
      normalized_url: normalizedForUnique(existing),
      discovery_method: 'existing_database',
      title: null,
      snippet: null,
      ...cls,
    });
  }

  const seenSearch = new Set<string>();
  for (const q of buildQueries(u)) {
    const results = await duckduckgoSearch(q.query);
    await sleep(SLEEP_BETWEEN_REQUESTS_MS);

    for (const r of results) {
      const platform = platformFromUrl(r.url);
      if (!['facebook', 'telegram', 'youtube', 'x_twitter', 'linkedin', 'whatsapp'].includes(platform)) continue;
      const norm = normalizedForUnique(r.url);
      if (seenSearch.has(norm)) continue;
      seenSearch.add(norm);

      const cls = classifyCandidate({ url: r.url, title: r.title, snippet: r.snippet, nameEn: u.name_en, nameAr: u.name_ar });
      if (q.method === 'student_group_search' && cls.source_category !== 'likely_official') {
        cls.source_category = 'community';
        cls.confidence = 'Low';
        cls.source_type = platform === 'telegram' ? 'Student Telegram Group' : 'Student Facebook Group';
      }

      collected.push({
        university_id: u.university_id,
        url: r.url,
        normalized_url: norm,
        discovery_method: q.method,
        title: r.title.slice(0, 300),
        snippet: r.snippet.slice(0, 700),
        ...cls,
      });

      if (collected.length >= MAX_LINKS_PER_UNIVERSITY) break;
    }
    if (collected.length >= MAX_LINKS_PER_UNIVERSITY) break;
  }

  const dedup = new Map<string, Record<string, unknown>>();
  for (const item of collected) dedup.set(String(item.normalized_url), item);
  return [...dedup.values()];
}

async function main() {
  const universities = await selectAll<University>('universities', 'university_id,name_en,name_ar,website,source_urls');
  console.log(`Universities loaded: ${universities.length}`);

  const allLinks: Record<string, unknown>[] = [];
  const reviewLinks: Record<string, unknown>[] = [];

  for (let i = 0; i < universities.length; i++) {
    const u = universities[i];
    console.log(`[${i + 1}/${universities.length}] Discovering links: ${u.university_id} ${u.name_en || ''}`);

    const links = await discoverForUniversity(u);
    allLinks.push(...links);
    reviewLinks.push(...links.filter((x) => ['candidate', 'community'].includes(String(x.source_category))).map((x) => ({ ...x, name_en: u.name_en, name_ar: u.name_ar })));

    if (links.length) {
      const { error } = await supabaseAdmin
        .from('university_source_links')
        .upsert(links, { onConflict: 'university_id,normalized_url' });
      if (error) throw error;
    }

    fs.writeFileSync(path.join(OUTPUT_DIR, 'university_source_links_discovered.csv'), toCsv(allLinks), 'utf8');
    fs.writeFileSync(path.join(OUTPUT_DIR, 'university_source_links_review_needed.csv'), toCsv(reviewLinks), 'utf8');
  }

  console.log(`Done. Links discovered: ${allLinks.length}`);
  console.log(`Output: ${path.join(OUTPUT_DIR, 'university_source_links_discovered.csv')}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
