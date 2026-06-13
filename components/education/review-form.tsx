"use client";
import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export function ReviewForm({ universityId }: { universityId: string }) {
  const [message, setMessage] = useState('');
  async function submit(formData: FormData) {
    setMessage('Submitting...');
    const score = (name: string) => Number(formData.get(name) || 3);
    const payload = {
      university_id: universityId,
      reviewer_name: String(formData.get('reviewer_name') || '').slice(0, 80) || null,
      faculty: String(formData.get('faculty') || '').slice(0, 120) || null,
      study_year: String(formData.get('study_year') || '').slice(0, 80) || null,
      teaching_score: score('teaching_score'), admin_score: score('admin_score'), facilities_score: score('facilities_score'), environment_score: score('environment_score'), value_score: score('value_score'),
      comment: String(formData.get('comment') || '').slice(0, 1200),
      status: 'pending', verified: false
    };
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from('student_reviews').insert(payload);
    setMessage(error ? error.message : 'Thank you. Your review is pending moderation.');
  }
  return (
    <form action={submit} className="card space-y-4 p-5">
      <h3 className="text-lg font-bold">Add a student review</h3>
      <div className="grid gap-3 md:grid-cols-3"><input name="reviewer_name" className="input" placeholder="Name (optional)" /><input name="faculty" className="input" placeholder="Faculty" /><input name="study_year" className="input" placeholder="Study year" /></div>
      <div className="grid gap-3 md:grid-cols-5">{['teaching','admin','facilities','environment','value'].map(k => <label key={k} className="text-sm capitalize">{k}<select name={`${k}_score`} className="input mt-1">{[5,4,3,2,1].map(n => <option key={n}>{n}</option>)}</select></label>)}</div>
      <textarea name="comment" className="input min-h-28" placeholder="Share useful details. Do not include phone numbers or private data." />
      <button className="btn-primary" type="submit">Submit for moderation</button>
      {message && <p className="text-sm text-slate-600">{message}</p>}
    </form>
  );
}

