import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { ReviewForm } from '@/components/reviews/review-form';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type PageProps = {
  params: {
    id: string;
  };
};

export default async function UniversityDetailPage({ params }: PageProps) {
  const universityId = decodeURIComponent(params.id);

  const { data: university } = await supabase
    .from('universities')
    .select('*')
    .eq('university_id', universityId)
    .single();

  if (!university) {
    notFound();
  }

  const { data: programs } = await supabase
    .from('programs')
    .select('*')
    .eq('university_id', universityId)
    .order('program_or_faculty', { ascending: true });

  const { data: reviews } = await supabase
    .from('student_reviews')
    .select(`
      review_id,
      reviewer_name,
      faculty,
      study_year,
      teaching_score,
      admin_score,
      facilities_score,
      environment_score,
      value_score,
      overall_score,
      comment,
      verified,
      status,
      created_at
    `)
    .eq('university_id', universityId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(20);

  const approvedReviews = reviews || [];

  const averageScore =
    approvedReviews.length > 0
      ? approvedReviews.reduce((sum, review) => sum + Number(review.overall_score || 0), 0) /
        approvedReviews.length
      : null;

  const universityOption = [
    {
      university_id: university.university_id,
      name_en: university.name_en,
      name_ar: university.name_ar
    }
  ];

  return (
    <section className="mx-auto max-w-7xl space-y-10 px-4 py-12">
      <div>
        <Link href="/universities" className="text-sm font-semibold text-sudanGreen">
          Back to universities
        </Link>

        <div className="mt-4 rounded-3xl bg-slate-950 p-8 text-white">
          <h1 className="text-4xl font-black">
            {university.name_en || university.name_ar || university.university_id}
          </h1>

          {university.name_ar && (
            <p className="mt-2 text-xl text-slate-200">{university.name_ar}</p>
          )}

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-slate-400">City</p>
              <p className="font-bold">{university.city || 'Unknown'}</p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Ownership</p>
              <p className="font-bold">{university.ownership || 'Unknown'}</p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Average review</p>
              <p className="font-bold">
                {averageScore ? `${averageScore.toFixed(1)} / 5` : 'No reviews yet'}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Reviews</p>
              <p className="font-bold">{approvedReviews.length}</p>
            </div>
          </div>

          {university.website && (
            <a
              href={university.website}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex rounded-2xl bg-white px-5 py-3 font-bold text-slate-950"
            >
              Visit website
            </a>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-6">
          <p className="text-sm text-slate-500">UniRank Sudan</p>
          <p className="mt-2 text-3xl font-black">
            {university.rank_unirank_sudan || '-'}
          </p>
        </div>

        <div className="card p-6">
          <p className="text-sm text-slate-500">EduRank Sudan</p>
          <p className="mt-2 text-3xl font-black">
            {university.rank_edurank_sudan || '-'}
          </p>
        </div>

        <div className="card p-6">
          <p className="text-sm text-slate-500">Webometrics Sudan</p>
          <p className="mt-2 text-3xl font-black">
            {university.rank_webometrics_sudan || '-'}
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-3xl font-black">Programs and faculties</h2>

        {!programs?.length ? (
          <div className="card p-6 text-slate-600">
            No programs or faculties are available yet for this university.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {programs.map((program: any) => (
              <div key={program.program_id} className="card p-5">
                <h3 className="font-bold">
                  {program.program_or_faculty || 'Unnamed program'}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {program.degree || 'Degree not specified'}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Confidence: {program.confidence || 'unknown'}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-black">Student reviews</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Reviews for this university only. New reviews are saved as pending until admin approval.
          </p>
        </div>

        <ReviewForm
          universities={universityOption}
          defaultUniversityId={university.university_id}
        />

        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Approved reviews</h3>

          {!approvedReviews.length ? (
            <div className="card p-6 text-slate-600">
              No approved reviews yet for this university.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {approvedReviews.map((review: any) => (
                <article key={review.review_id} className="card space-y-3 p-6">
                  <div>
                    <p className="text-sm text-slate-500">
                      {review.reviewer_name || 'Anonymous student'}
                      {review.verified ? ' - Verified student' : ' - Unverified'}
                    </p>

                    <p className="mt-2 text-3xl font-black text-sudanGreen">
                      {Number(review.overall_score || 0).toFixed(1)} / 5
                    </p>
                  </div>

                  <p className="text-slate-700">{review.comment}</p>

                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                    <p>Teaching: {review.teaching_score}/5</p>
                    <p>Admin: {review.admin_score}/5</p>
                    <p>Facilities: {review.facilities_score}/5</p>
                    <p>Environment: {review.environment_score}/5</p>
                    <p>Value: {review.value_score}/5</p>
                  </div>

                  {(review.faculty || review.study_year) && (
                    <p className="text-sm text-slate-500">
                      {review.faculty || ''}
                      {review.faculty && review.study_year ? ' - ' : ''}
                      {review.study_year || ''}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-bold">Sources and update information</h2>

        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <p>Last updated: {university.last_updated || 'Unknown'}</p>
          <p>Sources: {university.sources || 'Not specified'}</p>

          {university.source_urls && (
            <p className="break-words">
              Source URLs: {university.source_urls}
            </p>
          )}
        </div>
      </section>
    </section>
  );
}