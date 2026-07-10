import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="font-bold">United Fruit Company</p>
          <p className="mt-2 text-sm text-slate-600">Agricultural supply, demand, and market intelligence platform for Sudan.</p>
        </div>
        <div className="text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Legal</p>
          <Link href="/privacy" className="mt-2 block hover:underline">Privacy</Link>
          <Link href="/methodology" className="mt-2 block hover:underline">Methodology</Link>
        </div>
        <p className="text-sm text-slate-500">Crop prices are indicative and updated by the United Fruit team.</p>
      </div>
    </footer>
  );
}

