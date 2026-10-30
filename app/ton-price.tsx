import TonPill from "./ton-pill";

// tonapi marks this feed display-only, which is all the lander needs.
const CHART_URL = "https://tonapi.io/v2/rates/chart?token=ton&currency=usd";
const WINDOW = 24 * 60 * 60;
const TTL = 5 * 60;
// Drawing box in px. PAD keeps the extremes off the edges so the stroke's round turns stay round.
const W = 64;
const H = 20;
const PAD = 2;

type Chart = { points?: [number, number][] };

// Last 24h of TON/USD, oldest first, every point kept: the curve below gets smoother with more, not rougher.
async function history(): Promise<number[] | null> {
  // Snap the range to the TTL so the URL, and therefore the edge cache key, holds still for five minutes.
  const end = Math.floor(Date.now() / 1000 / TTL) * TTL;
  const url = `${CHART_URL}&start_date=${end - WINDOW}&end_date=${end}`;
  try {
    // Edge cache, not Next's data cache: OpenNext has no store for the latter, so it would refetch per request.
    const res = await fetch(url, { cf: { cacheTtl: TTL, cacheEverything: true } });
    if (!res.ok) {
      // The pill just drops out, so without this a bad upstream would vanish silently.
      console.error("ton price: upstream", res.status);
      return null;
    }
    const points = ((await res.json()) as Chart).points;
    if (!points || points.length < 2) return null;
    // tonapi returns newest first.
    return points.map(([, usd]) => usd).reverse();
  } catch (err) {
    console.error("ton price: fetch failed", err);
    return null;
  }
}

// Scale prices into the box. A flat day sits at mid-height instead of dividing by zero.
function scale(prices: number[]): [number, number][] {
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const span = max - min;
  const last = prices.length - 1;
  return prices.map((p, i) => [(i / last) * W, span ? PAD + (1 - (p - min) / span) * (H - 2 * PAD) : H / 2]);
}

// Fritsch-Carlson tangents, as d3's curveMonotoneX: every turn rounded, never overshooting the data.
function tangents(pts: [number, number][]): number[] {
  const n = pts.length;
  const sign = (v: number) => (v < 0 ? -1 : v > 0 ? 1 : 0);
  const m = new Array<number>(n);
  for (let i = 1; i < n - 1; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const h0 = x1 - x0;
    const h1 = x2 - x1;
    const s0 = (y1 - y0) / h0;
    const s1 = (y2 - y1) / h1;
    const p = (s0 * h1 + s1 * h0) / (h0 + h1);
    m[i] = (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
  }
  // Ends: one-sided slopes, pulled toward the neighbour's tangent.
  const end = (a: [number, number], b: [number, number], t: number) => (3 * (b[1] - a[1])) / (b[0] - a[0]) / 2 - t / 2;
  m[0] = end(pts[0], pts[1], m[1]);
  m[n - 1] = end(pts[n - 2], pts[n - 1], m[n - 2]);
  return m;
}

function path(prices: number[]): string {
  const pts = scale(prices);
  const m = tangents(pts);
  const f = (v: number) => v.toFixed(2);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    const dx = (x1 - x0) / 3;
    d += `C${f(x0 + dx)} ${f(y0 + dx * m[i])} ${f(x1 - dx)} ${f(y1 - dx * m[i + 1])} ${f(x1)} ${f(y1)}`;
  }
  return d;
}

// Fetches on the server, hands the drawn curve and the spot price to the client pill. Drops out on failure.
export default async function TonPrice() {
  const prices = await history();
  if (!prices) return null;

  return <TonPill path={path(prices)} price={`$${prices[prices.length - 1].toFixed(2)}`} width={W} height={H} />;
}
