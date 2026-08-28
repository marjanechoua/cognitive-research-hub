"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getPaper, deletePaper } from "@/lib/papers";
import { Paper } from "@/types/paper";

export default function PaperPage() {
    const params = useParams();
    const router = useRouter();

    const [paper, setPaper] = useState<Paper | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const id = params.id as string;

        const foundPaper = getPaper(id);

        setPaper(foundPaper ?? null);
        setLoading(false);
    }, [params.id]);

    function handleDelete() {
        if (!paper) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this paper?"
        );

        if (!confirmed) return;

        deletePaper(paper.id);
        router.push("/papers");
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-zinc-950 text-zinc-100">
                <div className="mx-auto max-w-5xl px-6 py-10">
                    <p className="text-zinc-500">Loading paper...</p>
                </div>
            </main>
        );
    }

    if (!paper) {
        return (
            <main className="min-h-screen bg-zinc-950 text-zinc-100">
                <div className="mx-auto max-w-5xl px-6 py-10">

                    <Link
                        href="/papers"
                        className="text-sm text-zinc-400 hover:text-zinc-200"
                    >
                        ← Back to Papers
                    </Link>

                    <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
                        <h1 className="text-2xl font-semibold">
                            Paper not found
                        </h1>

                        <p className="mt-2 text-zinc-400">
                            This paper does not exist in your research library.
                        </p>
                    </div>

                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="mx-auto max-w-5xl px-6 py-10">

                {/* Back navigation */}
                <Link
                    href="/papers"
                    className="text-sm text-zinc-400 transition hover:text-zinc-200"
                >
                    ← Back to Papers
                </Link>

                {/* Header */}
                <header className="mt-8">

                    <div className="flex flex-wrap items-center gap-3">

                        <StatusBadge status={paper.status} />

                        {paper.year && (
                            <span className="text-sm text-zinc-500">
                {paper.year}
              </span>
                        )}

                    </div>

                    <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight">
                        {paper.title}
                    </h1>

                    {paper.authors && (
                        <p className="mt-4 text-lg text-zinc-400">
                            {paper.authors}
                        </p>
                    )}

                    {/* Topics */}
                    {paper.topics.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {paper.topics.map((topic) => (
                                <span
                                    key={topic}
                                    className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm text-zinc-300"
                                >
                  {topic}
                </span>
                            ))}
                        </div>
                    )}

                </header>

                {/* Actions */}
                <div className="mt-8 flex flex-wrap gap-3">

                    {paper.url && (
                        <a
                            href={paper.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200"
                        >
                            Open Paper ↗
                        </a>
                    )}

                    {paper.doi && (
                        <a
                            href={`https://doi.org/${paper.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-500 hover:text-white"
                        >
                            DOI ↗
                        </a>
                    )}

                    <button
                        onClick={handleDelete}
                        className="rounded-xl border border-red-900/50 px-4 py-2 text-sm text-red-400 transition hover:border-red-800 hover:bg-red-950/30"
                    >
                        Delete
                    </button>
                    <Link
                        href={`/papers/${paper.id}/edit`}
                        className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-500 hover:text-white"
                    >
                        Edit
                    </Link>

                </div>

                {/* Research Analysis */}
                <div className="mt-12 space-y-6">

                    <ResearchSection
                        title="Research Question"
                        content={paper.researchQuestion}
                    />

                    <ResearchSection
                        title="Method"
                        content={paper.method}
                    />

                    <ResearchSection
                        title="Key Results"
                        content={paper.results}
                    />

                    <ResearchSection
                        title="My Interpretation"
                        content={paper.interpretation}
                    />

                    <ResearchSection
                        title="My Critique"
                        content={paper.critique}
                    />

                    <ResearchSection
                        title="What I Learned"
                        content={paper.whatILearned}
                    />

                </div>

                {/* Metadata */}
                <section className="mt-12 border-t border-zinc-800 pt-6">

                    <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
                        Metadata
                    </h2>

                    <dl className="mt-4 grid gap-4 text-sm md:grid-cols-2">

                        <div>
                            <dt className="text-zinc-500">
                                Created
                            </dt>

                            <dd className="mt-1 text-zinc-300">
                                {new Date(paper.createdAt).toLocaleDateString()}
                            </dd>
                        </div>

                        {paper.doi && (
                            <div>
                                <dt className="text-zinc-500">
                                    DOI
                                </dt>

                                <dd className="mt-1 break-all text-zinc-300">
                                    {paper.doi}
                                </dd>
                            </div>
                        )}

                    </dl>

                </section>

            </div>
        </main>
    );
}

function ResearchSection({
                             title,
                             content,
                         }: {
    title: string;
    content: string;
}) {
    return (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

            <h2 className="text-lg font-semibold">
                {title}
            </h2>

            {content ? (
                <p className="mt-4 whitespace-pre-wrap leading-7 text-zinc-300">
                    {content}
                </p>
            ) : (
                <p className="mt-4 italic text-zinc-600">
                    No notes yet.
                </p>
            )}

        </section>
    );
}

function StatusBadge({
                         status,
                     }: {
    status: Paper["status"];
}) {
    const labels = {
        "to-read": "To Read",
        reading: "Reading",
        read: "Read",
        analyzed: "Analyzed",
    };

    return (
        <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm text-zinc-300">
      {labels[status]}
    </span>
    );
}