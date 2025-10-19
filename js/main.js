// === Year ===
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});

// === Tabs (unchanged if you use them) ===
(function initTabs() {
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".panel");
  if (!tabs.length) return;

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      panels.forEach(p => {
        p.classList.remove("active");
        p.hidden = true;
      });
      tab.classList.add("active");
      panels[i].classList.add("active");
      panels[i].hidden = false;
    });
  });
})();

// ===================== RECOMMENDER =====================
// Lightweight semantic-ish scorer (client-side) that is robust to phrasing.
// Strategy:
//  - tokenize + light stemming
//  - sector profiles with synonyms/phrases
//  - heuristics for generic intents (build/make → Web/Game Dev, compete → Competitive, etc.)
//  - never-zero: graceful priors + softmax normalization to 100%

(function initRecommender() {
  const form = document.getElementById("recommendForm");
  const out = document.getElementById("recommendation-result");
  if (!form || !out) return;

  // Sector order: used for consistent coloring
  const SECTORS = [
    "Web/Game Development",
    "Machine Learning",
    "Cybersecurity",
    "Competitive Programming",
  ];

  // Sector profiles: include synonyms + phrases (no buzzword exactness required)
  const PROFILE = {
    "Web/Game Development": `
      web website webpage frontend html css javascript build make create design ui ux app
      game games gaming engine project interactive visuals graphics publish deploy
    `,
    "Machine Learning": `
      ai artificial intelligence machine learning data dataset model models train training
      prediction classify clustering neural network pattern statistics analysis research
    `,
    "Cybersecurity": `
      security cybersecurity cyber encrypt encryption decrypt network networks protocol
      hack hacking ethical ctf capture-the-flag breach phishing defense protect
      vulnerability exploit forensic
    `,
    "Competitive Programming": `
      competition contest competitive coding codeforces usaco acsl olympiad logic algorithm
      algorithms dp greedy graph math puzzle problem problems practice
    `,
  };

  // Heuristic triggers: if these appear, gently bias toward sector
  const TRIGGERS = {
    "Web/Game Development": ["build", "built", "make", "create", "develop", "website", "webpage", "game", "games", "gaming", "fortnite", "minecraft", "roblox", "app"],
    "Machine Learning": ["ai", "ml", "data", "dataset", "model", "models", "neural", "pattern", "predict", "classify", "training"],
    "Cybersecurity": ["security", "cyber", "hack", "hacking", "ctf", "encrypt", "network", "vpn", "forensic", "breach"],
    "Competitive Programming": ["compete", "competition", "contest", "usaco", "acsl", "codeforces", "olympiad", "puzzle", "problem", "problems"],
  };

  const STOP = new Set([
    "the","a","an","and","or","to","of","in","on","for","with","at","as","is","are",
    "be","being","been","it","that","this","i","me","my","we","our","you","your","they",
    "their","from","about","how","what","which","want","would","like","similar","something"
  ]);

  const stem = (w) => {
    // light stemmer: plurals + common verb endings
    return w
      .replace(/(ing|ed|er|ers|ly|ion|ions)$/,'')
      .replace(/(es|s)$/,'');
  };

  const tokenize = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
      .map(stem)
      .filter(w => !STOP.has(w) && w.length > 1);

  const textToCounts = (text) => {
    const counts = new Map();
    tokenize(text).forEach(t => counts.set(t, (counts.get(t) || 0) + 1));
    return counts;
  };

  const dot = (a, b) => {
    // dot-product over intersection keys
    let sum = 0;
    for (const [k, v] of a.entries()) {
      const bv = b.get(k);
      if (bv) sum += v * bv;
    }
    return sum;
  };

  const softmaxPct = (arr) => {
    // convert raw scores to 0–100 via softmax (stabilizes tiny/zero cases)
    const max = Math.max(...arr);
    const exps = arr.map(x => Math.exp(x - max));
    const denom = exps.reduce((s, v) => s + v, 0);
    return exps.map(v => (v / denom) * 100);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const interests = document.getElementById("interests").value || "";
    const userVec = textToCounts(interests);

    // Build sector vectors
    const sectorVecs = {};
    SECTORS.forEach(s => sectorVecs[s] = textToCounts(PROFILE[s]));

    // Base scores from vector overlap
    let raw = SECTORS.map(s => dot(userVec, sectorVecs[s]));

    // Heuristic boosts (tiny nudges that help new users)
    const lower = interests.toLowerCase();
    SECTORS.forEach((s, i) => {
      const hits = TRIGGERS[s].reduce((acc, t) => acc + (lower.includes(t) ? 1 : 0), 0);
      raw[i] += hits * 0.8; // gentle boost
    });

    // If everything is still zero, apply neutral priors (slight bias toward Web/Game Dev for “build” type queries)
    if (raw.every(v => v === 0)) {
      raw = [1.2, 1, 1, 1]; // Web/Game Dev gets a small prior
    }

    // Normalize to 100% with softmax
    const pct = softmaxPct(raw);

    // Combine & sort by percentage
    const ranked = SECTORS
      .map((s, i) => ({ sector: s, score: pct[i] }))
      .sort((a, b) => b.score - a.score)
      .map((r, i) => ({ ...r, score: Math.round(r.score) }));

    // Render bars with labels always visible
    renderBars(ranked);
  });

  function renderBars(ranked) {
    out.innerHTML = ""; // clear
    ranked.forEach((r, idx) => {
      const row = document.createElement("div");
      row.className = "bar-row";

      const label = document.createElement("div");
      label.className = "bar-label";
      label.textContent = `${idx + 1}. ${r.sector}`;

      const shell = document.createElement("div");
      shell.className = "bar-container";

      const bar = document.createElement("div");
      bar.className = "bar " + ["green","gold","lightgreen","teal"][idx % 4];

      // Ensure a tiny visible sliver even for very small values
      const width = Math.max(r.score, 6); // minimum visible width
      bar.style.width = width + "%";

      const pct = document.createElement("span");
      pct.className = "bar-pct";
      pct.textContent = `${r.score}%`;

      shell.appendChild(bar);
      shell.appendChild(pct);

      row.appendChild(label);
      row.appendChild(shell);
      out.appendChild(row);
    });
  }
})();
