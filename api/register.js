export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ok: false});
  }
  let data;
  try { data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; }
  catch { return res.status(400).json({ok: false}); }
  const name = typeof data?.name === 'string' ? data.name.trim() : '';
  const phone = typeof data?.phone === 'string' ? data.phone.replace(/[\s()-]/g, '') : '';
  if (name.length < 2 || name.length > 80 || !/^\+?\d{9,15}$/.test(phone)) return res.status(400).json({ok: false});
  const requestId = typeof data?.requestId === 'string' ? data.requestId : '';
  if (!/^[a-zA-Z0-9-]{16,80}$/.test(requestId)) return res.status(400).json({ok: false});
  const endpoint = process.env.LEAD_WEBHOOK_URL;
  const token = process.env.LEAD_WEBHOOK_TOKEN;
  if (!endpoint || !token) return res.status(503).json({ok: false});
  try {
    if (new URL(endpoint).protocol !== 'https:') return res.status(503).json({ok: false});
    const response = await fetch(endpoint, {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, phone, variant: '02', requestId, token}),
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) return res.status(502).json({ok: false});
    const result = await response.json();
    if (result.ok !== true) return res.status(502).json({ok: false});
    return res.status(200).json({ok: true});
  } catch { return res.status(502).json({ok: false}); }
}
