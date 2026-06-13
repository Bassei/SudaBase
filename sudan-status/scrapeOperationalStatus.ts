import fs from 'fs';
import path from 'path';
import { supabaseAdmin, selectAll } from './supabaseAdmin';
import { COMMON_STATUS_PATHS, MAX_PAGES_PER_UNIVERSITY, SKIP_IF_VERIFIED_WITHIN_DAYS, SLEEP_BETWEEN_REQUESTS_MS } from './config';
import { fetchHtml, normalizeText, normalizeUrl, normalizedForUnique, sha1, sleep, sourceTypeFrom, toCsv } from './utils';
import { inferOperationalStatus } from './infer';

type University = {
  university_id: string;
  name_en: string | null;
  name_ar: string | null;
  website: string | null;
};

type ExistingStatus = {
  university_id: string;
  status: string | null;
  mode: string | null;
  stability: string | null;
  confidence: string | null;
  last_verified: string | null;
};

type SourceLink = {
  university_id: string;
  url: string;
  normalized_url: string;
  source_platform: string;
  source_category: string;
  source_type: string;
  confidence: string;
};

const OUTPUT_DIR = path.join(process.cwd(), 'status_output');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const TODAY = new Date().toISOString().slice(0, 10);

function sourceTypeForWebsite(url: string) {
  const host = new URL(url).hostname.toLowerCase();
  if (host.includes('facebook.com') || host.includes('fb.com')) return 'Official Facebook Page';
  if (host === 't.me' || host.endsWith('.t.me') || host.includes('telegram.me')) return 'Official Telegram Channel';
  return 'Official Website';
}

function isRecentVerified(row?: ExistingStatus) {
  if (!row) return false;
  if (!row.status || row.status === 'Unknown') return false;
  if (!['High', 'Medium'].includes(row.confidence || '')) return false;
  if (!row.last_verified) return false;

  const verified = new Date(row.last_verified);
  if (Number.isNaN(verified.getTime())) return false;
  const ageDays = (Date.now() - verified.getTime()) / (1000 * 60 * 60 * 24);
  return ageDays <= SKIP_IF_VERIFIED_WITHIN_DAYS;
}

function buildCandidateUrls(u: University, links: SourceLink[]) {
  const urls: string[] = [];
  const website = normalizeUrl(u.website);

  if (website) {
    for (const p of COMMON_STATUS_PATHS) {
      const url = new URL(p, website).toString();
      urls.push(url);
    }
  }

  for (const link of links) {
    if (!['official', 'likely_official'].includes(link.source_category)) continue;
    if (link.source_platform === 'whatsapp') continue;
    urls.push(link.url);
  }

  const dedup = new Map<string, string>();
  for (const url of urls) {
    const clean = normalizeUrl(url);
    if (!clean) continue;
    dedup.set(normalizedForUnique(clean), clean);
  }

  return [...dedup.values()].slice(0, MAX_PAGES_PER_UNIVERSITY);
}

async function main() {
  const universities = await selectAll<University>('universities', 'university_id,name_en,name_ar,website');
  const existingStatuses = await selectAll<ExistingStatus>('university_operational_status', 'university_id,status,mode,stability,confidence,last_verified');
  const sourceLinks = await selectAll<SourceLink>('university_source_links', 'university_id,url,normalized_url,source_platform,source_category,source_type,confidence');
  const existingEvidence = await selectAll<{ source_hash: string }>('university_status_evidence', 'source_hash');

  const statusById = new Map(existingStatuses.map((x) => [x.university_id, x]));
  const linksByUniversity = new Map<string, SourceLink[]>();
  for (const link of sourceLinks) {
    if (!linksByUniversity.has(link.university_id)) linksByUniversity.set(link.university_id, []);
    linksByUniversity.get(link.university_id)!.push(link);
  }
  const existingEvidenceHashes = new Set(existingEvidence.map((x) => x.source_hash));

  const updated: Record<string, unknown>[] = [];
  const evidenceOut: Record<string, unknown>[] = [];
  const skipped: Record<string, unknown>[] = [];
  const review: Record<string, unknown>[] = [];

  console.log(`Universities: ${universities.length}`);
  console.log(`Source links: ${sourceLinks.length}`);

  for (let i = 0; i < universities.length; i++) {
    const u = universities[i];
    const old = statusById.get(u.university_id);

    if (isRecentVerified(old)) {
      skipped.push({ university_id: u.university_id, name_en: u.name_en, reason: `already verified within ${SKIP_IF_VERIFIED_WITHIN_DAYS} days`, existing_status: old?.status, confidence: old?.confidence, last_verified: old?.last_verified });
      continue;
    }

    console.log(`[${i + 1}/${universities.length}] Scraping status: ${u.university_id} ${u.name_en || ''}`);
    const candidateUrls = buildCandidateUrls(u, linksByUniversity.get(u.university_id) || []);
    const evidenceRows: Record<string, unknown>[] = [];

    for (const url of candidateUrls) {
      const page = await fetchHtml(url);
      await sleep(SLEEP_BETWEEN_REQUESTS_MS);
      if (!page) continue;

      const sourceType = sourceTypeForWebsite(page.finalUrl);
      const combined = normalizeText(`${u.name_en || ''} ${u.name_ar || ''} ${page.title} ${page.text.slice(0, 16000)}`);
      const analysis = inferOperationalStatus(combined, sourceType);
      if (analysis.score < 3) continue;

      const sourceHash = sha1(u.university_id, page.finalUrl, analysis.evidence_text.slice(0, 1200));
      if (existingEvidenceHashes.has(sourceHash)) continue;

      const evidence = {
        university_id: u.university_id,
        source_type: sourceType,
        source_url: page.finalUrl,
        source_hash: sourceHash,
        page_title: page.title,
        evidence_text: analysis.evidence_text,
        detected_status: analysis.status,
        detected_mode: analysis.mode,
        detected_stability: analysis.stability,
        detected_current_location: analysis.current_location,
        detected_date: analysis.detected_date,
        scraper_score: analysis.score,
        confidence: analysis.confidence,
        is_official: true,
      };

      evidenceRows.push(evidence);
      evidenceOut.push(evidence);
      existingEvidenceHashes.add(sourceHash);
    }

    if (!evidenceRows.length) {
      if (old && old.status && old.status !== 'Unknown' && ['High', 'Medium'].includes(old.confidence || '')) {
        skipped.push({ university_id: u.university_id, name_en: u.name_en, reason: 'new scrape found no clear evidence; kept existing stronger status', existing_status: old.status, confidence: old.confidence });
      } else {
        review.push({ university_id: u.university_id, name_en: u.name_en, website: u.website, reason: 'No clear official status evidence found' });
      }
      continue;
    }

    const best = evidenceRows.sort((a, b) => {
      const conf = (x: any) => x === 'High' ? 3 : x === 'Medium' ? 2 : 1;
      return (conf(b.confidence) - conf(a.confidence)) || (Number(b.scraper_score) - Number(a.scraper_score));
    })[0];

    const current = {
      university_id: u.university_id,
      status: best.detected_status,
      mode: best.detected_mode,
      stability: best.detected_stability,
      current_location: best.detected_current_location,
      last_verified: TODAY,
      source_type: best.source_type,
      source_url: best.source_url,
      confidence: best.confidence,
      data_method: 'official_scrape',
      evidence_count: evidenceRows.length,
      official_evidence_count: evidenceRows.length,
      survey_response_count: 0,
      evidence_summary: String(best.evidence_text || '').slice(0, 1000),
      notes: 'Automatically inferred from official/likely-official sources. Community links are not used as final evidence.',
    };

    const { error: statusError } = await supabaseAdmin
      .from('university_operational_status')
      .upsert(current, { onConflict: 'university_id' });
    if (statusError) throw statusError;

    const { error: evidenceError } = await supabaseAdmin
      .from('university_status_evidence')
      .upsert(evidenceRows, { onConflict: 'university_id,source_url,source_hash' });
    if (evidenceError) throw evidenceError;

    updated.push({ ...current, name_en: u.name_en, name_ar: u.name_ar });

    fs.writeFileSync(path.join(OUTPUT_DIR, 'operational_status_updated.csv'), toCsv(updated), 'utf8');
    fs.writeFileSync(path.join(OUTPUT_DIR, 'operational_status_evidence_new.csv'), toCsv(evidenceOut), 'utf8');
    fs.writeFileSync(path.join(OUTPUT_DIR, 'operational_status_skipped.csv'), toCsv(skipped), 'utf8');
    fs.writeFileSync(path.join(OUTPUT_DIR, 'operational_status_manual_review.csv'), toCsv(review), 'utf8');
  }

  console.log('Done.');
  console.log(`Updated: ${updated.length}`);
  console.log(`Evidence: ${evidenceOut.length}`);
  console.log(`Skipped: ${skipped.length}`);
  console.log(`Manual review: ${review.length}`);
  console.log(`Output folder: ${OUTPUT_DIR}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
