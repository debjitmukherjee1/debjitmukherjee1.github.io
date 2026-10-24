"""Refresh data/deal-tracker.json: latest close, spread, annualised spread and
risk-neutral implied probability of closing for each pending deal in data/deal-tracker-config.json.

Standard library only (runs on a bare GitHub Actions runner). Prices come from
the Yahoo Finance chart endpoint, the same source Ledger uses. If a fetch fails
the previous deal entry is kept, so the page never shows a blank or a zero.
"""
import json, math, os, sys, urllib.request
from datetime import date, datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CFG = os.path.join(ROOT, "data", "deal-tracker-config.json")
OUT = os.path.join(ROOT, "data", "deal-tracker.json")
CHART = "https://query1.finance.yahoo.com/v8/finance/chart/{sym}?range=1mo&interval=1d"


def last_close(sym):
    req = urllib.request.Request(CHART.format(sym=urllib.request.quote(sym)), headers={"User-Agent": "Mozilla/5.0 (deal tracker)"})
    with urllib.request.urlopen(req, timeout=20) as r:
        res = json.load(r)["chart"]["result"][0]
    pts = [(t, c) for t, c in zip(res["timestamp"], res["indicators"]["quote"][0]["close"]) if c is not None]
    t, c = pts[-1]
    return round(float(c), 4), datetime.fromtimestamp(t, tz=timezone.utc).date()


def quarters_between(a, b):
    """Quarterly dividends expected between two dates (one per ~91 days, at least 0)."""
    return max(0, math.floor((b - a).days / 91.25))


def main():
    cfg = json.load(open(CFG))
    prev = json.load(open(OUT)) if os.path.exists(OUT) else {"deals": {}}
    out = {"updated_at": datetime.now(timezone.utc).strftime("%d %b %Y %H:%M UTC"), "deals": {}}
    try:
        bench, _ = last_close(cfg["benchmark"])
    except Exception as e:  # keep yesterday's numbers rather than publish nothing
        print("benchmark fetch failed:", e, file=sys.stderr); bench = None
    try:  # 13-week T-bill yield, quoted in percent (^IRX)
        rf = last_close(cfg.get("rate_symbol", "^IRX"))[0] / 100
    except Exception as e:
        print("T-bill fetch failed:", e, file=sys.stderr); rf = cfg.get("risk_free_fallback", 0.04)
    out["risk_free"] = round(rf, 6)
    failed = 0
    for key, d in cfg["deals"].items():
        try:
            px, as_of = last_close(d["ticker"])
            close = date.fromisoformat(d["expected_close"])
            divs = d.get("dividend_per_quarter", 0) * max(1, quarters_between(as_of, close)) if close > as_of else 0
            gross = (d["offer"] + divs - px) / px
            days = max(1, (close - as_of).days)
            ann = (1 + gross) ** (365 / days) - 1
            ratio = bench / d["benchmark_at_unaffected"] if bench else 1.0
            brk = d["unaffected_price"] * ratio
            # risk-neutral: today's price carried at the T-bill rate to the close sits between the break price and the offer
            prob = (px * (1 + rf * days / 365) - brk) / (d["offer"] + divs - brk)
            out["deals"][key] = {"ticker": d["ticker"], "price": px, "as_of": as_of.isoformat(), "offer": d["offer"], "dividends_expected": round(divs, 4),
                                 "expected_close": d["expected_close"], "gross_spread": round(gross, 6), "days_to_close": days, "annualised": round(ann, 6),
                                 "break_price": round(brk, 4), "implied_prob": round(max(0.0, min(1.0, prob)), 6)}
        except Exception as e:
            failed += 1
            print(f"{key}: fetch failed ({e}); keeping previous entry", file=sys.stderr)
            if key in prev.get("deals", {}): out["deals"][key] = prev["deals"][key]
    json.dump(out, open(OUT, "w"), indent=2)
    print(json.dumps(out, indent=2))
    return 1 if failed and not out["deals"] else 0


if __name__ == "__main__":
    sys.exit(main())
