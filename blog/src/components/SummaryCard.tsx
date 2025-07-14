// Directory: src/components/SummaryCard.tsx
import React from "react";

interface Props {
    url: string;
    summary: string;
    keywords: string[];
    urdu: string;
}

export default function SummaryCard({ url, summary, keywords, urdu }: Props) {
    return (
        <div className="border rounded-xl shadow p-6 space-y-3">
            <p><strong>Blog URL:</strong> <a href={url} target="_blank" className="text-blue-600 underline">{url}</a></p>
            <p><strong>Summary:</strong> {summary}</p>
            <p><strong>Keywords:</strong> {keywords.join(", ")}</p>
            <p><strong>Urdu:</strong> {urdu}</p>
        </div>
    );
}
