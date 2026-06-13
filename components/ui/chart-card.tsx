export function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="card p-5"><h2 className="mb-4 text-lg font-bold">{title}</h2>{children}</section>;
}

