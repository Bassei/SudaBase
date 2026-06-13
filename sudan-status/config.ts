export const SKIP_IF_VERIFIED_WITHIN_DAYS = Number(process.env.SKIP_IF_VERIFIED_WITHIN_DAYS || 14);
export const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS || 15000);
export const SLEEP_BETWEEN_REQUESTS_MS = Number(process.env.SLEEP_BETWEEN_REQUESTS_MS || 800);
export const MAX_PAGES_PER_UNIVERSITY = Number(process.env.MAX_PAGES_PER_UNIVERSITY || 18);
export const MAX_SEARCH_RESULTS_PER_QUERY = Number(process.env.MAX_SEARCH_RESULTS_PER_QUERY || 8);
export const MAX_LINKS_PER_UNIVERSITY = Number(process.env.MAX_LINKS_PER_UNIVERSITY || 50);

export const COMMON_STATUS_PATHS = [
  '/',
  '/ar',
  '/news',
  '/ar/news',
  '/announcements',
  '/ar/announcements',
  '/announcement',
  '/ar/announcement',
  '/notices',
  '/ar/notices',
  '/events',
  '/ar/events',
  '/admission',
  '/ar/admission',
  '/registration',
  '/ar/registration',
  '/academic-calendar',
  '/ar/academic-calendar',
  '/exams',
  '/ar/exams',
  '/students',
  '/ar/students',
  '/student-affairs',
  '/ar/student-affairs',
  '/media/news',
  '/category/news',
  '/category/announcements',
  '/index.php/news',
  '/index.php/ar/news',
  '/index.php/announcements',
  '/index.php/ar/announcements',
];

export const SOCIAL_DOMAINS = [
  'facebook.com',
  'fb.com',
  't.me',
  'telegram.me',
  'youtube.com',
  'youtu.be',
  'x.com',
  'twitter.com',
  'linkedin.com',
  'wa.me',
  'whatsapp.com',
];
