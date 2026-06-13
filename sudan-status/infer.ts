import { normalizeText } from './utils';

const ACTIVE_KEYWORDS = [
  'استئناف الدراسة','استئناف المحاضرات','استمرار الدراسة','بدء الدراسة','بداية الدراسة','الدراسة مستمرة','العام الدراسي','التقويم الدراسي','القبول والتسجيل','فتح باب التسجيل','التسجيل الإلكتروني','التسجيل الالكتروني','جدول الامتحانات','امتحانات','نتائج الامتحانات','إعلان مهم للطلاب','اعلان مهم للطلاب','المحاضرات','resumed','classes resumed','lectures resumed','academic activities resumed','registration is open','admission','examination timetable','academic calendar','semester'
];
const PARTIAL_KEYWORDS = ['جزئيا','جزئيًا','تعمل جزئيا','تعمل جزئيًا','بعض الكليات','لبعض الكليات','على مراحل','بالتدرج','الدفعات','المستويات','phased','partially','some faculties','some colleges'];
const SUSPENDED_KEYWORDS = ['تعليق الدراسة','تعليق المحاضرات','تعليق النشاط الأكاديمي','تعليق النشاط الاكاديمي','تأجيل الدراسة','تاجيل الدراسة','تأجيل الامتحانات','تاجيل الامتحانات','إيقاف الدراسة','ايقاف الدراسة','توقف الدراسة','الدراسة متوقفة','مغلق','suspended','postponed','closed','halted','inactive'];
const ONLINE_KEYWORDS = ['أونلاين','اونلاين','إلكتروني','الكتروني','التعليم الإلكتروني','التعليم الالكتروني','عن بعد','منصة','منصة تعليمية','google classroom','moodle','e-learning','elearning','online','remote','virtual'];
const IN_PERSON_KEYWORDS = ['حضوري','حضورياً','حضوريا','داخل القاعات','بالقاعات','بالمجمع','بالحرم الجامعي','in-person','on campus','campus','physical attendance'];
const HYBRID_KEYWORDS = ['هجين','مدمج','التعليم المدمج','الدراسة المدمجة','حضوري وعن بعد','إلكتروني وحضوري','الكتروني وحضوري','hybrid','blended'];
const STABLE_KEYWORDS = ['انتظام الدراسة','انتظام المحاضرات','تقويم دراسي','التقويم الدراسي','جدول الامتحانات','مواعيد الامتحانات','academic calendar','examination timetable','regular classes','schedule'];
const UNSTABLE_KEYWORDS = ['ظروف البلاد','الظروف الأمنية','الظروف الامنية','الحرب','النزوح','تعذر','تأجيل','تاجيل','تعليق','emergency','war','security situation','postponed'];

const LOCATION_ALIASES: Record<string, string> = {
  'بورتسودان': 'Port Sudan', 'بورت سودان': 'Port Sudan', 'port sudan': 'Port Sudan',
  'الخرطوم': 'Khartoum', 'khartoum': 'Khartoum',
  'أم درمان': 'Omdurman', 'ام درمان': 'Omdurman', 'omdurman': 'Omdurman',
  'بحري': 'Bahri', 'bahri': 'Bahri',
  'كسلا': 'Kassala', 'kassala': 'Kassala',
  'عطبرة': 'Atbara', 'atbara': 'Atbara',
  'ود مدني': 'Wad Madani', 'مدني': 'Wad Madani', 'wad madani': 'Wad Madani',
  'القضارف': 'Al Qadarif', 'gedaref': 'Al Qadarif', 'al qadarif': 'Al Qadarif',
  'الأبيض': 'El Obeid', 'الابيض': 'El Obeid', 'el obeid': 'El Obeid',
  'نيالا': 'Nyala', 'nyala': 'Nyala',
  'الفاشر': 'El Fasher', 'el fasher': 'El Fasher',
  'سنار': 'Sennar', 'sennar': 'Sennar',
  'كوستي': 'Kosti', 'kosti': 'Kosti',
  'شندي': 'Shendi', 'shendi': 'Shendi',
  'دنقلا': 'Dongola', 'dongola': 'Dongola',
};

function keywordScore(text: string, keywords: string[], weight: number) {
  const t = text.toLowerCase();
  return keywords.reduce((sum, kw) => sum + (t.includes(kw.toLowerCase()) ? weight : 0), 0);
}

function findLocation(text: string) {
  const t = text.toLowerCase();
  for (const [key, value] of Object.entries(LOCATION_ALIASES)) {
    if (t.includes(key.toLowerCase())) return value;
  }
  return null;
}

function extractDate(text: string) {
  const patterns = [
    /\b20[2-9][0-9][-/.][01]?[0-9][-/.][0-3]?[0-9]\b/,
    /\b[0-3]?[0-9][-/.][01]?[0-9][-/.]20[2-9][0-9]\b/,
  ];
  for (const pat of patterns) {
    const match = text.match(pat);
    if (match) return match[0];
  }
  return null;
}

function extractSnippet(text: string, maxLen = 1000) {
  const all = [...ACTIVE_KEYWORDS, ...PARTIAL_KEYWORDS, ...SUSPENDED_KEYWORDS, ...ONLINE_KEYWORDS, ...IN_PERSON_KEYWORDS, ...HYBRID_KEYWORDS];
  const lower = text.toLowerCase();
  let pos = -1;
  for (const kw of all) {
    pos = lower.indexOf(kw.toLowerCase());
    if (pos >= 0) break;
  }
  if (pos < 0) return normalizeText(text.slice(0, maxLen));
  return normalizeText(text.slice(Math.max(0, pos - 350), Math.min(text.length, pos + maxLen)));
}

export function inferOperationalStatus(textInput: string, sourceType: string) {
  const text = normalizeText(textInput);
  const activeScore = keywordScore(text, ACTIVE_KEYWORDS, 3);
  const partialScore = keywordScore(text, PARTIAL_KEYWORDS, 3);
  const suspendedScore = keywordScore(text, SUSPENDED_KEYWORDS, 4);
  const onlineScore = keywordScore(text, ONLINE_KEYWORDS, 3);
  const inPersonScore = keywordScore(text, IN_PERSON_KEYWORDS, 3);
  const hybridScore = keywordScore(text, HYBRID_KEYWORDS, 4);
  const stableScore = keywordScore(text, STABLE_KEYWORDS, 3);
  const unstableScore = keywordScore(text, UNSTABLE_KEYWORDS, 2);

  const score = activeScore + partialScore + suspendedScore + onlineScore + inPersonScore + hybridScore + stableScore + unstableScore;

  let status: 'Active' | 'Partially Active' | 'Suspended' | 'Inactive' | 'Unknown' = 'Unknown';
  if (score < 3) status = 'Unknown';
  else if (suspendedScore >= Math.max(activeScore, partialScore) && suspendedScore >= 4) status = 'Suspended';
  else if (partialScore > 0 || hybridScore > 0) status = 'Partially Active';
  else if (activeScore >= 3) status = 'Active';

  let mode: 'In-person' | 'Online' | 'Hybrid' | 'Remote' | 'Suspended' | 'Unknown' = 'Unknown';
  if (status === 'Suspended') mode = 'Suspended';
  else if (hybridScore > 0) mode = 'Hybrid';
  else if (onlineScore > inPersonScore && onlineScore > 0) mode = 'Online';
  else if (inPersonScore > 0) mode = 'In-person';
  else if (onlineScore > 0) mode = 'Remote';

  let stability: 'Stable' | 'Moderate' | 'Unstable' | 'Unknown' = 'Unknown';
  if ((status as string) === 'Suspended' || (status as string) === 'Inactive') stability = 'Unstable';
  else if (unstableScore >= stableScore + 2 && unstableScore > 0) stability = 'Unstable';
  else if (stableScore >= 3 && ['Active', 'Partially Active'].includes(status)) stability = 'Stable';
  else if (['Active', 'Partially Active'].includes(status)) stability = 'Moderate';

  const sourceBonus = ['Official Facebook Page', 'Official Website', 'Official Telegram Channel', 'Ministry Statement'].includes(sourceType) ? 2 : 0;
  const strength = score + sourceBonus;
  let confidence: 'High' | 'Medium' | 'Low' = 'Low';
  if (status !== 'Unknown' && strength >= 14) confidence = 'High';
  else if (status !== 'Unknown' && strength >= 6) confidence = 'Medium';

  return {
    status,
    mode,
    stability,
    current_location: findLocation(text),
    detected_date: extractDate(text),
    score,
    confidence,
    evidence_text: extractSnippet(text),
  };
}
