(function (root) {
  "use strict";

  const SYSTEMS = {
    pythagorean: {
      name: "Pythagorean",
      chart: {
        1: "AJS", 2: "BKT", 3: "CLU", 4: "DMV", 5: "ENW",
        6: "FOX", 7: "GPY", 8: "HQZ", 9: "IR",
      },
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

  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  function chartFrom(valueOf) {
    const chart = {};
    [...ALPHABET].forEach((letter, i) => {
      const v = valueOf(i);
      chart[v] = (chart[v] || "") + letter;
    });
    return chart;
  }
  SYSTEMS.englishOrdinal = { name: "English Ordinal", group: "gematria", chart: chartFrom(i => i + 1), masters: [11, 22, 33] };
  SYSTEMS.reverseOrdinal = { name: "Reverse Ordinal", group: "gematria", chart: chartFrom(i => 26 - i), masters: [11, 22, 33] };
  SYSTEMS.reverseReduction = { name: "Reverse Reduction", group: "gematria", chart: chartFrom(i => ((25 - i) % 9) + 1), masters: [11, 22, 33] };
  SYSTEMS.pythagorean.group = "numerology";
  SYSTEMS.chaldean.group = "numerology";

  for (const system of Object.values(SYSTEMS)) {
    system.values = {};
    for (const [value, letters] of Object.entries(system.chart)) {
      for (const letter of letters) system.values[letter] = Number(value);
    }
  }

  function reduce(n, masters) {
    const steps = [];
    while (n > 9 && !masters.includes(n)) {
      const digits = String(n).split("").map(Number);
      n = digits.reduce((a, b) => a + b, 0);
      steps.push({ digits, total: n });
    }
    return { steps, value: n };
  }

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
