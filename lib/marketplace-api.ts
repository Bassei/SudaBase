import { NextResponse } from 'next/server';

type DatabaseError = {
  code?: string;
  message?: string;
};

export function marketplaceDatabaseError(
  error: unknown,
  fallback = 'تعذر حفظ الطلب. حاول مرة أخرى لاحقًا. / Unable to save the request. Please try again later.'
) {
  const databaseError = (error || {}) as DatabaseError;
  const message = databaseError.message || '';
  const databaseMissing =
    databaseError.code === 'PGRST205' ||
    message.includes('schema cache') ||
    message.includes('uf_');

  return NextResponse.json(
    {
      ok: false,
      error: databaseMissing
        ? 'سوق حصاد قيد التهيئة حاليًا. حاول بعد اكتمال إعداد قاعدة البيانات. / The marketplace database is being prepared.'
        : fallback,
    },
    { status: databaseMissing ? 503 : 500 }
  );
}
