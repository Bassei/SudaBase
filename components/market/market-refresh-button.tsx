'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

export function MarketRefreshButton() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/market/refresh', { cache: 'no-store' });
      const json = await response.json();
      if (!response.ok || json.ok === false) throw new Error(json.error || 'تعذر تحديث المؤشرات.');
      setMessage(`تم تحديث ${json.saved} مؤشر.`);
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'تعذر تحديث المؤشرات.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button type="button" onClick={refresh} disabled={loading} className="btn-primary">
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'جاري التحديث...' : 'تحديث المؤشرات'}
      </button>
      {message && <p className="text-sm font-bold text-emerald-800">{message}</p>}
    </div>
  );
}
