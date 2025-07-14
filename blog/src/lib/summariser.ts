// src/lib/summariser.ts

export function generateSummary(text: string): string {
  const sentences = text.split(/(?<=[.؟!])\s+/); // Split into sentences

  // Count word frequencies
  const wordFreq: Record<string, number> = {};
  const stopwords = new Set(["the", "and", "is", "in", "to", "of", "a", "on", "for", "with", "as", "by", "at", "an", "are"]);

  const words = text.toLowerCase().match(/\w+/g) || [];
  for (const word of words) {
    if (!stopwords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  }

  // Score sentences
  const sentenceScores = sentences.map(sentence => {
    const sentenceWords = sentence.toLowerCase().match(/\w+/g) || [];
    const score = sentenceWords.reduce((sum, word) => sum + (wordFreq[word] || 0), 0);
    return { sentence, score };
  });

  // Sort and select top N sentences
  const topSentences = sentenceScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 4) // Take top 4 important sentences
    .map(s => s.sentence.trim());

  return topSentences.join(" ");
}
// src/lib/summariser.ts

export function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().match(/\w+/g) || [];
  const stopwords = new Set([
    "the", "and", "is", "in", "to", "of", "a", "on", "for", "with",
    "as", "by", "at", "an", "are", "was", "were", "it", "this", "that"
  ]);

  const freqMap: Record<string, number> = {};

  for (const word of words) {
    if (!stopwords.has(word) && word.length > 3) {
      freqMap[word] = (freqMap[word] || 0) + 1;
    }
  }

  const sorted = Object.entries(freqMap).sort((a, b) => b[1] - a[1]);

  return sorted.slice(0, 5).map(([word]) => word); // top 5 keywords
}
