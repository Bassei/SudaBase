import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL in .env.local');
}

if (!serviceRoleKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in .env.local');
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

export async function selectAll<T>(table: string, select: string): Promise<T[]> {
  const pageSize = 1000;
  let from = 0;
  let rows: T[] = [];

  while (true) {
    const { data, error } = await supabaseAdmin
      .from(table)
      .select(select)
      .range(from, from + pageSize - 1);

    if (error) throw error;

    const batch = (data || []) as T[];
    rows = rows.concat(batch);

    if (batch.length < pageSize) break;
    from += pageSize;
  }

  return rows;
}
