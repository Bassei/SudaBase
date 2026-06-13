import Link from 'next/link';

export default function ReviewsPage() {
  return (
    <section className="mx-auto max-w-4xl space-y-6 px-4 py-12">
      <div>
        <h1 className="text-4xl font-black">Student reviews</h1>
        <p className="mt-3 text-slate-600">
          Student reviews are now inside each university profile to make the platform easier to use.
        </p>
      </div>

      <Link href="/universities" className="btn bg-sudanGreen text-white">
        Choose a university to review
      </Link>
    </section>
  );
}
