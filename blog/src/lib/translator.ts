export async function translateToUrdu(text: string): Promise<string> {
  const MAX_CHARS = 500;

  // Function to chunk text into 500 char slices
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += MAX_CHARS) {
    chunks.push(text.slice(i, i + MAX_CHARS));
  }

  const translatedChunks: string[] = [];

  try {
    for (const chunk of chunks) {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=en|ur`
      );
      const data = await res.json();
      translatedChunks.push(data.responseData.translatedText || "");
    }

    return translatedChunks.join(" ");
  } catch (err) {
    console.error("❌ Translation error:", err);
    return "❌ Urdu translation failed (chunked)";
  }
}
