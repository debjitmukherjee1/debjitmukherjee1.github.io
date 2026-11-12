/* ambient.js — inner pages: the same landscape as the Overview, drifting quietly
   behind the content. Each page has its own glow colour (data-world on <body>). */
import { stage, buildStage, goView, setWorld } from "./stage.js?v=50";
const DM = window.DM;
setWorld(document.body.getAttribute("data-world") || "open", 0);
DM.ledgerReady.then(() => {
  const calls = DM.calls().slice().sort((a, b) => a.call_date < b.call_date ? 1 : -1);
  if (!calls.length || DM.REDUCED) return;
  buildStage(calls);
  if (stage.ok) { goView(stage.views.calm); document.documentElement.classList.add("ambient"); }
});
