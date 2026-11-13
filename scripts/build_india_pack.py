"""Rebuild the private India research pack with today's prices.

    python3 scripts/build_india_pack.py            # from the portfolio folder

Reads ../PRIVATE/india-notes.json (the full Indian notes), fetches the latest Ledger
prices, and writes:
    ../PRIVATE/India Research Pack/India_Research_Pack.html
    ../PRIVATE/India Research Pack/India_Research_Pack.pdf   (if Google Chrome is installed)
The PDFs and Excel models sit beside it in files/. Upload the refreshed
India_Research_Pack.pdf to the private Google Drive folder "India Research Pack (private)"
(replace the old one: right-click it in Drive > File information > Manage versions).
Nothing in ../PRIVATE is ever published by this script.
"""
import datetime, html, json, os, re, subprocess, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
PRIV = os.path.normpath(os.path.join(HERE, "..", "..", "PRIVATE"))
PACK = os.path.join(PRIV, "India Research Pack")
LEDGER = "https://debjitmukherjee1.github.io/ledger/data/calls.json"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"


def nice(iso):
    t = datetime.date.fromisoformat(iso)
    return f"{t.day} {t.strftime('%b')} {t.year}"


def pct(v):
    return ("+" if v > 0 else "−" if v < 0 else "") + f"{abs(v):.1f}%"


def tk_of(title):
    m = re.search(r"\(([A-Z0-9.&-]+)\)", title)
    return m.group(1) if m else None


def main():
    d = json.load(open(os.path.join(PRIV, "india-notes.json")))
    try:
        live = json.load(urllib.request.urlopen(LEDGER, timeout=20))
        calls = [{k: v for k, v in c.items() if k != "series"} for c in live["calls"] if c["market"] == "India"]
        snapshot = live["updated_at"]
        d["calls"], d["snapshot"] = calls, snapshot      # keep the private store current too
        json.dump(d, open(os.path.join(PRIV, "india-notes.json"), "w"), indent=2, ensure_ascii=False)
    except Exception as e:                                # offline: use the last saved prices
        print("Ledger unavailable, using saved prices:", e)
        calls, snapshot = d["calls"], d["snapshot"]
    notes = d["notes"]
    latest = {}
    for c in calls:
        if c["ticker"] not in latest or c["call_date"] > latest[c["ticker"]]["call_date"]:
            latest[c["ticker"]] = c

    rows = "".join(
        f"<tr><td><b>{html.escape(c['ticker'])}</b><br><small>{html.escape(c['company'])}</small></td><td>{nice(c['call_date'])}</td>"
        f"<td>{html.escape(c['rating'])}</td><td>₹{c['target']:,}</td><td>₹{c['price_at_call']:,}</td><td>₹{c['live_price']:,}</td>"
        f"<td class='{'up' if c['return_pct'] >= 0 else 'dn'}'>{pct(c['return_pct'])}</td><td>{pct(c['benchmark_return_pct'])}</td>"
        f"<td class='{'up' if (c.get('signed_alpha') or 0) >= 0 else 'dn'}'>{pct(c['signed_alpha']) if c.get('direction') else '—'}</td><td>{html.escape(c['status'])}</td></tr>"
        for c in sorted(calls, key=lambda c: c["call_date"]))
    secs = []
    for n in notes:
        c = latest.get(tk_of(n["title"]))
        files = ", ".join(os.path.basename(n[k]) for k in ("fileUrl", "fileUrl2") if n.get(k))
        secs.append(
            f"<section><p class='k'>{html.escape(n['sector'])} · {html.escape(n['date'])}"
            f"{' · called ' + nice(c['call_date']) + ' at ₹' + format(c['price_at_call'], ',') if c else ''} · public from {nice(n['revealAfter'])}</p>"
            f"<h2>{html.escape(n['title'])}</h2><p class='r'><span>{html.escape(n['rating'])}</span> Target {html.escape(n['targetPrice'])}</p>"
            f"<p class='t'>{html.escape(n['thesis'])}</p><p>{html.escape(n['detail'])}</p>"
            f"<p class='f'>Full report and model in this folder: {html.escape(files)}</p></section>")
    page = f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Debjit Mukherjee — India research pack (private)</title>
<style>
body{{margin:0;font:14.5px/1.6 -apple-system,"Segoe UI",Helvetica,Arial,sans-serif;color:#141414;background:#fff}}
main{{max-width:980px;margin:0 auto;padding:44px 24px 70px}} h1{{font:600 32px/1.1 Georgia,serif;margin:0 0 6px}} h2{{font:600 21px/1.25 Georgia,serif;margin:6px 0}}
.note{{border:1px solid #ddd;border-radius:10px;padding:13px 15px;background:#fafafa;font-size:13px;color:#444}} .k{{font-size:11.5px;color:#666;text-transform:uppercase;letter-spacing:.06em;margin:0}}
table{{width:100%;border-collapse:collapse;font-size:12.5px;margin:16px 0 8px}} th,td{{text-align:left;padding:7px 6px;border-bottom:1px solid #e5e5e5;vertical-align:top}} th{{font-size:10.5px;color:#666;text-transform:uppercase;letter-spacing:.05em}}
td small{{color:#777}} .up{{color:#16794a}} .dn{{color:#b3261e}} section{{border-top:1px solid #e5e5e5;padding:22px 0;break-inside:avoid}}
.r span{{display:inline-block;border:1px solid #141414;border-radius:20px;padding:1px 10px;font-size:12px;font-weight:600;margin-right:8px}}
.t{{font:16.5px/1.45 Georgia,serif;color:#222}} .f{{font-size:12px;color:#555}} .scroll{{overflow-x:auto}} @page{{margin:14mm}}
</style></head><body><main>
<p class="k">Shared privately with prospective employers · prices as of {html.escape(snapshot)}</p><h1>India research pack</h1>
<p>Debjit Mukherjee · B.Com (Honours &amp; Research), Amity University Kolkata</p>
<p class="note">This pack is shared one-to-one with recruiters and employers who ask to see my Indian coverage. Please do not redistribute it. It is student work from public filings, not investment advice or a recommendation to buy, sell or hold any security, and I am not registered with SEBI as a research analyst. On my public site these notes appear as valuation notes without ratings or targets, and each is published in full once its 12-month horizon ends.</p>
<h2 style="margin-top:30px">Track record: Indian calls</h2>
<p class="k">Prices from Ledger · Nifty 50 as the benchmark · excess return signed for the direction of the call (HOLD shows —)</p>
<div class="scroll"><table><thead><tr><th>Company</th><th>Called</th><th>Rating</th><th>Target</th><th>Price then</th><th>Price now</th><th>Return</th><th>Nifty 50</th><th>Excess</th><th>Status</th></tr></thead><tbody>{rows}</tbody></table></div>
<p class="k">Targets are 12-month; calls under a year old are early readings, not a verdict.</p>
{''.join(secs)}
</main></body></html>"""
    out = os.path.join(PACK, "India_Research_Pack.html")
    open(out, "w").write(page)
    print("Wrote", out)
    if os.path.exists(CHROME):
        pdf = os.path.join(PACK, "India_Research_Pack.pdf")
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--print-to-pdf=" + pdf,
                        "--user-data-dir=" + os.path.join(PRIV, ".chrome-pdf"), "file://" + out],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=120)
        print("Wrote", pdf)


if __name__ == "__main__":
    main()
