import React, { useEffect, useMemo, useState } from 'react';

type Payment = {
  _id: string;
  taskId: { _id: string; title: string } | string;
  bidId: { _id: string } | string;
  amount: number;
  status: string;
  screenshotUrl?: string;
  paymentMethod?: string;
  paymentReference?: string;
  createdAt?: string;
};

const BACKEND_URL = 'https://skillfoundri-urbancare-services-production.up.railway.app';

const App: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'payment_required' | 'payment_submitted'>('all');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${BACKEND_URL}/api/admin/payments/pending`);
      const json = await resp.json();
      if (json.success) setPayments(json.data);
      else setError(json.error?.message || 'Failed to load');
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return payments;
    return payments.filter(p => p.status === filter);
  }, [payments, filter]);

  const verify = async (paymentId: string, action: 'approve' | 'reject') => {
    try {
      const resp = await fetch(`${BACKEND_URL}/api/admin/payments/${paymentId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const json = await resp.json();
      if (json.success) {
        await load();
      } else {
        alert(json.error?.message || 'Failed');
      }
    } catch (e) {
      alert('Network error');
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, Arial, sans-serif', padding: 20, maxWidth: 1000, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>TaskFoundri Admin</h1>
        <button onClick={load} style={{ padding: '8px 12px' }}>Refresh</button>
      </header>

      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        {(['all','payment_required','payment_submitted'] as const).map(k => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #ddd',
              background: filter === k ? '#f3f4f6' : '#fff'
            }}
          >{k.replace('_',' ')}</button>
        ))}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
        {filtered.map(p => (
          <div key={p._id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{typeof p.taskId === 'object' ? p.taskId.title : String(p.taskId)}</div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>Amount: ₱{p.amount} • Status: {p.status}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => verify(p._id, 'approve')} style={{ padding: '6px 10px', background: '#10B981', color: 'white', borderRadius: 6, border: 0 }}>Approve</button>
                <button onClick={() => verify(p._id, 'reject')} style={{ padding: '6px 10px', background: '#EF4444', color: 'white', borderRadius: 6, border: 0 }}>Reject</button>
              </div>
            </div>
            {p.screenshotUrl && (
              <div style={{ marginTop: 12 }}>
                <img src={p.screenshotUrl} alt="receipt" style={{ maxWidth: '100%', borderRadius: 8, border: '1px solid #e5e7eb' }} />
              </div>
            )}
            {(p.paymentMethod || p.paymentReference) && (
              <div style={{ marginTop: 8, color: '#374151', fontSize: 14 }}>
                {p.paymentMethod && <div>Method: {p.paymentMethod}</div>}
                {p.paymentReference && <div>Reference: {p.paymentReference}</div>}
              </div>
            )}
          </div>
        ))}
        {(!loading && filtered.length === 0) && <p>No pending payments.</p>}
      </div>
    </div>
  );
};

export default App;



