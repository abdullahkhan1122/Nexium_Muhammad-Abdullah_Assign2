// src/components/UrlForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UrlForm() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            const result = await res.json();
            if (result.id) {
                router.push(`/result/${result.id}`);
            } else {
                alert(result.error || "Failed to summarise blog.");
            }
        } catch (err) {
            alert("Something went wrong.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/blog-post"
                className="w-full border-gray-300 shadow-sm focus:ring-black-500 focus:border-black-500"
                required
            />
            <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-700 transition-colors"
                disabled={loading}
            >
                {loading ? "Summarising..." : "Summarise"}
            </Button>
        </form>
    );
}
