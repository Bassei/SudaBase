# Sudanese Database — VS Code Operational Status Scraper

هذه الملفات تعمل من مشروعك في VS Code وتحدث Supabase مباشرة.

## 1) Install

```bash
npm i @supabase/supabase-js dotenv cheerio
npm i -D tsx typescript @types/node
```

## 2) Environment

ضع هذه القيم في `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

لا ترفع `SUPABASE_SERVICE_ROLE_KEY` إلى GitHub.

## 3) Database

شغل SQL الموجود في:

```text
supabase/01_status_tables.sql
```

## 4) Run link discovery

```bash
npx tsx scripts/sudan-status/discoverLinks.ts
```

ينشئ ويحدث جدول:

```text
university_source_links
```

ويحفظ ملفات مراجعة في:

```text
status_output/
```

## 5) Run operational status scraper

```bash
npx tsx scripts/sudan-status/scrapeOperationalStatus.ts
```

يحدث:

```text
university_operational_status
university_status_evidence
```

## Notes

- الروابط الرسمية و likely_official فقط تستخدم لتحديد الحالة النهائية.
- قروبات الطلاب تحفظ كـ community ولا تستخدم كمصدر نهائي.
- الجامعات التي لديها حالة حديثة بثقة High/Medium خلال 14 يوم يتم تخطيها.
- السكربت لا يخفض حالة قديمة قوية إلى Unknown بسبب كشط جديد ضعيف.
