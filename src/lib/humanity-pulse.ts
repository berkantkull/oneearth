export type HumanityPulseEntry = {
  word: string;
  count: number;
};

function canonicalWord(word: string) {
  return word.normalize("NFKC").toLocaleLowerCase("tr-TR");
}

export function buildHumanityPulse(words: string[], limit = 12): HumanityPulseEntry[] {
  const counts = new Map<string, HumanityPulseEntry>();

  words.forEach((word) => {
    const key = canonicalWord(word);
    const current = counts.get(key);
    if (current) current.count += 1;
    else counts.set(key, { word, count: 1 });
  });

  return Array.from(counts.values())
    .filter((entry) => entry.count > 1)
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word, "tr", { sensitivity: "base" }))
    .slice(0, limit);
}
