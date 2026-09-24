// Numerology systems shared by the website (and later the extension).
// Plain script: defines a global `Numerology`, so it can be loaded with a
// <script> tag or listed before content.js in an extension manifest.
(function (root) {
  "use strict";

  // Each chart lists the letters under each value, the way the systems are
  // traditionally printed. Letter values are derived from these columns.
  const SYSTEMS = {
    pythagorean: {
      name: "Pythagorean",
      chart: {
        1: "AJS", 2: "BKT", 3: "CLU", 4: "DMV", 5: "ENW",
        6: "FOX", 7: "GPY", 8: "HQZ", 9: "IR",
      },
      // 11, 22 and 33 are kept instead of being reduced further
      masters: [11, 22, 33],
    },
    chaldean: {
      name: "Chaldean",
      chart: {
        1: "AIJQY", 2: "BKR", 3: "CGLS", 4: "DMT",
        5: "EHNX", 6: "UVW", 7: "OZ", 8: "FP",
      },
      masters: [],
    },
  };

  for (const system of Object.values(SYSTEMS)) {
    system.values = {};
    for (const [value, letters] of Object.entries(system.chart)) {
      for (const letter of letters) system.values[letter] = Number(value);
    }
  }

  // Adds up digits until one is left, stopping early on a master number.
  // Returns every intermediate step so the working can be shown.
  function reduce(n, masters) {
    const steps = [];
    while (n > 9 && !masters.includes(n)) {
      const digits = String(n).split("").map(Number);
      n = digits.reduce((a, b) => a + b, 0);
      steps.push({ digits, total: n });
    }
    return { steps, value: n };
  }

  // Letters A–Z use the system's chart, digits count as themselves,
  // everything else (spaces, punctuation, accented letters) is skipped.
  function calculate(systemId, text) {
    const system = SYSTEMS[systemId];
    if (!system) throw new Error(`Unknown numerology system: ${systemId}`);

    const terms = [];
    for (const ch of String(text).toUpperCase()) {
      if (ch >= "A" && ch <= "Z") terms.push({ char: ch, value: system.values[ch], kind: "letter" });
      else if (ch >= "0" && ch <= "9") terms.push({ char: ch, value: Number(ch), kind: "digit" });
    }
    const raw = terms.reduce((sum, t) => sum + t.value, 0);
    const { steps, value } = reduce(raw, system.masters);

    return {
      system: systemId,
      terms,
      raw,
      steps,
      reduced: value,
      isMaster: system.masters.includes(value),
    };
  }

  root.Numerology = { SYSTEMS, calculate, reduce };
})(typeof globalThis !== "undefined" ? globalThis : this);
