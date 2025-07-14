import { NextResponse } from "next/server";
import { scrapeBlogText } from "@/lib/scraper";
import { generateSummary, extractKeywords } from "@/lib/summariser";
import { translateToUrdu } from "@/lib/translator";
import { supabase } from "@/lib/supabase";
import { fullTextCollection } from "@/lib/mongo";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = body?.url;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    console.log("🔍 Scraping blog:", url);
    const fullText = await scrapeBlogText(url);

    if (!fullText || fullText.length < 100) {
      console.error(" Scraping failed or returned too little text");
      console.log(" Scraped content preview:", fullText?.slice(0, 200));
      return NextResponse.json({ error: "Unable to extract content" }, { status: 400 });
    }

    const summary = generateSummary(fullText);
    const keywords = extractKeywords(fullText);

    //  Attempt Urdu translation with fallback
    let urdu: string;
    try {
      urdu = await translateToUrdu(summary);
      if (!urdu || urdu.includes("Translation failed")) {
        throw new Error("Empty or failed Urdu translation.");
      }
    } catch (translateError) {
      console.warn(" Urdu translation failed:", translateError);
      urdu = "❌ Urdu translation failed.";
    }

    //  Save full blog content in MongoDB
    const fullTextDoc = await fullTextCollection.insertOne({ url, fullText });

    //  Save summary data in Supabase
    const { data, error } = await supabase
      .from("summaries")
      .insert([
        {
          url,
          summary,
          keywords,
          urdu,
          mongo_id: fullTextDoc.insertedId.toString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(" Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save summary" }, { status: 500 });
    }

    console.log("Summary saved with ID:", data.id);
    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error(" API error in /api/submit:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
