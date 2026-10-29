import TonPill from "./ton-pill";

// tonapi marks this feed display-only, which is all the lander needs.
const CHART_URL = "https://tonapi.io/v2/rates/chart?token=ton&currency=usd";
const WINDOW = 24 * 60 * 60;
const TTL = 5 * 60;
// Drawing box in px; the pill's 36px row leaves 20px of line once padded.
const W = 64;
const H = 20;
const PAD = 1;
const MAX_POINTS = 48;

type Chart = { points?: [number, number][] };

// Last 24h of TON/USD, oldest first. Null on any failure so the pill can drop out.
async function history(): Promise<number[] | null> {
  // Snap the range to the TTL so the URL, and therefore the edge cache key, holds still for five minutes.
  const end = Math.floor(Date.now() / 1000 / TTL) * TTL;
  const url = `${CHART_URL}&start_date=${end - WINDOW}&end_date=${end}`;
  try {
    // Edge cache, not Next's data cache: OpenNext has no store for the latter, so it would refetch per request.
    const res = await fetch(url, { cf: { cacheTtl: TTL, cacheEverything: true } });
    if (!res.ok) return null;
    const points = ((await res.json()) as Chart).points;
    if (!points || points.length < 2) return null;
    // tonapi returns newest first; thin to ~48 points so the markup stays small.
    const step = Math.ceil(points.length / MAX_POINTS);
    return points
      .filter((_, i) => i % step === 0)
      .reverse()
      .map(([, usd]) => usd);
  } catch {
    return null;
  }
}

// Scale prices into the box. A flat day sits at mid-height instead of dividing by zero.
function polyline(prices: number[]): string {
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const span = max - min;
  const last = prices.length - 1;
  return prices
    .map((p, i) => {
      const x = (i / last) * W;
      const y = span ? PAD + (1 - (p - min) / span) * (H - 2 * PAD) : H / 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

// Fetches on the server, hands the drawn line and the spot price to the client pill. Drops out on failure.
export default async function TonPrice() {
  const prices = await history();
  if (!prices) return null;

  return <TonPill points={polyline(prices)} price={`$${prices[prices.length - 1].toFixed(2)}`} width={W} height={H} />;
}
