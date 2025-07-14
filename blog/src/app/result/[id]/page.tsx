import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function ResultPage({ params }: { params: { id: string } }) {
    const id = (await params).id;

    const { data, error } = await supabase
        .from("summaries")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-700 text-lg font-semibold">
                Failed to load summary.
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl space-y-10 border border-gray-200">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                        Blog Summary
                    </h1>
                    <Link
                        href="/"
                        className="text-sm sm:text-base px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition"
                    >
                        Back to Home
                    </Link>
                </div>

                {/* URL */}
                <section className="space-y-2">
                    <h2 className="text-lg font-semibold text-gray-700">Source URL</h2>
                    <a
                        href={data.url}
                        target="_blank"
                        className="block text-blue-600 hover:text-blue-800 underline break-words"
                    >
                        {data.url}
                    </a>
                </section>

                {/* English Summary */}
                <section className="space-y-2">
                    <h2 className="text-lg font-semibold text-gray-700">English Summary</h2>
                    <p className="bg-gray-50 p-5 rounded-xl text-gray-800 leading-relaxed border border-gray-200">
                        {data.summary}
                    </p>
                </section>

                {/* Keywords */}
                <section className="space-y-2">
                    <h2 className="text-lg font-semibold text-gray-700">Keywords</h2>
                    <ul className="flex flex-wrap gap-2">
                        {(data.keywords || []).map((k: string) => (
                            <li
                                key={k}
                                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full border border-blue-200 hover:bg-blue-200 transition"
                            >
                                {k}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Urdu Translation */}
                <section className="space-y-2">
                    <h2 className="text-lg font-semibold text-gray-700">Urdu Translation</h2>
                    <p className="bg-green-50 p-5 rounded-xl text-gray-800 leading-relaxed border border-green-100 font-urdu">
                        {data.urdu}
                    </p>
                </section>
            </div>
        </div>
    );
}
