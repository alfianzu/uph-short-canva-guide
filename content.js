"use strict";

/* ============================================================
   Canva Text Guide – Shared Font Library & Helpers
   ============================================================ */

const FONT_LIST = [
  {
    n: "Anton",
    cat: "display",
    multiWeight: false,
    stack: "'Anton', sans-serif",
    desc: {
      en: "Heavy, condensed display font. Great for bold headlines and action titles.",
      id: "Display font tebal dan padat. Sangat pas untuk headline dan judul utama yang tegas."
    }
  },
  {
    n: "Montserrat",
    cat: "sans",
    multiWeight: true,
    stack: "'Montserrat', sans-serif",
    desc: {
      en: "Clean geometric sans-serif with multiple weights (Regular to Bold).",
      id: "Sans-serif geometris yang bersih dengan pilihan weight lengkap (Regular hingga Bold)."
    }
  },
  {
    n: "Fraunces",
    cat: "serif",
    multiWeight: true,
    stack: "'Fraunces', Georgia, serif",
    desc: {
      en: "Warm, expressive editorial serif with classic charm.",
      id: "Serif editorial yang hangat dan ekspresif dengan sentuhan klasik."
    }
  },
  {
    n: "Poppins",
    cat: "sans",
    multiWeight: true,
    stack: "'Poppins', sans-serif",
    desc: {
      en: "Friendly, modern geometric sans-serif for subheadings and body text.",
      id: "Sans-serif modern yang ramah, cocok untuk Subheading maupun Body text."
    }
  },
  {
    n: "Fredoka",
    cat: "display",
    multiWeight: true,
    stack: "'Fredoka', sans-serif",
    desc: {
      en: "Rounded, playful, and soft—ideal for fun posters and kids' themes.",
      id: "Display font membulat, ceria, dan lembut—cocok untuk poster santai atau tema anak."
    }
  },
  {
    n: "Orbitron",
    cat: "display",
    multiWeight: true,
    stack: "'Orbitron', sans-serif",
    desc: {
      en: "Futuristic sci-fi geometric typeface for tech and space designs.",
      id: "Font geometris futuristis untuk tema teknologi dan sci-fi."
    }
  },
  {
    n: "Pirata One",
    cat: "display",
    multiWeight: false,
    stack: "'Pirata One', serif",
    desc: {
      en: "Gothic blackletter display font for fantasy, mystery, or vintage titles.",
      id: "Display font bergaya gothic untuk tema fantasi, misteri, atau vintage."
    }
  },
  {
    n: "Caveat",
    cat: "handwriting",
    multiWeight: true,
    stack: "'Caveat', cursive",
    desc: {
      en: "Casual handwritten script for personal notes, quotes, and organic tags.",
      id: "Font handwriting kasual untuk catatan personal dan aksen organik."
    }
  },
  {
    n: "Bangers",
    cat: "display",
    multiWeight: false,
    stack: "'Bangers', cursive",
    desc: {
      en: "Energetic comic-book display lettering with built-in forward punch.",
      id: "Display font bergaya komik yang penuh energi dan dinamis."
    }
  },
  {
    n: "Libre Baskerville",
    cat: "serif",
    multiWeight: true,
    stack: "'Libre Baskerville', Georgia, serif",
    desc: {
      en: "Traditional book serif built for comfortable long-form reading.",
      id: "Serif klasik yang nyaman dibaca untuk Body text atau paragraf panjang."
    }
  }
];

const fontStack = (f) => (typeof f === "string" ? (FONT_LIST.find((x) => x.n === f) || FONT_LIST[0]).stack : f.stack);
