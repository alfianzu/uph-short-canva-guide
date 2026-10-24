"use strict";

/* ============================================================
   Canva Text Guide – Concise One-Page Interactive Sections
   ============================================================ */

const bi = (L, en, id) => (L === "id" ? id : en);
const fontByName = (n) => FONT_LIST.find((f) => f.n === n) || FONT_LIST[0];
const stackOf = (n) => fontStack(fontByName(n));

function h(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  if (attrs) {
    Object.entries(attrs).forEach(([k, v]) => {
      if (v == null || v === false) return;
      if (k === "class") e.className = v;
      else if (k === "style") e.style.cssText = v;
      else if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2).toLowerCase(), v);
      else e.setAttribute(k, v === true ? "" : v);
    });
  }
  kids.flat().forEach((c) => {
    if (c == null || c === false) return;
    e.append(typeof c === "object" ? c : document.createTextNode(String(c)));
  });
  return e;
}

function slider(label, min, max, step, value, onInput, fmt) {
  const out = h("output", null, fmt ? fmt(value) : String(value));
  const input = h("input", { type: "range", min, max, step, value, "aria-label": label });
  const fire = () => {
    const v = Number(input.value);
    out.textContent = fmt ? fmt(v) : String(v);
    onInput(v);
  };
  const set = (v) => {
    input.value = String(v);
    out.textContent = fmt ? fmt(v) : String(v);
  };
  input.addEventListener("input", fire);
  const row = h("label", { class: "ctrl" }, h("span", { class: "ctrl-label" }, label), out, input);
  return { row, fire, input, out, set };
}

function makeCanvaSelectionBox(innerNode, opts = {}) {
  const tl = h("span", { class: "canva-handle corner tl" + (opts.pulseCorners ? " pulsing" : "") });
  const tr = h("span", { class: "canva-handle corner tr" + (opts.pulseCorners ? " pulsing" : "") });
  const bl = h("span", { class: "canva-handle corner bl" + (opts.pulseCorners ? " pulsing" : "") });
  const br = h("span", { class: "canva-handle corner br" + (opts.pulseCorners ? " pulsing" : "") });
  const ml = h("span", { class: "canva-handle side ml" + (opts.pulseSides ? " pulsing" : "") });
  const mr = h("span", { class: "canva-handle side mr" + (opts.pulseSides ? " pulsing" : "") });
  const rotPill = h("span", { class: "canva-float-pill" + (opts.pulseRotate ? " pulsing" : ""), title: "Rotate" }, "↻");
  const movePill = h("span", { class: "canva-float-pill", title: "Move" }, "✥");
  const dimTag = opts.dimText ? h("span", { class: "canva-dim-tag" }, opts.dimText) : null;

  const box = h("div", { class: "canva-textbox" + (opts.unselected ? " unselected" : ""), style: opts.style || "" },
    dimTag,
    tl, tr, bl, br,
    ml, mr,
    innerNode,
    h("div", { class: "canva-floating-pills" }, rotPill, movePill)
  );
  return { box, innerNode, tl, tr, bl, br, ml, mr, rotPill, movePill, dimTag };
}

/* ---------- 1. Adding a Text Box ---------- */
function buildAddTextbox(L) {
  let boxes = [
    { type: "Heading", text: "Add a heading", size: "1.55rem", weight: "800" }
  ];
  const stage = h("div", { class: "canva-artboard", style: "min-height:165px;gap:10px;padding:18px" });

  function render() {
    stage.innerHTML = "";
    boxes.forEach((b, i) => {
      const isLast = i === boxes.length - 1;
      const node = h("div", {
        contenteditable: "true",
        spellcheck: "false",
        style: `font-size:${b.size};font-weight:${b.weight};color:#1e293b;text-align:center;outline:none;min-width:80px`
      }, b.text);
      const sel = makeCanvaSelectionBox(node, { unselected: !isLast, dimText: isLast ? b.type : null });
      sel.box.addEventListener("click", () => {
        boxes.push(...boxes.splice(i, 1));
        render();
      });
      stage.append(sel.box);
    });
  }

  function addPreset(type, text, size, weight) {
    if (boxes.length >= 3) boxes.shift();
    boxes.push({ type, text, size, weight });
    render();
  }

  render();

  return h("div", { class: "guide-sim-box" },
    h("div", { class: "sim-bar" },
      h("button", {
        type: "button",
        class: "canva-purple-cta",
        style: "width:auto;padding:6px 12px;font-size:0.8rem",
        onclick: () => addPreset("Text Box (T)", bi(L, "Your paragraph text", "Teks paragraf kamu"), "1rem", "500")
      }, "+ ", bi(L, "Add a text box (or press T)", "Add a text box (atau tekan T)")),
      h("button", {
        type: "button",
        class: "chip-toggle",
        onclick: () => addPreset("Heading", "Add a heading", "1.55rem", "800")
      }, "+ Heading"),
      h("button", {
        type: "button",
        class: "chip-toggle",
        onclick: () => addPreset("Subheading", "Add a subheading", "1.1rem", "600")
      }, "+ Subheading"),
      h("button", {
        type: "button",
        class: "chip-toggle",
        onclick: () => { boxes = boxes.slice(0, 1); render(); }
      }, "Reset")
    ),
    h("div", { class: "canva-artboard-wrap", style: "padding:18px 14px 36px" }, stage),
    h("p", { class: "sim-hint" }, bi(L, "Click the buttons above to add boxes, or click inside the box on the canvas to type.", "Klik tombol di atas untuk menambah Text Box, atau klik teks di canvas untuk mengetik."))
  );
}

/* ---------- 2. Resizing a Text Box ---------- */
function buildResizeTextbox(L) {
  let pt = 32;
  let widthPct = 85;
  let rot = 0;
  let mode = "corners";

  const txt = h("div", {
    style: `font-family:${stackOf("Anton")};line-height:1.15;text-align:center;color:#1e293b`
  }, "GUARDIANS OF THE GALAXY");
  const sel = makeCanvaSelectionBox(txt, { pulseCorners: true, dimText: "32 pt · 85% width" });

  function sync() {
    txt.style.fontSize = pt + "px";
    sel.box.style.width = widthPct + "%";
    sel.box.style.transform = `rotate(${rot}deg)`;
    if (sel.dimTag) sel.dimTag.textContent = `${pt} pt · ${widthPct}% width · ${rot}°`;
    [sel.tl, sel.tr, sel.bl, sel.br].forEach((c) => c.classList.toggle("pulsing", mode === "corners"));
    [sel.ml, sel.mr].forEach((s) => s.classList.toggle("pulsing", mode === "sides"));
    sel.rotPill.classList.toggle("pulsing", mode === "rotate");
  }

  const sCorner = slider(bi(L, "○ Corner Handles (Scale Font Size)", "○ Corner Handles (Ubah Font Size)"), 18, 52, 1, pt, (v) => { pt = v; mode = "corners"; sync(); }, (v) => v + " pt");
  const sSide = slider(bi(L, "▯ Side Pill Handles (Wrap Box Width)", "▯ Side Pill Handles (Atur Lebar Text Box)"), 40, 100, 2, widthPct, (v) => { widthPct = v; mode = "sides"; sync(); }, (v) => v + "%");
  const sRot = slider(bi(L, "↻ Rotate Handle (Tilt Angle)", "↻ Rotate Handle (Putar Sudut Teks)"), -15, 15, 1, rot, (v) => { rot = v; mode = "rotate"; sync(); }, (v) => v + "°");

  sync();

  return h("div", { class: "guide-sim-box" },
    h("div", { class: "canva-artboard-wrap", style: "padding:24px 14px 40px" },
      h("div", { class: "canva-artboard", style: "min-height:165px" }, sel.box)
    ),
    h("div", { class: "sim-controls" }, sCorner.row, sSide.row, sRot.row)
  );
}

/* ---------- 3. Choosing a Font ---------- */
function buildChooseFont(L) {
  let current = FONT_LIST[0];
  const txt = h("div", {
    style: `font-family:${current.stack};font-size:2.1rem;line-height:1.15;text-align:center;color:#1e293b`
  }, "STARLIGHT ODYSSEY");
  const sel = makeCanvaSelectionBox(txt, { dimText: current.n });
  const descEl = h("p", { class: "sim-hint" });
  const btns = [];

  function pick(f) {
    current = f;
    txt.style.fontFamily = f.stack;
    if (sel.dimTag) sel.dimTag.textContent = `${f.n} (${f.cat})`;
    descEl.innerHTML = `<strong>${f.n}:</strong> ${f.desc[L]}`;
    btns.forEach((b) => b.el.setAttribute("aria-pressed", String(b.f.n === f.n)));
  }

  const chipRow = h("div", { class: "chipset", style: "margin:0" },
    FONT_LIST.slice(0, 8).map((f) => {
      const b = h("button", {
        type: "button",
        class: "chip-toggle",
        style: `font-family:${f.stack};font-size:0.9rem`,
        "aria-pressed": String(f.n === current.n),
        onclick: () => pick(f)
      }, f.n);
      btns.push({ f, el: b });
      return b;
    })
  );

  pick(current);

  return h("div", { class: "guide-sim-box" },
    h("div", { class: "canva-artboard-wrap", style: "padding:22px 14px 36px" },
      h("div", { class: "canva-artboard", style: "min-height:140px" }, sel.box)
    ),
    h("div", { class: "sim-controls" },
      h("span", { class: "small-label" }, bi(L, "Click a font to preview:", "Klik Font untuk melihat preview:")),
      chipRow,
      descEl
    )
  );
}

/* ---------- 4. Adjusting Font Size ---------- */
function buildFontSize(L) {
  let sizePt = 44;
  const hNode = h("div", { style: `font-family:${stackOf("Anton")};font-size:44px;line-height:1.1;color:#1e293b;text-align:center` }, "MAIN HEADING");
  const sNode = h("div", { style: `font-family:${stackOf("Montserrat")};font-size:18px;font-weight:700;color:#b8553a;text-align:center;margin-top:6px` }, "SUBHEADING · 18 PT");
  const bNode = h("div", { style: `font-family:${stackOf("Poppins")};font-size:12px;color:#64748b;text-align:center;margin-top:4px` }, bi(L, "Body text & credits stay smaller (12 pt) for clean hierarchy.", "Body text dibuat lebih kecil (12 pt) agar visual hierarchy tetap jelas."));

  const sel = makeCanvaSelectionBox(hNode, { dimText: "44 pt" });
  const numInput = h("input", { type: "number", min: "12", max: "72", value: "44", "aria-label": "Font Size" });
  const sSlider = slider(bi(L, "Heading Font Size (pt)", "Font Size untuk Heading (pt)"), 14, 68, 1, sizePt, (v) => update(v), (v) => v + " pt");

  function update(v) {
    sizePt = Math.max(12, Math.min(72, v));
    hNode.style.fontSize = sizePt + "px";
    numInput.value = String(sizePt);
    sSlider.set(sizePt);
    if (sel.dimTag) sel.dimTag.textContent = sizePt + " pt";
  }

  numInput.addEventListener("change", () => update(Number(numInput.value) || 36));

  return h("div", { class: "guide-sim-box" },
    h("div", { class: "sim-bar" },
      h("span", { style: "font-size:0.8rem;font-weight:700" }, "Font Size:"),
      h("div", { class: "canva-size-stepper highlight-target" },
        h("button", { type: "button", onclick: () => update(sizePt - 2) }, "−"),
        numInput,
        h("button", { type: "button", onclick: () => update(sizePt + 2) }, "+")
      ),
      [24, 36, 48, 60].map((p) => h("button", { type: "button", class: "chip-toggle", onclick: () => update(p) }, p + " pt"))
    ),
    h("div", { class: "canva-artboard-wrap", style: "padding:22px 14px 36px" },
      h("div", { class: "canva-artboard", style: "min-height:165px" }, sel.box, sNode, bNode)
    ),
    h("div", { class: "sim-controls" }, sSlider.row)
  );
}

/* ---------- 5. Setting Text Style ---------- */
function buildTextStyle(L) {
  const st = { bold: true, italic: false, underline: false, strike: false, upper: false, align: "center" };
  const txt = h("div", { style: `font-family:${stackOf("Montserrat")};font-size:1.25rem;line-height:1.35;color:#1e293b;width:100%` },
    bi(L, "Visual Communication Design\nPractical Typography in Canva", "Visual Communication Design\nTipografi Praktis di Canva")
  );
  txt.style.whiteSpace = "pre-line";
  const sel = makeCanvaSelectionBox(txt, { style: "width:90%", dimText: "Montserrat" });

  const bBold = h("button", { type: "button", class: "canva-tb-btn" }, h("b", null, "B"));
  const bItal = h("button", { type: "button", class: "canva-tb-btn" }, h("i", null, "I"));
  const bUnd = h("button", { type: "button", class: "canva-tb-btn" }, h("u", null, "U"));
  const bStr = h("button", { type: "button", class: "canva-tb-btn" }, h("s", null, "S"));
  const bUpp = h("button", { type: "button", class: "canva-tb-btn" }, "aA");
  const bAln = h("button", { type: "button", class: "canva-tb-btn" }, "≡ Center");

  function sync() {
    bBold.classList.toggle("active", st.bold);
    bItal.classList.toggle("active", st.italic);
    bUnd.classList.toggle("active", st.underline);
    bStr.classList.toggle("active", st.strike);
    bUpp.classList.toggle("active", st.upper);
    bAln.textContent = st.align === "left" ? "⇤ Left" : st.align === "center" ? "≡ Center" : "⇥ Right";

    txt.style.fontWeight = st.bold ? "800" : "400";
    txt.style.fontStyle = st.italic ? "italic" : "normal";
    const dec = [];
    if (st.underline) dec.push("underline");
    if (st.strike) dec.push("line-through");
    txt.style.textDecoration = dec.length ? dec.join(" ") : "none";
    txt.style.textTransform = st.upper ? "uppercase" : "none";
    txt.style.textAlign = st.align;
  }

  bBold.onclick = () => { st.bold = !st.bold; sync(); };
  bItal.onclick = () => { st.italic = !st.italic; sync(); };
  bUnd.onclick = () => { st.underline = !st.underline; sync(); };
  bStr.onclick = () => { st.strike = !st.strike; sync(); };
  bUpp.onclick = () => { st.upper = !st.upper; sync(); };
  bAln.onclick = () => {
    const order = ["left", "center", "right"];
    st.align = order[(order.indexOf(st.align) + 1) % order.length];
    sync();
  };

  sync();

  return h("div", { class: "guide-sim-box" },
    h("div", { class: "canva-toolbar" }, bBold, bItal, bUnd, bStr, bUpp, h("div", { class: "canva-tb-divider" }), bAln),
    h("div", { class: "canva-artboard-wrap", style: "padding:22px 14px 36px" },
      h("div", { class: "canva-artboard", style: "min-height:150px" }, sel.box)
    ),
    h("p", { class: "sim-hint" }, bi(L, "Toggle [B], [I], [U], [S], [aA], and [Alignment] in the toolbar above.", "Klik tombol [B], [I], [U], [S], [aA], dan [Alignment] pada Top Toolbar di atas."))
  );
}

/* ---------- 6. Choosing Font Color ---------- */
function buildFontColor(L) {
  let color = "#fde047";
  let darkBg = true;
  const swatches = ["#fde047", "#ffffff", "#38bdf8", "#fb7185", "#10b981", "#1e293b", "#b8553a"];

  const txt = h("div", { style: `font-family:${stackOf("Anton")};font-size:2.2rem;line-height:1.1;text-align:center;color:${color}` }, "NIGHT WATCH");
  const sel = makeCanvaSelectionBox(txt, { dimText: color });
  const artboard = h("div", { class: "canva-artboard dark-illustrated", style: "min-height:150px" }, sel.box);
  const picker = h("input", { type: "color", value: color, style: "width:34px;height:30px;padding:1px;border-radius:6px;border:1px solid var(--line);cursor:pointer" });

  function apply(hex) {
    color = hex;
    txt.style.color = hex;
    picker.value = hex;
    if (sel.dimTag) sel.dimTag.textContent = hex.toUpperCase();
  }

  picker.oninput = (e) => apply(e.target.value);

  return h("div", { class: "guide-sim-box" },
    h("div", { class: "sim-bar" },
      picker,
      swatches.map((hex) => h("button", {
        type: "button",
        style: `width:26px;height:26px;border-radius:50%;background:${hex};border:2px solid #cbd5e1;cursor:pointer`,
        title: hex,
        onclick: () => apply(hex)
      })),
      h("button", {
        type: "button",
        class: "chip-toggle",
        style: "margin-left:auto",
        onclick: () => {
          darkBg = !darkBg;
          artboard.classList.toggle("dark-illustrated", darkBg);
          artboard.style.background = darkBg ? "" : "#fffdf8";
        }
      }, bi(L, "Toggle Dark/Light Bg", "Toggle Dark/Light Background"))
    ),
    h("div", { class: "canva-artboard-wrap", style: "padding:22px 14px 36px" }, artboard),
    h("p", { class: "sim-hint" }, bi(L, "Pick a swatch or custom color, and test contrast against Dark vs. Light backgrounds.", "Pilih color swatch di atas dan uji kontrasnya pada Dark maupun Light Background."))
  );
}

/* ---------- 7. Adjusting Font Spacing ---------- */
function buildFontSpacing(L) {
  let letterSp = 40;
  let lineSp = 1.05;

  const txt = h("div", {
    style: `font-family:${stackOf("Orbitron")};font-weight:800;font-size:1.65rem;text-align:center;color:#1e293b`
  }, h("div", null, "CYBER"), h("div", null, "HORIZON"));
  const sel = makeCanvaSelectionBox(txt, { dimText: "Letter: 40 · Line: 1.05" });

  function sync() {
    txt.style.letterSpacing = (letterSp / 1000).toFixed(3) + "em";
    txt.style.lineHeight = String(lineSp);
    if (sel.dimTag) sel.dimTag.textContent = `Letter: ${letterSp} · Line: ${lineSp.toFixed(2)}`;
  }

  const sLet = slider("Letter spacing (-200 to 800)", -80, 400, 10, letterSp, (v) => { letterSp = v; sync(); }, (v) => String(v));
  const sLin = slider("Line spacing (0.5 to 2.5)", 0.75, 2.0, 0.05, lineSp, (v) => { lineSp = v; sync(); }, (v) => v.toFixed(2));

  sync();

  return h("div", { class: "guide-sim-box" },
    h("div", { class: "canva-artboard-wrap", style: "padding:22px 14px 36px" },
      h("div", { class: "canva-artboard", style: "min-height:155px;overflow:hidden" }, sel.box)
    ),
    h("div", { class: "sim-controls" }, sLet.row, sLin.row)
  );
}

/* ---------- 8. Setting Effects (Outline & More) ---------- */
function buildEffectsOutline(L) {
  let fx = "outline";
  let thick = 55;
  let outColor = "#0f172a";
  const fxList = [
    { key: "outline", label: "Outline ★" },
    { key: "shadow", label: "Shadow" },
    { key: "lift", label: "Lift" },
    { key: "hollow", label: "Hollow" },
    { key: "splice", label: "Splice" },
    { key: "neon", label: "Neon" },
    { key: "background", label: "Background" },
    { key: "none", label: "None" }
  ];

  const txt = h("div", {
    style: `font-family:${stackOf("Anton")};font-size:2.4rem;line-height:1.1;text-align:center;letter-spacing:0.04em;padding:4px 12px;border-radius:8px`
  }, "SUPER NOVA");
  const sel = makeCanvaSelectionBox(txt, { dimText: "Effects: Outline" });
  const fxBtns = [];

  function sync() {
    txt.style.color = "#fde047";
    txt.style.webkitTextStroke = "0px transparent";
    txt.style.paintOrder = "stroke fill";
    txt.style.textShadow = "none";
    txt.style.background = "transparent";

    if (fx === "outline") {
      const px = (thick / 100) * 10 + 1.5;
      txt.style.webkitTextStroke = `${px.toFixed(1)}px ${outColor}`;
      txt.style.textShadow = `0 2px 0 ${outColor}`;
    } else if (fx === "shadow") {
      const off = Math.round((thick / 100) * 8) + 2;
      txt.style.textShadow = `${off}px ${off}px 0 ${outColor}`;
    } else if (fx === "lift") {
      const blur = Math.round((thick / 100) * 22) + 4;
      txt.style.textShadow = `0 6px ${blur}px rgba(0,0,0,0.85)`;
    } else if (fx === "hollow") {
      const px = (thick / 100) * 4 + 1.2;
      txt.style.color = "transparent";
      txt.style.webkitTextStroke = `${px.toFixed(1)}px #fde047`;
    } else if (fx === "splice") {
      const off = Math.round((thick / 100) * 6) + 2;
      txt.style.webkitTextStroke = `2.2px ${outColor}`;
      txt.style.textShadow = `${off}px ${off}px 0 ${outColor}`;
    } else if (fx === "neon") {
      const glow = Math.round((thick / 100) * 16) + 4;
      txt.style.color = "#ffffff";
      txt.style.textShadow = `0 0 ${glow}px #fde047, 0 0 ${glow * 2}px ${outColor}`;
    } else if (fx === "background") {
      txt.style.background = outColor;
    }

    if (sel.dimTag) sel.dimTag.textContent = `Effects → ${fx.toUpperCase()}`;
    fxBtns.forEach((b) => b.el.setAttribute("aria-pressed", String(b.key === fx)));
  }

  const sThick = slider(bi(L, "Outline Thickness / Effect Intensity", "Outline Thickness / Intensitas Effect"), 10, 100, 5, thick, (v) => { thick = v; sync(); }, (v) => String(v));

  const chipRow = h("div", { class: "chipset", style: "margin:0 0 8px" },
    fxList.map((item) => {
      const b = h("button", {
        type: "button",
        class: "chip-toggle",
        "aria-pressed": String(item.key === fx),
        onclick: () => { fx = item.key; sync(); }
      }, item.label);
      fxBtns.push({ key: item.key, el: b });
      return b;
    })
  );

  const colorRow = h("div", { style: "display:flex;align-items:center;gap:8px;margin-top:6px" },
    h("span", { style: "font-size:0.8rem;font-weight:700" }, bi(L, "Outline / Effect Color:", "Warna Outline / Effect:")),
    ["#0f172a", "#dc2626", "#2563eb", "#7c2ae8", "#ffffff"].map((hex) => h("button", {
      type: "button",
      style: `width:24px;height:24px;border-radius:50%;background:${hex};border:2px solid #cbd5e1;cursor:pointer`,
      onclick: () => { outColor = hex; sync(); }
    }))
  );

  sync();

  return h("div", { class: "guide-sim-box" },
    h("div", { class: "canva-artboard-wrap", style: "padding:22px 14px 36px" },
      h("div", {
        class: "canva-artboard",
        style: "min-height:155px;background:linear-gradient(135deg, #1e1b4b 0%, #7e22ce 50%, #f59e0b 100%);color:#fff"
      }, sel.box)
    ),
    h("div", { class: "sim-controls" }, chipRow, sThick.row, colorRow)
  );
}

/* ---------- Master Guide Sections List ---------- */
const GUIDE_SECTIONS = [
  {
    id: "tool-1",
    num: 1,
    short: { en: "Add Text Box", id: "Add Text Box" },
    kicker: { en: "Tool 1 of 8 · Text Box Basics", id: "Tool 1 dari 8 · Text Box Basics" },
    title: { en: "Adding a Text Box", id: "Menambahkan Text Box" },
    lead: {
      en: "All text in Canva lives inside movable containers called Text Boxes.",
      id: "Semua teks di Canva berada di dalam container fleksibel yang disebut Text Box."
    },
    steps: {
      en: [
        "Fastest way: Click anywhere on your canvas and press the T key on your keyboard.",
        "Sidebar way: Click the Text (T) tab on the far-left sidebar, then click 'Add a text box' (or choose Heading, Subheading, or Body text).",
        "Double-click inside the text box to type or replace the words."
      ],
      id: [
        "Shortcut tercepat: Klik area canvas lalu tekan tombol T pada keyboard.",
        "Lewat Left Sidebar: Klik tab Text (T) di Left Sidebar, lalu klik 'Add a text box' (atau pilih Heading, Subheading, atau Body text).",
        "Double-click di dalam Text Box untuk mulai mengetik atau mengganti teks."
      ]
    },
    tip: {
      en: "Single-click selects the box to move/style it; double-click highlights the text inside so you can type.",
      id: "Single-click untuk memilih/memindahkan Text Box; double-click untuk mengedit isi teks di dalamnya."
    },
    buildSim: buildAddTextbox
  },
  {
    id: "tool-2",
    num: 2,
    short: { en: "Resize & Wrap", id: "Resize Text Box" },
    kicker: { en: "Tool 2 of 8 · Handles & Wrapping", id: "Tool 2 dari 8 · Handles & Text Wrapping" },
    title: { en: "Resizing a Text Box", id: "Mengubah Ukuran (Resize) Text Box" },
    lead: {
      en: "Canva uses two different handle shapes on a selected text box—each does a completely different job.",
      id: "Canva memiliki dua bentuk handle berbeda pada frame ungu Text Box dengan fungsi yang berbeda pula."
    },
    steps: {
      en: [
        "4 Corner Circle Handles (○): Drag outward or inward to scale the actual font size proportionally.",
        "2 Side Pill Handles (▯): Drag left or right to make the box narrower or wider—wrapping words onto new lines WITHOUT changing the font size.",
        "Bottom Rotate Handle (↻): Drag the curved arrow below the box to tilt your text at an angle."
      ],
      id: [
        "4 Corner Circle Handles (○): Drag ke luar atau ke dalam untuk memperbesar/memperkecil Font Size secara proporsional.",
        "2 Side Pill Handles (▯): Drag ke kiri atau kanan untuk mengubah lebar Text Box—menurunkan kata ke baris baru (text wrapping) TANPA mengubah Font Size.",
        "Bottom Rotate Handle (↻): Drag ikon panah melengkung di bawah Text Box untuk memutar sudut kemiringan teks."
      ]
    },
    tip: {
      en: "Instead of pressing Enter to break lines manually, drag the Side Pill Handles (▯) inward so your title wraps cleanly.",
      id: "Jangan memotong baris dengan tombol Enter berulang kali—cukup drag Side Pill Handles (▯) ke dalam agar teks turun baris secara rapi."
    },
    buildSim: buildResizeTextbox
  },
  {
    id: "tool-3",
    num: 3,
    short: { en: "Choose Font", id: "Choose Font" },
    kicker: { en: "Tool 3 of 8 · Typeface Selection", id: "Tool 3 dari 8 · Font Selection" },
    title: { en: "Choosing a Font", id: "Memilih Font" },
    lead: {
      en: "Every font carries a distinct personality—from loud action display fonts to clean body text.",
      id: "Setiap Font membawa karakter visual yang berbeda—mulai dari Display font yang tegas hingga Body text yang bersih."
    },
    steps: {
      en: [
        "Select your text box so the Top Toolbar appears.",
        "Click the Font dropdown on the far left of the top toolbar.",
        "Type a font name or search by style category ('Display', 'Sans Serif', 'Serif', 'Handwriting', 'Comic') and click any font to apply it."
      ],
      id: [
        "Klik Text Box hingga Top Toolbar muncul di bagian atas layar.",
        "Klik Font dropdown di sisi paling kiri Top Toolbar.",
        "Ketik nama Font atau cari kategori ('Display', 'Sans Serif', 'Serif', 'Handwriting', 'Comic') lalu klik Font untuk menerapkannya."
      ]
    },
    tip: {
      en: "Use expressive Display fonts for short main titles, and clean Sans Serif or Serif fonts for subheadings and body text.",
      id: "Gunakan Display font yang ekspresif khusus untuk judul pendek, dan Sans Serif atau Serif yang bersih untuk Subheading serta Body text."
    },
    buildSim: buildChooseFont
  },
  {
    id: "tool-4",
    num: 4,
    short: { en: "Font Size", id: "Font Size" },
    kicker: { en: "Tool 4 of 8 · Scale & Hierarchy", id: "Tool 4 dari 8 · Scale & Hierarchy" },
    title: { en: "Adjusting Font Size", id: "Mengatur Font Size" },
    lead: {
      en: "Size contrast tells the reader what to read first, second, and third.",
      id: "Kontras Font Size memandu mata pembaca mengenai urutan informasi yang paling penting (visual hierarchy)."
    },
    steps: {
      en: [
        "Click the [ − ] or [ + ] buttons next to the Font menu in the top toolbar to step size down or up.",
        "Click the number box to pick a preset size from the list, or type any exact number (e.g. 52) and press Enter.",
        "Keep a clear 3-tier hierarchy: Heading (largest) → Subheading (medium) → Body/Credits (smallest)."
      ],
      id: [
        "Klik tombol [ − ] atau [ + ] di sebelah menu Font pada Top Toolbar untuk mengurangi atau menambah ukuran.",
        "Klik kotak angkanya untuk memilih preset ukuran, atau ketik angka berapa saja (misal 52) lalu tekan Enter.",
        "Pastikan 3 tingkat hierarchy terlihat jelas: Heading (paling besar) → Subheading (sedang) → Body text (kecil)."
      ]
    },
    tip: {
      en: "A good rule of thumb: make your main Heading at least 2× larger than your Subheading.",
      id: "Aturan praktis: buat ukuran Heading utama minimal 2× lebih besar daripada Subheading."
    },
    buildSim: buildFontSize
  },
  {
    id: "tool-5",
    num: 5,
    short: { en: "Text Style", id: "Style & Alignment" },
    kicker: { en: "Tool 5 of 8 · Formatting & Alignment", id: "Tool 5 dari 8 · Text Style & Alignment" },
    title: { en: "Setting Style & Alignment", id: "Mengatur Text Style & Alignment" },
    lead: {
      en: "Format emphasis, casing, and paragraph alignment directly from the center of the top toolbar.",
      id: "Atur penekanan huruf, huruf kapital, dan Alignment langsung dari bagian tengah Top Toolbar."
    },
    steps: {
      en: [
        "Click [B] Bold, [I] Italic, [U] Underline, or [S] Strikethrough to emphasize key words.",
        "Click [aA] (Uppercase) to toggle your entire text box between ALL CAPS and normal casing in one click.",
        "Click [≡ Alignment] repeatedly to cycle through Left, Center, Right, and Justified alignment."
      ],
      id: [
        "Klik [B] Bold, [I] Italic, [U] Underline, atau [S] Strikethrough pada Top Toolbar untuk memberi penekanan.",
        "Klik [aA] (Uppercase) untuk mengubah seluruh teks menjadi ALL CAPS (huruf kapital semua) dalam satu klik.",
        "Klik ikon [≡ Alignment] untuk mengganti posisi teks antara Left, Center, Right, atau Justified."
      ]
    },
    tip: {
      en: "If the [B] Bold button is grayed out, that font (like Anton or Bangers) is a single-weight display font that is already bold.",
      id: "Jika tombol [B] Bold tampak nonaktif (grayed out), artinya Display font tersebut (seperti Anton atau Bangers) memang sudah tebal dari sananya."
    },
    buildSim: buildTextStyle
  },
  {
    id: "tool-6",
    num: 6,
    short: { en: "Font Color", id: "Font Color" },
    kicker: { en: "Tool 6 of 8 · Swatches & Contrast", id: "Tool 6 dari 8 · Color Swatches & Contrast" },
    title: { en: "Choosing Font Color", id: "Memilih Font Color" },
    lead: {
      en: "Pick colors that harmonize with your artwork while maintaining strong readability contrast.",
      id: "Pilih warna teks yang menyatu dengan ilustrasi sekaligus memiliki kontras baca (readability) yang kuat."
    },
    steps: {
      en: [
        "Click the 'A' icon with a rainbow bar in the top toolbar to open the Text Color panel.",
        "Use 'Photo Colors' to pick swatches automatically sampled from the images/illustrations on your page.",
        "Click the '+' rainbow tile to enter a custom #HEX code or use the Eyedropper to sample any color on your canvas."
      ],
      id: [
        "Klik ikon 'A' bergaris pelangi di Top Toolbar untuk membuka panel Text Color.",
        "Gunakan bagian 'Photo Colors' untuk memilih color swatch yang otomatis diambil Canva dari gambar di halamanmu.",
        "Klik tombol '+' pelangi untuk mengetik kode #HEX custom atau gunakan Eyedropper untuk mengambil sampel warna dari canvas."
      ]
    },
    tip: {
      en: "Always pair light text with a dark background, or dark text with a light background so your words stand out.",
      id: "Selalu pasangkan teks terang di atas Dark Background, atau teks gelap di atas Light Background agar mudah dibaca."
    },
    buildSim: buildFontColor
  },
  {
    id: "tool-7",
    num: 7,
    short: { en: "Spacing", id: "Font Spacing" },
    kicker: { en: "Tool 7 of 8 · Letter & Line Spacing", id: "Tool 7 dari 8 · Letter & Line Spacing" },
    title: { en: "Adjusting Font Spacing", id: "Mengatur Font Spacing" },
    lead: {
      en: "Fine-tuning horizontal letter spacing and vertical line spacing makes titles look polished and intentional.",
      id: "Mengatur Letter spacing dan Line spacing membuat susunan judul terlihat jauh lebih rapi dan proporsional."
    },
    steps: {
      en: [
        "Click the Spacing icon (↕≡) in the top toolbar.",
        "Adjust Letter spacing (-200 to 800): widen (+100 to +300) for cinematic taglines, or tighten (-20 to -40) for compact bold titles.",
        "Adjust Line spacing (0.5 to 2.5): lower it to 0.9–1.1 on multi-line titles so the lines lock together as one unit."
      ],
      id: [
        "Klik ikon Spacing (↕≡) pada Top Toolbar.",
        "Atur slider Letter spacing (-200 s/d 800): renggangkan (+100 s/d +300) untuk subheading sinematik, atau rapatkan (-20 s/d -40) untuk judul padat.",
        "Atur slider Line spacing (0.5 s/d 2.5): turunkan ke angka 0.9–1.1 pada judul 2 baris agar jarak antarbaris menyatu kokoh."
      ]
    },
    tip: {
      en: "Canva's default Line spacing (1.4) is made for body paragraphs—always tighten it to ~0.95–1.1 for stacked headlines!",
      id: "Line spacing default Canva (1.4) dirancang untuk Body text—selalu rapatkan ke ~0.95–1.1 saat membuat judul bersusun!"
    },
    buildSim: buildFontSpacing
  },
  {
    id: "tool-8",
    num: 8,
    short: { en: "Effects & Outline", id: "Effects & Outline" },
    kicker: { en: "Tool 8 of 8 · Outline & Visual Effects", id: "Tool 8 dari 8 · Effects & Outline" },
    title: { en: "Setting Effects such as Outline", id: "Mengatur Effects seperti Outline" },
    lead: {
      en: "Canva's Outline effect wraps a solid border around every letter so your title never gets lost over busy artwork.",
      id: "Effect Outline di Canva menambahkan border tegas di sekeliling huruf agar judul tetap terbaca jelas di atas background gambar yang ramai."
    },
    steps: {
      en: [
        "Select your text box and click 'Effects' on the right side of the top toolbar.",
        "Under Style, click 'Outline' to add a solid border around your letters.",
        "Adjust the 'Thickness' slider (1–200) and click the Outline 'Color' swatch to pick a high-contrast border color (or explore Shadow, Lift, Hollow, Splice, Neon, and Background)."
      ],
      id: [
        "Pilih Text Box lalu klik tombol 'Effects' di sisi kanan Top Toolbar.",
        "Pada bagian Style, klik 'Outline' untuk memberi border di sekeliling huruf.",
        "Atur slider 'Thickness' (1–200) dan klik swatch 'Color' untuk memilih warna Outline yang kontras (atau coba effect Shadow, Lift, Hollow, Splice, Neon, dan Background)."
      ]
    },
    tip: {
      en: "Bright inner text (like yellow or white) paired with a dark Outline is the most reliable way to keep titles readable over any illustration.",
      id: "Memadukan warna teks terang (seperti kuning atau putih) dengan Outline gelap adalah cara paling ampuh menjaga keterbacaan judul di atas ilustrasi apa pun."
    },
    buildSim: buildEffectsOutline
  }
];
