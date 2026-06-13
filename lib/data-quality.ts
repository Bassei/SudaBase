import type { Program, University } from '@/lib/types';

export function confidenceLabel(text?: string | null): 'high' | 'medium' | 'low' {
  if (!text || text.length < 4) return 'low';
  if (/faculty|college|school|department|program/i.test(text)) return 'medium';
  return 'high';
}

export function findDuplicateUniversityNames(universities: University[]) {
  const groups = new Map<string, University[]>();
  for (const u of universities) {
    const key = (u.name_en || '').trim().toLowerCase();
    if (!key) continue;
    groups.set(key, [...(groups.get(key) || []), u]);
  }
  return [...groups.values()].filter(g => g.length > 1);
}

export function suspiciousProgram(program: Program) {
  const name = program.program_or_faculty || '';
  return name.length < 3 || program.confidence === 'low' || /home|login|copyright|contact/i.test(name);
}
