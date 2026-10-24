"use strict";

/* ============================================================
   Canva Text Guide – One-Page Controller (EN & ID)
   ============================================================ */

const KEYS = { lang: "cg-lang" };

const T = {
  en: {
    appName: "Canva Text Guide",
    startKicker: "Practical One-Page Guide",
    heroAdd: "Text Box",
    heroFont: "Font",
    heroColor: "Color",
    heroSpacing: "S P A C I N G",
    heroOutline: "Outline",
    startTitle: "Canva Text Tools: Basic Practical Guide",
    startLead: "Everything you need to add, resize, style, and enhance text in Canva—organized on one simple page. Read the quick steps on the left and test each tool directly on the right.",
    topicsLabel: "Jump to a tool:",
    howToLabel: "How to do it in Canva:",
    tipLabel: "Practical Tip:",
    backToTop: "↑ Back to top",
    summaryKicker: "Quick Reference",
    summaryTitle: "Summary of All 8 Canva Text Tools",
    colTool: "Tool",
    colWhere: "Where in Canva",
    summaryRows: [
      ["1. Add Text Box", "Left Sidebar → Text (T) or press T"],
      ["2. Resize & Wrap", "Purple Text Box Selection Handles (○ & ▯)"],
      ["3. Choose Font", "Top Toolbar (Far Left Dropdown)"],
      ["4. Font Size", "Top Toolbar [ − ] [ Size ] [ + ]"],
      ["5. Style & Alignment", "Top Toolbar [B] [I] [U] [S] [aA] [≡ Alignment]"],
      ["6. Font Color", "Top Toolbar 'A' Text Color Icon"],
      ["7. Font Spacing", "Top Toolbar Spacing Icon (↕≡)"],
      ["8. Effects & Outline", "Top Toolbar → Effects → Outline"]
    ]
  },
  id: {
    appName: "Panduan Teks Canva",
    startKicker: "Panduan Praktis Satu Halaman",
    heroAdd: "Text Box",
    heroFont: "Font",
    heroColor: "Color",
    heroSpacing: "S P A C I N G",
    heroOutline: "Outline",
    startTitle: "Canva Text Tools: Panduan Dasar Praktis",
    startLead: "Semua hal dasar yang perlu kamu ketahui untuk menambah Text Box, mengatur Font Size, Text Style, Alignment, hingga memberi Effect seperti Outline di Canva—dirangkum secara ringkas dalam satu halaman. Baca langkah singkatnya di kiri dan coba langsung simulasinya di kanan.",
    topicsLabel: "Loncat ke bagian tool:",
    howToLabel: "Cara menggunakannya di Canva:",
    tipLabel: "Tips Praktis:",
    backToTop: "↑ Kembali ke atas",
    summaryKicker: "Quick Reference",
    summaryTitle: "Rangkuman 8 Canva Text Tools",
    colTool: "Tool",
    colWhere: "Lokasi di Canva",
    summaryRows: [
      ["1. Add Text Box", "Left Sidebar → Text (T) atau tekan tombol T"],
      ["2. Resize Text Box", "Corner Handles (○) & Side Pill Handles (▯) pada Text Box"],
      ["3. Choose Font", "Top Toolbar (Dropdown paling kiri)"],
      ["4. Font Size", "Top Toolbar [ − ] [ Size ] [ + ]"],
      ["5. Style & Alignment", "Top Toolbar [B] [I] [U] [S] [aA] [≡ Alignment]"],
      ["6. Font Color", "Top Toolbar ikon 'A' Text Color"],
      ["7. Font Spacing", "Top Toolbar ikon Spacing (↕≡)"],
      ["8. Effects & Outline", "Top Toolbar → Effects → Outline"]
    ]
  }
};

const $ = (id) => document.getElementById(id);
const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } }
};

let lang = store.get(KEYS.lang) || ((navigator.language || "en").toLowerCase().startsWith("id") ? "id" : "en");

function renderNavPills() {
  const wrap = $("nav-topic-pills");
  if (!wrap) return;
  wrap.innerHTML = "";
  GUIDE_SECTIONS.forEach((sec) => {
    const a = h("a", { href: `#${sec.id}`, class: "topic-pill" },
      h("span", { class: "num" }, String(sec.num)),
      sec.short[lang]
    );
    wrap.append(a);
  });
  const sumLink = h("a", { href: "#tool-summary", class: "topic-pill" },
    h("span", { class: "num" }, "✓"),
    "Summary"
  );
  wrap.append(sumLink);
}

function renderAllSections() {
  const container = $("guide-sections");
  if (!container) return;
  container.innerHTML = "";

  GUIDE_SECTIONS.forEach((sec) => {
    const card = h("section", { id: sec.id, class: "guide-card" },
      h("div", { class: "guide-card-grid" },
        h("div", { class: "guide-info" },
          h("span", { class: "kicker" }, sec.kicker[lang]),
          h("h2", { class: "guide-title" }, `${sec.num}. ${sec.title[lang]}`),
          h("p", { class: "guide-lead" }, sec.lead[lang]),
          h("span", { class: "small-label" }, T[lang].howToLabel),
          h("ol", { class: "guide-steps" },
            sec.steps[lang].map((st) => h("li", null, st))
          ),
          h("div", { class: "guide-tip" },
            h("strong", null, `💡 ${T[lang].tipLabel} `),
            h("span", null, sec.tip[lang])
          )
        ),
        h("div", { class: "guide-sim" },
          sec.buildSim(lang)
        )
      )
    );
    container.append(card);
  });

  // Concise Summary Cheat Sheet Table at the bottom (Tool + Where in Canva)
  const tableRows = T[lang].summaryRows.map(([tool, where]) =>
    h("tr", null,
      h("td", null, h("strong", null, tool)),
      h("td", null, where)
    )
  );

  const summarySection = h("section", { id: "tool-summary", class: "guide-card summary-card" },
    h("div", { class: "summary-header" },
      h("div", null,
        h("span", { class: "kicker" }, T[lang].summaryKicker),
        h("h2", { class: "guide-title", style: "margin-bottom:4px" }, T[lang].summaryTitle)
      ),
      h("a", { href: "#top", class: "btn small" }, T[lang].backToTop)
    ),
    h("div", { class: "summary-table-wrap" },
      h("table", { class: "summary-table" },
        h("thead", null,
          h("tr", null,
            h("th", null, T[lang].colTool),
            h("th", null, T[lang].colWhere)
          )
        ),
        h("tbody", null, tableRows)
      )
    )
  );

  container.append(summarySection);
}

function applyLanguage() {
  document.documentElement.lang = lang;
  document.title = T[lang].appName;
  document.querySelectorAll("[data-i18n]").forEach((n) => {
    const v = T[lang][n.dataset.i18n];
    if (typeof v === "string") n.textContent = v;
  });
  document.querySelectorAll(".lang-btn").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
  });
  renderNavPills();
  renderAllSections();
}

document.querySelectorAll(".lang-btn").forEach((b) => {
  b.addEventListener("click", () => {
    lang = b.dataset.lang;
    store.set(KEYS.lang, lang);
    applyLanguage();
  });
});

applyLanguage();
