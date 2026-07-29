module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { numbers } = req.body || {};
  const isValid =
    Array.isArray(numbers) &&
    numbers.length === 6 &&
    numbers.every((n) => Number.isInteger(n) && n >= 1 && n <= 45);

  if (!isValid) {
    res.status(400).json({ error: 'Invalid numbers' });
    return;
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    res.status(500).json({ error: 'Server not configured' });
    return;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/lotto_draws`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ numbers }),
    });

    if (!response.ok) {
      const detail = await response.text();
      res.status(502).json({ error: 'Supabase insert failed', detail });
      return;
    }

    const data = await response.json();
    res.status(200).json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ error: 'Unexpected error', detail: String(err) });
  }
};
