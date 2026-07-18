export type MahsoolCropPrice = {
  id: number;
  product: string;
  market: string;
  pricing: string;
  price: number;
  unit: string;
  date: string;
};

const PRICE_API = 'https://apiecr.mahsool.sd/price';
const CROP_PATTERN = /ذرة|قطن|أمباز|امباز|برسيم|أعلاف|اعلاف|قمح|سمسم|فول|دخن|كركدي|كركديه|بصل|حمص|لوبيا|صمغ|بلح|تمر/;

const fallbackPrices: MahsoolCropPrice[] = [
  { id: 1, product: 'أمباز', market: 'دنقلا', pricing: 'مبيعات جملة', price: 70000, unit: 'قنطار', date: '2025-02-24T00:00:00.000Z' },
  { id: 2, product: 'بذرة قطن', market: 'السلام', pricing: 'مبيعات جملة', price: 130000, unit: 'جوال عادي 90 كجم', date: '2025-02-19T00:00:00.000Z' },
  { id: 3, product: 'دريش ذرة', market: 'السلام', pricing: 'مبيعات جملة', price: 160000, unit: 'جوال عادي 90 كجم', date: '2025-02-19T00:00:00.000Z' },
  { id: 4, product: 'مكعب البرسيم', market: 'دنقلا', pricing: 'مبيعات جملة', price: 99000, unit: 'كرتونة 80 قطعة', date: '2025-02-24T00:00:00.000Z' },
  { id: 5, product: 'منتجات أعلاف', market: 'السلام', pricing: 'مبيعات جملة', price: 90000, unit: 'كيلو غرام', date: '2025-02-19T00:00:00.000Z' },
];

function normalize(rows: unknown): MahsoolCropPrice[] {
  if (!Array.isArray(rows)) return [];

  const valid = rows.flatMap((row): MahsoolCropPrice[] => {
    if (!row || typeof row !== 'object') return [];
    const item = row as Record<string, unknown>;
    const product = String(item.product ?? '').trim();
    const price = Number(item.price);
    const date = String(item.date ?? '');
    if (!CROP_PATTERN.test(product) || !Number.isFinite(price) || price <= 0 || !date) return [];
    return [{
      id: Number(item.id) || 0,
      product,
      market: String(item.market ?? '').trim(),
      pricing: String(item.pricing ?? '').trim(),
      price,
      unit: String(item.unit ?? '').replaceAll('-', ' ').trim(),
      date,
    }];
  });

  const latest = new Map<string, MahsoolCropPrice>();
  for (const item of valid) {
    const key = `${item.product}|${item.market}|${item.pricing}`;
    const current = latest.get(key);
    if (!current || new Date(item.date).getTime() > new Date(current.date).getTime()) latest.set(key, item);
  }

  return [...latest.values()].sort((a, b) => b.price - a.price);
}

export async function getMahsoolCropPrices(): Promise<MahsoolCropPrice[]> {
  try {
    const response = await fetch(PRICE_API, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(12000) });
    if (!response.ok) return fallbackPrices;
    const prices = normalize(await response.json());
    return prices.length ? prices : fallbackPrices;
  } catch {
    return fallbackPrices;
  }
}
