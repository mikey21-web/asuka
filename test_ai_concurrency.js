/* eslint-disable no-console */
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const ROUNDS = [3, 6, 10, 15];
const REQUEST_TIMEOUT_MS = 45000;

function percentile(values, p) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

async function timedFetch(url, options = {}) {
  const start = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    const elapsed = Date.now() - start;
    return { ok: res.ok, status: res.status, elapsed };
  } catch (error) {
    const elapsed = Date.now() - start;
    return { ok: false, status: 0, elapsed, error: error instanceof Error ? error.message : String(error) };
  } finally {
    clearTimeout(timeout);
  }
}

function makeStylistPayload(i) {
  return {
    message: `I need a wedding guest look in Delhi. Keep it elegant and modern. Request ${i}`,
    session_id: `loadtest-${Date.now()}-${i}`,
  };
}

function makeMiyPayload(i) {
  return {
    inputs: {
      occasion: 'Wedding Guest',
      location: 'Indoor',
      city: 'Delhi',
      time: 'Night',
      vibe: 60,
      colors: 'Navy, Ivory',
      avoidColors: 'Yellow',
      budget: '₹50k - ₹1L',
      fit: 'Slim Tailored',
    },
    message: `Suggest 2 premium design directions for a reception. Request ${i}`,
    history: [],
  };
}

async function runRound(concurrency) {
  const tasks = [];
  for (let i = 0; i < concurrency; i += 1) {
    const useStylist = i % 2 === 0;
    const url = useStylist ? `${BASE_URL}/api/stylist` : `${BASE_URL}/api/miy-chat`;
    const payload = useStylist ? makeStylistPayload(i) : makeMiyPayload(i);
    tasks.push(
      timedFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    );
  }

  const results = await Promise.all(tasks);
  const latencies = results.map((r) => r.elapsed);
  const success = results.filter((r) => r.ok).length;
  const fail = results.length - success;

  return {
    concurrency,
    total: results.length,
    success,
    fail,
    successRate: Number(((success / results.length) * 100).toFixed(1)),
    p50: percentile(latencies, 50),
    p95: percentile(latencies, 95),
    p99: percentile(latencies, 99),
    max: Math.max(...latencies),
  };
}

(async () => {
  console.log(`Running AI concurrency test against ${BASE_URL}`);
  const summaries = [];

  for (const c of ROUNDS) {
    console.log(`\n--- Round: ${c} concurrent requests ---`);
    const summary = await runRound(c);
    summaries.push(summary);
    console.log(summary);

    if (summary.successRate < 90) {
      console.log('Stopping early because success rate dropped below 90%.');
      break;
    }
  }

  const last = summaries[summaries.length - 1];
  console.log('\n=== Final Summary ===');
  console.log(JSON.stringify({ rounds: summaries, recommendedStableConcurrent: last ? last.concurrency : 0 }, null, 2));
})();
