/* ============================================================================
   lab.js — the Workbench (lab.html): six calculators, computed in the browser.
   ----------------------------------------------------------------------------
   Each tool is one entry in TOOLS: its input fields and a calc() that returns
   the output HTML. Nothing is sent anywhere. Deep links: lab#lbo opens a tab;
   lab#arb?offer=14&price=13.89 also pre-fills fields (used by the deal tracker).
   The card text on the Tools page comes from `workbench:` in data.js.
   ========================================================================== */
(function () {
  "use strict";
  var host = document.getElementById("lab"); if (!host) return;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function f(v, dp) { return isFinite(v) ? v.toLocaleString("en-US", { minimumFractionDigits: dp || 0, maximumFractionDigits: dp || 0 }) : "—"; }
  function p(v, dp) { return isFinite(v) ? (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v * 100).toFixed(dp == null ? 1 : dp) + "%" : "—"; }
  function pu(v, dp) { return isFinite(v) ? (v * 100).toFixed(dp == null ? 1 : dp) + "%" : "—"; }
  function heat(v, lo, hi, mid) {
    if (!isFinite(v)) return "";
    var t = v >= mid ? Math.min(1, (v - mid) / ((hi - mid) || 1)) : -Math.min(1, (mid - v) / ((mid - lo) || 1));
    return "background:color-mix(in srgb, var(" + (t >= 0 ? "--pos" : "--neg") + ") " + Math.round(Math.abs(t) * 46) + "%, var(--bg))";
  }
  function sens(rowLabel, colLabel, rows, cols, fn, fmt, mid, baseR, baseC) {
    var vals = rows.map(function (r) { return cols.map(function (c) { return fn(r.v, c.v); }); });
    var flat = [].concat.apply([], vals).filter(isFinite), lo = Math.min.apply(0, flat), hi = Math.max.apply(0, flat);
    return '<div class="scroll-x"><table class="sens"><thead><tr><th></th>' + cols.map(function (c) { return "<th>" + esc(c.l) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      rows.map(function (r, i) { return "<tr><th>" + esc(r.l) + "</th>" + vals[i].map(function (v, j) { return '<td class="' + (i === baseR && j === baseC ? "base" : "") + '" style="' + heat(v, lo, hi, mid == null ? (lo + hi) / 2 : mid) + '">' + fmt(v) + "</td>"; }).join("") + "</tr>"; }).join("") +
      '</tbody></table></div><p class="sens-cap">Rows: ' + esc(rowLabel) + " · Columns: " + esc(colLabel) + " · outlined cell = your inputs</p>";
  }
  function hero(items) { return '<div class="out-hero">' + items.map(function (x) { return '<div class="' + (x[2] || "") + '"><small>' + esc(x[0]) + "</small><b>" + x[1] + "</b></div>"; }).join("") + "</div>"; }
  function err(msg) { return '<div class="verdict">' + esc(msg) + "</div>"; }

  /* ---------- models ---------------------------------------------------- */
  function rdcfSolve(v, wacc, margin) {
    var ev = v.price * v.shares + v.netDebt, w = wacc / 100, tg = v.tg / 100, m = margin / 100, N = Math.max(1, Math.round(v.years));
    if (w <= tg || ev <= 0 || m <= 0) return NaN;
    function val(g) { var s = 0, r = v.rev, fc = 0; for (var t = 1; t <= N; t++) { r *= 1 + g; fc = r * m; s += fc / Math.pow(1 + w, t); } return s + fc * (1 + tg) / (w - tg) / Math.pow(1 + w, N); }
    var a = -.6, b = 2; if (val(a) > ev || val(b) < ev) return NaN;
    for (var i = 0; i < 60; i++) { var mid = (a + b) / 2; if (val(mid) > ev) b = mid; else a = mid; }
    return (a + b) / 2;
  }
  function lboRun(v, entry, exit) {
    var N = Math.max(1, Math.min(10, Math.round(v.years))), E = v.ebitda, ev0 = E * entry, debt0 = E * v.lev, eq0 = ev0 - debt0, debt = debt0, cash = 0, rows = [];
    if (eq0 <= 0) return null;
    rows.push({ y: 0, E: E, debt: debt });
    for (var t = 1; t <= N; t++) {
      E *= 1 + v.growth / 100;
      var int = debt * v.rate / 100, da = E * v.da / 100, tax = Math.max(0, E - da - int) * v.tax / 100, capex = E * v.capex / 100, fcf = E - int - tax - capex;
      var pay = Math.min(debt, Math.max(fcf, -1e12)); debt -= pay; if (debt < 0) debt = 0; cash += fcf - pay;
      rows.push({ y: t, E: E, int: int, tax: tax, capex: capex, fcf: fcf, debt: debt, cash: cash });
    }
    var evN = E * exit, eqN = evN - debt + cash;
    return { rows: rows, eq0: eq0, eqN: eqN, ev0: ev0, evN: evN, debt0: debt0, moic: eqN / eq0, irr: eqN > 0 ? Math.pow(eqN / eq0, 1 / N) - 1 : NaN,
      bridge: [(E - v.ebitda) * entry, (exit - entry) * E, debt0 - debt + cash], N: N };
  }
  function mergerRun(v, prem, stockPct) {
    var offer = v.tPrice * (1 + prem / 100), value = offer * v.tShares, stockVal = value * stockPct / 100, newSh = stockVal / v.aPrice, debt = value - stockVal, t = v.tax / 100;
    var pfNI = v.aNI + v.tNI + v.syn * (1 - t) - debt * v.rate / 100 * (1 - t), sh = v.aShares + newSh, eps0 = v.aNI / v.aShares, eps1 = pfNI / sh;
    return { offer: offer, value: value, newSh: newSh, debt: debt, eps0: eps0, eps1: eps1, acc: eps1 / eps0 - 1, own: newSh / sh,
      be: (eps0 * sh - v.aNI - v.tNI + debt * v.rate / 100 * (1 - t)) / (1 - t), pea: v.aPrice / eps0, pet: value / v.tNI };
  }
  function arbRun(v, price, days) {
    var tot = v.offer + v.div, gross = (tot - price) / price, d = Math.max(1, days);
    return { gross: gross, ann: Math.pow(1 + gross, 365 / d) - 1, prob: (price * (1 + v.rf / 100 * d / 365) - v.brk) / (tot - v.brk), down: v.brk / price - 1 };
  }

  var TOOLS = [
    { id: "rdcf", n: "Priced In", tag: "Reverse DCF", h: "What growth is the price <em>already paying for?</em>",
      blurb: "A DCF asks what a business is worth. This runs it backwards: given today's price, it solves for the revenue growth the market must be assuming. If the answer is a rate the company has never held, that is the call.",
      fields: [["price", "Share price", 180, "$"], ["shares", "Shares outstanding", 2400, "m"], ["netDebt", "Net debt (negative = net cash)", 12000, "$m"], ["rev", "Revenue, last twelve months", 60000, "$m"], ["margin", "Free-cash-flow margin, steady state", 22, "%"], ["wacc", "Discount rate (WACC)", 9, "%"], ["tg", "Terminal growth", 3, "%"], ["years", "Forecast years", 10, "yrs"]],
      calc: function (v) {
        var g = rdcfSolve(v, v.wacc, v.margin);
        if (v.wacc <= v.tg) return err("The discount rate has to sit above terminal growth, or the terminal value is infinite.");
        if (!isFinite(g)) return err("No growth rate between −60% and +200% a year reconciles these inputs with the price. Check the margin and the share count.");
        var N = Math.round(v.years), ev = v.price * v.shares + v.netDebt, revN = v.rev * Math.pow(1 + g, N), w = v.wacc / 100, tg = v.tg / 100, tv = revN * v.margin / 100 * (1 + tg) / (w - tg) / Math.pow(1 + w, N);
        return hero([["Implied revenue growth", p(g) + "<small style='font-size:.35em'> a year</small>", "hl"], ["Enterprise value today", "$" + f(ev / 1000, 1) + "bn"], ["Revenue in year " + N, f(revN / v.rev, 1) + "× today"], ["Value from the terminal year", pu(tv / ev, 0)]]) +
          '<div class="verdict">At $' + f(v.price, 2) + " the market is paying for revenue to grow <em>" + pu(g) + " a year for " + N + " years</em> at a " + f(v.margin, 0) + "% free-cash-flow margin. That takes revenue from $" + f(v.rev / 1000, 1) + "bn to $" + f(revN / 1000, 1) + "bn. " + pu(tv / ev, 0) + " of today's value sits beyond year " + N + ".</div>" +
          '<div class="panel"><h3>Implied growth, by discount rate and margin</h3>' + sens("discount rate", "free-cash-flow margin",
            [-1, 0, 1].map(function (d) { return { v: v.wacc + d, l: (v.wacc + d).toFixed(1) + "%" }; }), [-6, -3, 0, 3, 6].map(function (d) { return { v: v.margin + d, l: (v.margin + d) + "%" }; }),
            function (a, b) { return rdcfSolve(v, a, b); }, function (x) { return isFinite(x) ? pu(x) : "n/a"; }, g, 1, 2) + "</div>";
      }, note: "Free cash flow is modelled as a constant share of revenue and discounted at year end; the terminal value is a Gordon growth perpetuity. A deliberately blunt instrument: it tells you what the price assumes, not what the company is worth." },

    { id: "lbo", n: "Paper LBO", tag: "Leveraged buyout", h: "Five inputs, one sweep, <em>an IRR.</em>",
      blurb: "The back-of-envelope buyout every banking interview asks for, done properly: buy at a multiple, lever it, sweep all free cash to debt, sell at a multiple. Shows where the return actually came from.",
      fields: [["ebitda", "EBITDA, last twelve months", 100, "$m"], ["entry", "Entry multiple", 10, "× EBITDA"], ["lev", "Debt at entry", 5, "× EBITDA"], ["rate", "Interest rate on debt", 9, "%"], ["growth", "EBITDA growth", 6, "% a yr"], ["da", "D&A", 20, "% EBITDA"], ["capex", "Capex + working capital", 15, "% EBITDA"], ["tax", "Tax rate", 25, "%"], ["exit", "Exit multiple", 10, "× EBITDA"], ["years", "Holding period", 5, "yrs"]],
      calc: function (v) {
        var r = lboRun(v, v.entry, v.exit);
        if (!r) return err("Debt at entry is at or above the purchase price, so there is no equity cheque. Lower the leverage or raise the entry multiple.");
        var tot = r.bridge[0] + r.bridge[1] + r.bridge[2], names = ["EBITDA growth", "Multiple change", "Debt paydown"], cols = ["var(--accent-text)", "var(--ink-2)", "var(--pos)"];
        var bridge = '<div class="bridge">' + r.bridge.map(function (b, i) { return b > 0 && tot > 0 ? '<span style="flex:' + b + ";background:" + cols[i] + ';color:var(--bg)">' + pu(b / tot, 0) + "</span>" : ""; }).join("") + '</div><p class="sens-cap">' + r.bridge.map(function (b, i) { return names[i] + " $" + f(b, 0) + "m"; }).join(" · ") + "</p>";
        var R = r.rows, row = function (label, k, cl, fn) { return '<tr class="' + (cl || "") + '"><td>' + label + "</td>" + R.map(function (x) { return "<td>" + (x[k] == null ? "" : (fn || function (n) { return f(n, 1); })(x[k], x)) + "</td>"; }).join("") + "</tr>"; };
        return hero([["Sponsor IRR", pu(r.irr), r.irr >= .2 ? "hl" : r.irr < .1 ? "bad" : ""], ["Money multiple", isFinite(r.moic) ? f(r.moic, 2) + "×" : "—"], ["Equity in", "$" + f(r.eq0, 0) + "m"], ["Equity out", "$" + f(r.eqN, 0) + "m"]]) +
          '<div class="verdict">Pay $' + f(r.ev0, 0) + "m, fund it with $" + f(r.debt0, 0) + "m of debt and a $" + f(r.eq0, 0) + "m cheque. After " + r.N + " years the equity is worth $" + f(r.eqN, 0) + "m: <em>" + (isFinite(r.moic) ? f(r.moic, 2) + "× and " + pu(r.irr) + " a year" : "wiped out") + "</em>. Leverage ends at " + f(R[R.length - 1].debt / R[R.length - 1].E, 1) + "× from " + f(v.lev, 1) + "×.</div>" +
          '<div class="panel" style="margin-bottom:16px"><h3>Where the return came from</h3>' + bridge + "</div>" +
          '<div class="panel" style="margin-bottom:16px"><h3>Debt schedule ($m)</h3><div class="scroll-x"><table class="sched"><thead><tr><th>Year</th>' + R.map(function (x) { return "<th>" + x.y + "</th>"; }).join("") + "</tr></thead><tbody>" +
          row("EBITDA", "E") + row("Interest", "int") + row("Tax", "tax") + row("Capex + working capital", "capex") + row("Free cash flow to debt", "fcf", "tot") + row("Debt outstanding", "debt") + row("Debt / EBITDA", "debt", "", function (n, x) { return f(n / x.E, 1) + "×"; }) + "</tbody></table></div></div>" +
          '<div class="panel"><h3>IRR, by entry and exit multiple</h3>' + sens("entry multiple", "exit multiple",
            [-1, 0, 1].map(function (d) { return { v: v.entry + d, l: (v.entry + d).toFixed(1) + "×" }; }), [-2, -1, 0, 1, 2].map(function (d) { return { v: v.exit + d, l: (v.exit + d).toFixed(1) + "×" }; }),
            function (a, b) { var x = lboRun(v, a, b); return x ? x.irr : NaN; }, function (x) { return isFinite(x) ? pu(x) : "n/a"; }, r.irr, 1, 2) + "</div>";
      }, note: "One tranche of debt, all free cash swept to repayment, no fees, no minimum cash, tax on EBITDA less D&A and interest. Good for intuition and interview maths; a real model adds tranches, covenants and a fee schedule." },

    { id: "merger", n: "Merger Math", tag: "Accretion / dilution", h: "Does the deal <em>earn its premium?</em>",
      blurb: "Pro-forma earnings per share for an acquirer buying a target with a mix of new shares and debt. It also solves for the synergies needed to break even, which is the number the Deal Decoded notes are built around.",
      fields: [["aPrice", "Acquirer share price", 50, "$"], ["aShares", "Acquirer shares", 1000, "m"], ["aNI", "Acquirer net income", 2500, "$m"], ["tPrice", "Target share price, unaffected", 20, "$"], ["tShares", "Target shares", 400, "m"], ["tNI", "Target net income", 500, "$m"], ["premium", "Premium offered", 30, "%"], ["stock", "Paid in acquirer stock", 50, "%"], ["rate", "Cost of new debt, pre-tax", 7, "%"], ["tax", "Tax rate", 25, "%"], ["syn", "Run-rate synergies, pre-tax", 150, "$m"]],
      calc: function (v) {
        var r = mergerRun(v, v.premium, v.stock);
        return hero([["EPS accretion", p(r.acc), r.acc >= 0 ? "hl" : "bad"], ["Pro-forma EPS", "$" + f(r.eps1, 2)], ["Standalone EPS", "$" + f(r.eps0, 2)], ["Break-even synergies", "$" + f(Math.max(0, r.be), 0) + "m"]]) +
          '<div class="verdict">A $' + f(r.offer, 2) + " offer values the target at $" + f(r.value, 0) + "m, " + f(r.pet, 1) + "× its earnings against the acquirer's own " + f(r.pea, 1) + "×. The deal is <em>" + (r.acc >= 0 ? p(r.acc) + " accretive" : pu(-r.acc) + " dilutive") + "</em> to EPS. " +
          (r.be > 0 ? "It needs $" + f(r.be, 0) + "m of synergies to break even, " + (v.syn > 0 ? pu(r.be / v.syn, 0) + " of the $" + f(v.syn, 0) + "m assumed." : "and none are assumed.") : "It is accretive before any synergies.") + " Target holders end up with " + pu(r.own) + " of the combined company; new debt is $" + f(r.debt, 0) + "m.</div>" +
          '<div class="panel"><h3>EPS accretion, by premium and stock mix</h3>' + sens("premium offered", "share of the price paid in stock",
            [-10, 0, 10, 20].map(function (d) { return { v: v.premium + d, l: (v.premium + d) + "%" }; }), [0, 25, 50, 75, 100].map(function (s) { return { v: s, l: s + "% stock" }; }),
            function (a, b) { return mergerRun(v, a, b).acc; }, function (x) { return p(x); }, 0, 1, [0, 25, 50, 75, 100].indexOf(v.stock)) + "</div>";
      }, note: "Ignores purchase-accounting amortisation, fees and foregone interest on cash. EPS accretion is not value creation: a deal can add to EPS and still destroy value if the premium exceeds the present value of the synergies." },

    { id: "arb", n: "Spread", tag: "Merger arbitrage", h: "What is the market saying about <em>the odds of closing?</em>",
      blurb: "The gap between a target's price and its offer is the market's price for deal risk. This turns it into an annualised return and an implied probability of closing, using the same formulas as the live deal tracker.",
      fields: [["offer", "Offer price", 14, "$"], ["price", "Target price now", 13.89, "$"], ["div", "Dividends expected before close", 0.02, "$"], ["days", "Days to expected close", 76, "days"], ["brk", "Break price (if the deal fails)", 7.71, "$"], ["rf", "T-bill yield", 4.12, "%"]],
      calc: function (v) {
        if (v.offer + v.div <= v.brk) return err("The break price has to sit below the offer.");
        var r = arbRun(v, v.price, v.days);
        return hero([["Gross spread", p(r.gross, 2), "hl"], ["Annualised", pu(r.ann)], ["Implied odds of closing", pu(Math.max(0, Math.min(1, r.prob)), 0)], ["Loss if it breaks", p(r.down)]]) +
          '<div class="verdict">Buying at $' + f(v.price, 2) + " earns $" + f(v.offer + v.div - v.price, 2) + " a share if the deal closes in " + f(v.days, 0) + " days: <em>" + pu(r.ann) + " annualised</em>, against " + f(v.rf, 2) + "% on a T-bill. If it breaks, the stock falls to roughly $" + f(v.brk, 2) + ", a " + pu(-r.down, 0) + " loss. At this price the market is putting about " + pu(Math.max(0, Math.min(1, r.prob)), 0) + " on completion.</div>" +
          '<div class="panel"><h3>Implied odds of closing, by price and timing</h3>' + sens("target price", "days to close",
            [-1, -.5, 0, .1].map(function (d) { return { v: v.price + d, l: "$" + (v.price + d).toFixed(2) }; }), [30, 60, 90, 180, 365].map(function (d) { return { v: d, l: d + "d" }; }),
            function (a, b) { return arbRun(v, a, b).prob; }, function (x) { return pu(Math.max(0, Math.min(1, x)), 0); }, null, 2, -1) + "</div>";
      }, note: "Gross spread = (offer + dividends − price) ÷ price, compounded to a year. Implied odds (risk-neutral) = (price × (1 + T-bill yield × days ÷ 365) − break price) ÷ (offer + dividends − break price). The break price is an assumption. Informational only, not a recommendation to trade." },

    { id: "ff", n: "Football Field", tag: "Valuation summary", h: "Every method on <em>one page.</em>", custom: true,
      blurb: "The chart at the front of every pitch book: each valuation method as a range, the price drawn through them, and the weighted blend. Add your own methods and weights, then download the image.",
      note: "The blend is the weight-averaged midpoint of each range; give a method a weight of 0 to show it without counting it. Every published note on this site uses several methods and a stated blend for the same reason." },

    { id: "hurdle", n: "The Hurdle", tag: "Rating engine", h: "The rule that <em>sets every rating.</em>",
      blurb: "Ratings on this desk are set by expected total return against the local risk-free rate, not by feel. Enter a price and a fair value and it returns the rating, and the prices at which the rating would change.",
      fields: [["price", "Share price", 278.85, ""], ["fv", "Fair value", 288, ""], ["div", "Dividend yield", 5.2, "%"], ["rf", "10-year government yield", 7.21, "%"], ["ke", "Cost of equity", 11.78, "%"]],
      calc: function (v) {
        var tr = v.fv / v.price - 1 + v.div / 100, acc = v.rf / 100 + .02, ke = Math.max(v.ke / 100, acc), rating = tr < 0 ? "REDUCE" : tr < acc ? "HOLD" : tr < ke ? "ACCUMULATE" : "BUY";
        var flip = function (T) { return v.fv / (1 + T - v.div / 100); }, lo = -.2, hi = Math.max(ke + .12, tr + .04), pos = function (x) { return Math.max(0, Math.min(100, (x - lo) / (hi - lo) * 100)); };
        var seg = [["REDUCE", lo, 0, "var(--neg)", "#160603"], ["HOLD", 0, acc, "var(--bg-3)", "var(--ink-2)"], ["ACCUMULATE", acc, ke, "color-mix(in srgb, var(--accent) 45%, var(--bg-3))", "var(--ink)"], ["BUY", ke, hi, "var(--accent)", "var(--accent-ink)"]];
        var next = rating === "BUY" ? "It stays a BUY down to a fair value of " + f(v.price * (1 + ke - v.div / 100), 2) + "." : rating === "ACCUMULATE" ? "It becomes a BUY below " + f(flip(ke), 2) + " and a HOLD above " + f(flip(acc), 2) + "." : rating === "HOLD" ? "It becomes an ACCUMULATE below " + f(flip(acc), 2) + " and a REDUCE above " + f(flip(0), 2) + "." : "It becomes a HOLD below " + f(flip(0), 2) + ".";
        return hero([["Rating", rating, rating === "REDUCE" ? "bad" : rating === "HOLD" ? "" : "hl"], ["Expected total return", p(tr)], ["Accumulate hurdle", pu(acc, 2)], ["Buy hurdle", pu(ke, 2)]]) +
          '<div class="verdict">Fair value of ' + f(v.fv, 2) + " against a price of " + f(v.price, 2) + " is " + p(v.fv / v.price - 1) + "; add the " + f(v.div, 1) + "% dividend and the expected total return is <em>" + p(tr) + "</em>. " + next + "</div>" +
          '<div class="panel"><h3>Where the return sits on the band</h3><div class="gauge-wrap"><div class="gauge">' + seg.map(function (s) { return '<span style="flex:' + Math.max(.1, (s[2] - s[1]) * 1000).toFixed(1) + " 1 0;background:" + s[3] + ";color:" + s[4] + '">' + s[0] + "</span>"; }).join("") + '</div><div class="gauge-mark" style="left:' + pos(tr) + '%" data-v="' + p(tr) + '"></div><div class="gauge-ticks"><i style="left:' + pos(0) + '%">0%</i><i style="left:' + pos(acc) + '%;transform:translateX(-92%)">' + pu(acc) + '</i><i style="left:' + pos(ke) + '%;transform:translateX(-8%)">' + pu(ke) + "</i></div></div>" +
          '<div class="scroll-x"><table class="sched"><thead><tr><th>Rating</th><th>Expected total return</th><th>Price range today</th></tr></thead><tbody>' +
          "<tr><td>BUY</td><td>above " + pu(ke, 2) + " (cost of equity)</td><td>below " + f(flip(ke), 2) + "</td></tr><tr><td>ACCUMULATE</td><td>" + pu(acc, 2) + " to " + pu(ke, 2) + "</td><td>" + f(flip(ke), 2) + " to " + f(flip(acc), 2) + "</td></tr><tr><td>HOLD</td><td>0% to " + pu(acc, 2) + " (risk-free + 2 points)</td><td>" + f(flip(acc), 2) + " to " + f(flip(0), 2) + "</td></tr><tr><td>REDUCE</td><td>below 0%</td><td>above " + f(flip(0), 2) + "</td></tr></tbody></table></div></div>";
      }, note: "Pre-filled with the ITC note of 5 November 2026: fair value ₹288, price ₹278.85, a 5.2% yield and an 11.78% cost of equity, which is a HOLD sitting 0.7 points short of ACCUMULATE. The hurdles move with the bond yield, so a rating can change without the company doing anything." }
  ];

  /* ---------- shell ------------------------------------------------------ */
  var copy = {}; ((typeof siteData !== "undefined" && siteData.workbench) || []).forEach(function (w) { copy[w.id] = w; });
  host.innerHTML = '<div class="lab-tabs" role="tablist" aria-label="Calculators">' + TOOLS.map(function (t, i) { return '<button type="button" role="tab" id="tab-' + t.id + '" aria-controls="panel-' + t.id + '" aria-selected="false" data-id="' + t.id + '"><small>0' + (i + 1) + "</small>" + esc((copy[t.id] || {}).name || t.n) + "</button>"; }).join("") + "</div>" +
    TOOLS.map(function (t) {
      return '<section class="lab-panel" id="panel-' + t.id + '" role="tabpanel" aria-labelledby="tab-' + t.id + '"><div class="lab-intro"><div><p class="sec-label mono">' + esc(t.tag) + "</p><h2 class=\"serif\">" + t.h + "</h2></div><p>" + esc(t.blurb) + '</p></div><div class="lab-grid"><div class="panel"><h3><span>Inputs</span><button class="btn btn-sm" type="button" data-reset="' + t.id + '">Reset</button></h3><div class="fields" id="in-' + t.id + '"></div></div><div><div id="out-' + t.id + '" aria-live="polite"></div><p class="note">' + esc(t.note) + "</p></div></div></section>";
    }).join("");

  var state = {};
  function params() { var h = location.hash.slice(1), q = h.split("?")[1] || "", o = {}; q.split("&").forEach(function (kv) { var a = kv.split("="); if (a[0]) o[a[0]] = parseFloat(a[1]); }); return { id: h.split("?")[0], q: o }; }
  function build(t, pre) {
    if (t.custom) return buildFF(t);
    var box = document.getElementById("in-" + t.id);
    state[t.id] = {};
    box.innerHTML = t.fields.map(function (fl) {
      var v = pre && isFinite(pre[fl[0]]) ? pre[fl[0]] : fl[2]; state[t.id][fl[0]] = v;
      return '<div class="field"><label for="' + t.id + "-" + fl[0] + '">' + esc(fl[1]) + '</label><div class="in"><input id="' + t.id + "-" + fl[0] + '" type="number" inputmode="decimal" step="any" value="' + v + '" data-k="' + fl[0] + '">' + (fl[3] ? '<span class="u">' + esc(fl[3]) + "</span>" : "") + "</div></div>";
    }).join("");
    box.oninput = function (e) { var k = e.target.getAttribute("data-k"); if (!k) return; var n = parseFloat(e.target.value); state[t.id][k] = isFinite(n) ? n : 0; run(t); };
    run(t);
  }
  function run(t) { document.getElementById("out-" + t.id).innerHTML = t.calc(state[t.id]); }

  /* ---------- football field (custom inputs + image export) ------------- */
  var FF_DEFAULT = { price: 100, cur: "$", rows: [["DCF", 95, 125, 50], ["EV / EBITDA, peers", 82, 102, 25], ["P / E, peers", 86, 106, 25], ["52-week range", 78, 112, 0], ["Broker targets", 104, 130, 0]] };
  var ff;
  function buildFF(t) {
    ff = JSON.parse(JSON.stringify(FF_DEFAULT));
    var box = document.getElementById("in-ff");
    function draw() {
      box.innerHTML = '<div class="fields two"><div class="field"><label for="ff-price">Current price</label><div class="in"><input id="ff-price" type="number" step="any" value="' + ff.price + '"></div></div><div class="field"><label for="ff-cur">Currency symbol</label><div class="in"><input id="ff-cur" type="text" maxlength="3" value="' + esc(ff.cur) + '"></div></div></div>' +
        '<div class="ff-rows" style="margin-top:18px"><div class="ff-row ff-head"><span>Method</span><span>Low</span><span>High</span><span>Weight</span><span></span></div>' +
        ff.rows.map(function (r, i) { return '<div class="ff-row" data-i="' + i + '"><input type="text" value="' + esc(r[0]) + '" aria-label="Method name" data-c="0"><input type="number" step="any" value="' + r[1] + '" aria-label="Low" data-c="1"><input type="number" step="any" value="' + r[2] + '" aria-label="High" data-c="2"><input type="number" step="any" value="' + r[3] + '" aria-label="Weight" data-c="3"><button type="button" aria-label="Remove ' + esc(r[0]) + '" data-del="' + i + '">✕</button></div>'; }).join("") +
        '</div><div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap"><button class="btn btn-sm" type="button" id="ff-add">+ Add a method</button><button class="btn btn-sm btn-solid" type="button" id="ff-png">Download PNG ↓</button></div>';
    }
    draw(); chart();
    box.oninput = function (e) {
      var row = e.target.closest(".ff-row");
      if (e.target.id === "ff-price") ff.price = parseFloat(e.target.value) || 0;
      else if (e.target.id === "ff-cur") ff.cur = e.target.value;
      else if (row) { var c = +e.target.getAttribute("data-c"); ff.rows[+row.getAttribute("data-i")][c] = c ? (parseFloat(e.target.value) || 0) : e.target.value; }
      chart();
    };
    box.onclick = function (e) {
      var d = e.target.getAttribute("data-del");
      if (d != null) { ff.rows.splice(+d, 1); draw(); chart(); }
      else if (e.target.id === "ff-add") { ff.rows.push(["New method", ff.price * .9, ff.price * 1.1, 0]); draw(); chart(); }
      else if (e.target.id === "ff-png") exportPNG();
    };
  }
  function ffSVG(resolved) {
    var cs = getComputedStyle(document.documentElement), col = function (n) { return resolved ? cs.getPropertyValue(n).trim() : "var(" + n + ")"; };
    var rows = ff.rows.filter(function (r) { return r[2] >= r[1]; }), W = 900, rh = 46, top = 44, left = 210, right = 70, H = top + rows.length * rh + 56;
    var all = [ff.price].concat.apply([ff.price], rows.map(function (r) { return [r[1], r[2]]; })), mn = Math.min.apply(0, all), mx = Math.max.apply(0, all), pad = (mx - mn) * .08 || 1; mn -= pad; mx += pad;
    var X = function (v) { return left + (v - mn) / (mx - mn) * (W - left - right); };
    var sw = rows.reduce(function (a, r) { return a + Math.max(0, r[3]); }, 0), blend = sw ? rows.reduce(function (a, r) { return a + (r[1] + r[2]) / 2 * Math.max(0, r[3]); }, 0) / sw : NaN;
    var font = 'font-family="Geist Mono, ui-monospace, Menlo, monospace" font-size="12"';
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + " " + H + '" width="' + W + '" height="' + H + '">' + (resolved ? '<rect width="100%" height="100%" fill="' + col("--bg-2") + '"/>' : "");
    rows.forEach(function (r, i) {
      var y = top + i * rh, on = r[3] > 0;
      s += '<text x="0" y="' + (y + 19) + '" ' + font + ' fill="' + col("--ink") + '">' + esc(r[0]) + '</text><text x="0" y="' + (y + 34) + '" ' + font + ' font-size="10" fill="' + col("--mute") + '">' + (on && sw ? "weight " + Math.round(r[3] / sw * 100) + "%" : "reference only") + "</text>" +
        '<rect x="' + X(r[1]) + '" y="' + (y + 6) + '" width="' + Math.max(2, X(r[2]) - X(r[1])) + '" height="26" rx="5" fill="' + (on ? col("--accent-text") : col("--mute")) + '" opacity="' + (on ? .9 : .45) + '"/>' +
        '<text x="' + (X(r[1]) - 8) + '" y="' + (y + 24) + '" text-anchor="end" ' + font + ' fill="' + col("--ink-2") + '">' + esc(ff.cur) + f(r[1], 0) + '</text><text x="' + (X(r[2]) + 8) + '" y="' + (y + 24) + '" ' + font + ' fill="' + col("--ink-2") + '">' + esc(ff.cur) + f(r[2], 0) + "</text>";
    });
    var yb = top + rows.length * rh + 8;
    s += '<line x1="' + X(ff.price) + '" x2="' + X(ff.price) + '" y1="' + (top - 10) + '" y2="' + yb + '" stroke="' + col("--ink") + '" stroke-width="1.5" stroke-dasharray="4 4"/><text x="' + X(ff.price) + '" y="' + (top - 18) + '" text-anchor="middle" ' + font + ' fill="' + col("--ink") + '">PRICE ' + esc(ff.cur) + f(ff.price, 2) + "</text>";
    if (isFinite(blend)) s += '<line x1="' + X(blend) + '" x2="' + X(blend) + '" y1="' + (top - 2) + '" y2="' + (yb + 14) + '" stroke="' + col("--accent-text") + '" stroke-width="2"/><text x="' + X(blend) + '" y="' + (yb + 32) + '" text-anchor="middle" ' + font + ' fill="' + col("--accent-text") + '">BLEND ' + esc(ff.cur) + f(blend, 0) + " (" + p(blend / ff.price - 1) + ")</text>";
    return { svg: s + "</svg>", blend: blend, W: W, H: H };
  }
  function chart() {
    var r = ffSVG(false), up = r.blend / ff.price - 1;
    document.getElementById("out-ff").innerHTML = hero([["Blended fair value", isFinite(r.blend) ? esc(ff.cur) + f(r.blend, 0) : "—", "hl"], ["Against the price", isFinite(up) ? p(up) : "—", up < 0 ? "bad" : ""], ["Methods weighted", String(ff.rows.filter(function (x) { return x[3] > 0; }).length)]]) + '<div class="panel ff"><h3>Valuation summary</h3>' + r.svg.replace("<svg ", '<svg role="img" aria-label="Football field chart of valuation ranges" ') + "</div>";
  }
  function exportPNG() {
    var r = ffSVG(true), img = new Image(), sc = 2;
    img.onload = function () {
      var c = document.createElement("canvas"); c.width = r.W * sc; c.height = r.H * sc; var x = c.getContext("2d"); x.drawImage(img, 0, 0, c.width, c.height);
      var a = document.createElement("a"); a.download = "football-field.png"; a.href = c.toDataURL("image/png"); a.click();
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(r.svg);
  }

  /* ---------- tabs + boot ----------------------------------------------- */
  function show(id, pre) {
    var t = TOOLS.filter(function (x) { return x.id === id; })[0] || TOOLS[0];
    TOOLS.forEach(function (x) { document.getElementById("tab-" + x.id).setAttribute("aria-selected", x === t); document.getElementById("panel-" + x.id).classList.toggle("on", x === t); });
    if (!state[t.id] || pre) { state[t.id] = state[t.id] || {}; build(t, pre); }
    if (history.replaceState && !pre) history.replaceState(null, "", "#" + t.id);
  }
  host.addEventListener("click", function (e) {
    var tab = e.target.closest("[role=tab]"); if (tab) { show(tab.getAttribute("data-id")); return; }
    var rs = e.target.closest("[data-reset]"); if (rs) { var t = TOOLS.filter(function (x) { return x.id === rs.getAttribute("data-reset"); })[0]; build(t); }
  });
  host.querySelector(".lab-tabs").addEventListener("keydown", function (e) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    var tabs = [].slice.call(host.querySelectorAll("[role=tab]")), i = tabs.indexOf(document.activeElement); if (i < 0) return;
    var n = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length]; n.focus(); n.click();
  });
  var pr = params();
  show(pr.id, Object.keys(pr.q).length ? pr.q : null);
  // with no parameters, pre-fill the spread calculator from the live deal tracker
  if (!(pr.id === "arb" && Object.keys(pr.q).length) && window.fetch) fetch("data/deal-tracker.json", { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
    if (!j || !j.deals) return; var k = Object.keys(j.deals)[0], d = j.deals[k]; if (!d) return;
    var arb = TOOLS.filter(function (x) { return x.id === "arb"; })[0], map = { offer: d.offer, price: d.price, div: d.dividends_expected || 0, days: d.days_to_close, brk: +d.break_price.toFixed(2), rf: +((j.risk_free || 0) * 100).toFixed(2) };
    arb.fields.forEach(function (fl) { if (isFinite(map[fl[0]])) fl[2] = map[fl[0]]; });
    arb.note = "Pre-filled from the live tracker: " + d.ticker + " at the " + d.as_of + " close. " + arb.note;
    var n = document.querySelector("#panel-arb .note"); if (n) n.textContent = arb.note;
    if (state.arb && Object.keys(state.arb).length) build(arb);
  }).catch(function () {});
  window.addEventListener("hashchange", function () { var x = params(); show(x.id, Object.keys(x.q).length ? x.q : null); });
})();
