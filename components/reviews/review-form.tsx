'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

type Locale = 'ar' | 'en';

type UniversityOption = {
  university_id: string;
  name_en: string | null;
  name_ar: string | null;
};

type ReviewFormProps = {
  universities: UniversityOption[];
  defaultUniversityId?: string;
  locale?: Locale;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const labels = {
  ar: {
    title: 'إضافة تقييم طالب',
    description:
      'تتم مراجعة التقييمات قبل ظهورها للعلن. لا تضع أرقام هاتف أو بريد إلكتروني أو معلومات شخصية خاصة.',
    university: 'الجامعة',
    chooseUniversity: 'اختر الجامعة',
    name: 'اسمك، اختياري',
    anonymous: 'مجهول',
    faculty: 'الكلية / البرنامج',
    facultyPlaceholder: 'طب، هندسة، إدارة أعمال...',
    studyYear: 'السنة الدراسية',
    studyYearPlaceholder: 'السنة الأولى، خريج، 2024...',
    teaching: 'جودة التدريس',
    admin: 'الإدارة',
    facilities: 'المرافق',
    environment: 'بيئة الجامعة',
    value: 'القيمة مقابل المال',
    comment: 'نص التقييم',
    commentPlaceholder: 'اكتب تقييماً مفيداً عن التدريس، الإدارة، المرافق، البيئة، وتجربة الطالب...',
    submit: 'إرسال التقييم',
    submitting: 'جاري الإرسال...',
    success: 'شكراً لك. تم إرسال التقييم وهو بانتظار موافقة الإدارة.',
    chooseError: 'يرجى اختيار الجامعة.',
    commentError: 'يرجى كتابة تقييم لا يقل عن 10 أحرف.',
    unexpectedError: 'حدث خطأ غير متوقع أثناء إرسال التقييم.',
    scores: {
      excellent: '5 ممتاز',
      good: '4 جيد',
      average: '3 متوسط',
      weak: '2 ضعيف',
      poor: '1 سيئ'
    }
  },
  en: {
    title: 'Submit a student review',
    description:
      'Reviews are moderated before appearing publicly. Do not include phone numbers, emails, or private personal information.',
    university: 'University',
    chooseUniversity: 'Choose university',
    name: 'Your name, optional',
    anonymous: 'Anonymous',
    faculty: 'Faculty / program',
    facultyPlaceholder: 'Medicine, Engineering, Business...',
    studyYear: 'Study year',
    studyYearPlaceholder: 'First year, graduate, 2024...',
    teaching: 'Teaching quality',
    admin: 'Administration',
    facilities: 'Facilities',
    environment: 'Campus environment',
    value: 'Value for money',
    comment: 'Review comment',
    commentPlaceholder: 'Write a useful review about teaching, administration, facilities, environment, and student experience...',
    submit: 'Submit review',
    submitting: 'Submitting...',
    success: 'Thank you. Your review was submitted and is waiting for admin approval.',
    chooseError: 'Please choose a university.',
    commentError: 'Please write at least 10 characters.',
    unexpectedError: 'Unexpected error while submitting review.',
    scores: {
      excellent: '5 Excellent',
      good: '4 Good',
      average: '3 Average',
      weak: '2 Weak',
      poor: '1 Poor'
    }
  }
};

export function ReviewForm({ universities, defaultUniversityId, locale = 'en' }: ReviewFormProps) {
  const t = labels[locale];
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const scoreFields = [
    { name: 'teaching_score', label: t.teaching },
    { name: 'admin_score', label: t.admin },
    { name: 'facilities_score', label: t.facilities },
    { name: 'environment_score', label: t.environment },
    { name: 'value_score', label: t.value }
  ] as const;

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    setStatus('loading');
    setMessage('');

    try {
      const formData = new FormData(form);

      const universityId = String(formData.get('university_id') || '').trim();
      const comment = String(formData.get('comment') || '').trim();

      if (!universityId) {
        setStatus('error');
        setMessage(t.chooseError);
        return;
      }

      if (comment.length < 10) {
        setStatus('error');
        setMessage(t.commentError);
        return;
      }

      const payload = {
        university_id: universityId,
        reviewer_name: String(formData.get('reviewer_name') || '').trim() || null,
        faculty: String(formData.get('faculty') || '').trim() || null,
        study_year: String(formData.get('study_year') || '').trim() || null,
        teaching_score: Number(formData.get('teaching_score')),
        admin_score: Number(formData.get('admin_score')),
        facilities_score: Number(formData.get('facilities_score')),
        environment_score: Number(formData.get('environment_score')),
        value_score: Number(formData.get('value_score')),
        comment,
        status: 'pending',
        verified: false
      };

      const { error } = await supabase
        .from('student_reviews')
        .insert(payload);

      if (error) {
        setStatus('error');
        setMessage(error.message || t.unexpectedError);
        return;
      }

      form.reset();
      setStatus('success');
      setMessage(t.success);
    } catch (error: any) {
      setStatus('error');
      setMessage(error?.message || t.unexpectedError);
    }
  }

  return (
    <form dir={dir} onSubmit={handleSubmit} className="card space-y-5 p-6">
      <div>
        <h2 className="text-2xl font-bold">{t.title}</h2>
        <p className="mt-2 text-sm text-slate-600">
          {t.description}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold">{t.university}</span>
          <select
            name="university_id"
            defaultValue={defaultUniversityId || ''}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          >
            <option value="">{t.chooseUniversity}</option>
            {universities.map((university) => (
              <option key={university.university_id} value={university.university_id}>
                {locale === 'ar'
                  ? university.name_ar || university.name_en || university.university_id
                  : university.name_en || university.name_ar || university.university_id}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">{t.name}</span>
          <input
            name="reviewer_name"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            placeholder={t.anonymous}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">{t.faculty}</span>
          <input
            name="faculty"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            placeholder={t.facultyPlaceholder}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold">{t.studyYear}</span>
          <input
            name="study_year"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            placeholder={t.studyYearPlaceholder}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {scoreFields.map((field) => (
          <label key={field.name} className="space-y-2">
            <span className="text-sm font-semibold">{field.label}</span>
            <select
              name={field.name}
              required
              defaultValue="5"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            >
              <option value="5">{t.scores.excellent}</option>
              <option value="4">{t.scores.good}</option>
              <option value="3">{t.scores.average}</option>
              <option value="2">{t.scores.weak}</option>
              <option value="1">{t.scores.poor}</option>
            </select>
          </label>
        ))}
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-semibold">{t.comment}</span>
        <textarea
          name="comment"
          required
          rows={5}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          placeholder={t.commentPlaceholder}
        />
      </label>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn bg-sudanGreen text-white disabled:opacity-60"
      >
        {status === 'loading' ? t.submitting : t.submit}
      </button>

      {message && (
        <p
          className={
            status === 'success'
              ? 'rounded-2xl bg-green-50 p-4 text-sm text-green-700'
              : 'rounded-2xl bg-red-50 p-4 text-sm text-red-700'
          }
        >
          {message}
        </p>
      )}
    </form>
  );
}
