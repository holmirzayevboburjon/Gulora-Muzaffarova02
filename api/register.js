export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const fail = (status, code) => {
    console.error('Registration failed:', code);
    return res.status(status).json({ok: false, code});
  };
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
  if (!endpoint || !token) return fail(503, 'WEBHOOK_CONFIG_MISSING');
  try {
    if (new URL(endpoint).protocol !== 'https:') return fail(503, 'WEBHOOK_URL_INVALID');
    const response = await fetch(endpoint, {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, phone, variant: '02', requestId, token}),
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) return fail(502, 'WEBHOOK_HTTP_' + response.status);
    let result;
    try { result = await response.json(); }
    catch { return fail(502, 'WEBHOOK_NON_JSON_RESPONSE'); }
    if (result.ok !== true) return fail(502, 'WEBHOOK_REJECTED');
    return res.status(200).json({ok: true});
  } catch (error) {
    return fail(502, error?.name === 'TimeoutError' ? 'WEBHOOK_TIMEOUT' : 'WEBHOOK_CONNECTION_ERROR');
  }
}
