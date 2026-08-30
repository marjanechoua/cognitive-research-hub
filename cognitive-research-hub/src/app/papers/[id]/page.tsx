"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
    getPaper,
    deletePaper,
} from "@/lib/papers";

import {
    getConcepts,
} from "@/lib/concepts";

import {
    connectPaperToConcept,
    disconnectPaperFromConcept,
} from "@/lib/relationships";

import { Paper } from "@/types/paper";
import { Concept } from "@/types/concept";

export default function PaperPage() {
    const params = useParams();
    const router = useRouter();

    const [paper, setPaper] = useState<Paper | null>(null);
    const [concepts, setConcepts] = useState<Concept[]>([]);
    const [loading, setLoading] = useState(true);
    const [showConceptPicker, setShowConceptPicker] = useState(false);

    useEffect(() => {
        async function loadData() {
            const id = params.id as string;

            const foundPaper = await getPaper(id);
            const foundConcepts = await getConcepts();

            const { data: connections, error } = await supabase
                .from("paper_concepts")
                .select("concept_id")
                .eq("paper_id", id);

            if (error) {
                console.error(
                    "Failed to load paper concepts:",
                    error
                );
            }

            const conceptIds =
                connections?.map(
                    (connection) => connection.concept_id
                ) ?? [];

            if (foundPaper) {
                setPaper({
                    ...foundPaper,
                    conceptIds,
                    topics: foundPaper.topics ?? [],
                    authors: foundPaper.authors ?? [],
                });
            } else {
                setPaper(null);
            }

            setConcepts(
                foundConcepts.map((concept) => ({
                    ...concept,
                    paperIds: concept.paperIds ?? [],
                    relations: concept.relations ?? [],
                    aliases: concept.aliases ?? [],
                }))
            );

            setLoading(false);
        }

        loadData();
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



    async function handleAddConcept(concept: Concept) {
        if (!paper) return;

        await connectPaperToConcept(
            paper.id,
            concept.id
        );

        const { data: connections, error } = await supabase
            .from("paper_concepts")
            .select("concept_id")
            .eq("paper_id", paper.id);

        if (error) {
            console.error(
                "Failed to reload paper concepts:",
                error
            );
            return;
        }

        setPaper({
            ...paper,
            conceptIds:
                connections?.map(
                    (connection) => connection.concept_id
                ) ?? [],
        });

        setShowConceptPicker(false);
    }







async function handleRemoveConcept(concept: Concept) {
    if (!paper) return;

    await disconnectPaperFromConcept(
        paper.id,
        concept.id
    );

    const { data: connections, error } = await supabase
        .from("paper_concepts")
        .select("concept_id")
        .eq("paper_id", paper.id);

    if (error) {
        console.error(
            "Failed to reload paper concepts:",
            error
        );
        return;
    }

    setPaper({
        ...paper,
        conceptIds:
            connections?.map(
                (connection) => connection.concept_id
            ) ?? [],
    });
}






    if (loading) {
        return (
            <main className="min-h-screen bg-(--background) text-(--foreground)">
                <div className="mx-auto max-w-5xl px-6 py-10">
                    <p className="text-(--muted)">Loading paper...</p>
                </div>
            </main>
        );
    }

    if (!paper) {
        return (
            <main className="min-h-screen bg-(--background) text-(--foreground)">
                <div className="mx-auto max-w-5xl px-6 py-10">

                    <Link
                        href="/papers"
                        className="text-sm text-(--muted) hover:text-(--foreground)"
                    >
                        ← Back to Papers
                    </Link>

                    <div className="mt-10 rounded-2xl border border-(--border) bg-(--surface) p-8">
                        <h1 className="text-2xl font-semibold">
                            Paper not found
                        </h1>

                        <p className="mt-2 text-(--muted)">
                            This paper does not exist in your research library.
                        </p>
                    </div>

                </div>
            </main>
        );
    }

    const connectedConcepts = (paper.conceptIds ?? [])
        .map((conceptId) =>
            concepts.find((concept) => concept.id === conceptId)
        )
        .filter(
            (concept): concept is Concept => concept !== undefined
        );

    const availableConcepts = concepts.filter(
        (concept) =>
            !(paper.conceptIds ?? []).includes(concept.id)
    );

    return (
        <main className="min-h-screen bg-(--background) text-(--foreground)">
            <div className="mx-auto max-w-5xl px-6 py-10">

                {/* Back navigation */}
                <Link
                    href="/papers"
                    className="text-sm text-(--muted) transition hover:text-(--foreground)"
                >
                    ← Back to Papers
                </Link>

                {/* Header */}
                <header className="mt-8">

                    <div className="flex flex-wrap items-center gap-3">

                        <StatusBadge status={paper.status} />

                        {paper.year && (
                            <span className="text-sm text-(--muted)">
                {paper.year}
              </span>
                        )}

                    </div>

                    <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight">
                        {paper.title}
                    </h1>

                    {paper.authors && (
                        <p className="mt-4 text-lg text-(--muted)">
                            {paper.authors}
                        </p>
                    )}

                    {/* Topics */}
                    {paper.topics.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-2">

                            {paper.topics.map((topic) => (
                                <span
                                    key={topic}
                                    className="rounded-full border border-(--border) bg-(--surface) px-3 py-1 text-sm text-(--foreground)"
                                >
                  {topic}
                </span>
                            ))}

                        </div>
                    )}

                </header>

                {/* Actions */}
                <div className="mt-8 flex flex-wrap gap-3">



                    {paper.doi && (
                        <a
                            href={`https://doi.org/${paper.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl border border-(--border) px-4 py-2 text-sm text-(--foreground) transition hover:border-(--accent) hover:bg-(--accent-soft) hover:text-(--accent)"
                        >
                            DOI ↗
                        </a>
                    )}

                    <Link
                        href={`/papers/${paper.id}/edit`}
                        className="
        rounded-xl
        border border-(--border)
        px-4 py-2
        text-sm text-(--foreground)
        transition
        hover:border-(--accent)
        hover:bg-(--accent-soft)
        hover:text-(--accent)
    "
                    >
                        Edit
                    </Link>

                    <button
                        onClick={handleDelete}
                        className="
        rounded-xl
        border border-red-500
        px-4 py-2
        text-sm font-medium text-red-500
        transition
        hover:bg-red-500
        hover:text-white
    "
                    >
                        Delete
                    </button>

                </div>

                {/* Concepts */}
                <section className="mt-10 rounded-2xl border border-(--border) bg-(--surface) p-6">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <h2 className="text-lg font-semibold">
                                Concepts
                            </h2>

                            <p className="mt-1 text-sm text-(--muted)">
                                Concepts connected to this paper.
                            </p>
                        </div>

                        {concepts.length > 0 && (
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConceptPicker(!showConceptPicker)
                                }
                                className="
        w-fit rounded-xl
        border border-(--border)
        px-4 py-2
        text-sm text-(--foreground)
        transition
        hover:border-(--accent)
        hover:bg-(--accent-soft)
        hover:text-(--accent)
    "
                            >
                                + Add Concept
                            </button>
                        )}

                    </div>

                    {/* Connected concepts */}
                    <div className="mt-5 flex flex-wrap gap-2">

                        {connectedConcepts.length === 0 ? (
                            <p className="text-sm text-(--muted)">
                                No concepts connected yet.
                            </p>
                        ) : (
                            connectedConcepts.map((concept) => (
                                <div
                                    key={concept.id}
                                    className="flex items-center gap-2 rounded-full border border-(--border) bg-(--background) px-3 py-1.5"
                                >

                                    <Link
                                        href={`/concepts/${concept.id}`}
                                        className="text-sm text-(--foreground) transition hover:text-(--accent)"
                                    >
                                        {concept.name}
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveConcept(concept)
                                        }
                                        className="text-(--muted) transition hover:text-(--accent)"
                                        aria-label={`Remove ${concept.name}`}
                                    >
                                        ×
                                    </button>

                                </div>
                            ))
                        )}

                    </div>

                    {/* Concept picker */}
                    {showConceptPicker && (
                        <div className="mt-5 rounded-xl border border-(--border) bg-(--background) p-4">

                            <p className="mb-3 text-sm font-medium text-(--foreground)">
                                Add a concept
                            </p>

                            {availableConcepts.length === 0 ? (
                                <p className="text-sm text-(--muted)">
                                    All available concepts are already connected.
                                </p>
                            ) : (
                                <div className="space-y-1">

                                    {availableConcepts.map((concept) => (
                                        <button
                                            key={concept.id}
                                            type="button"
                                            onClick={() =>
                                                handleAddConcept(concept)
                                            }
                                            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-(--muted) transition hover:bg-(--accent-soft) hover:text-(--accent)"
                                        >
                                            {concept.name}

                                            {concept.field && (
                                                <span className="ml-2 text-xs text-(--subtle)">
                          {concept.field}
                        </span>
                                            )}
                                        </button>
                                    ))}

                                </div>
                            )}

                        </div>
                    )}

                </section>

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
                <section className="mt-12 border-t border-(--border) pt-6">

                    <h2 className="text-sm font-medium uppercase tracking-wider text-(--muted)">
                        Metadata
                    </h2>

                    <dl className="mt-4 grid gap-4 text-sm md:grid-cols-2">

                        <div>
                            <dt className="text-(--muted)">
                                Created
                            </dt>

                            <dd className="mt-1 text-(--foreground)">
                                {new Date(
                                    paper.createdAt
                                ).toLocaleDateString()}
                            </dd>
                        </div>

                        {paper.doi && (
                            <div>
                                <dt className="text-(--muted)">
                                    DOI
                                </dt>

                                <dd className="mt-1 break-all text-(--foreground)">
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
        <section className="rounded-2xl border border-(--border) bg-(--surface) p-6">

            <h2 className="text-lg font-semibold">
                {title}
            </h2>

            {content ? (
                <p className="mt-4 whitespace-pre-wrap leading-7 text-(--foreground)">
                    {content}
                </p>
            ) : (
                <p className="mt-4 italic text-(--subtle)">
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
        <span className="rounded-full border border-(--border) bg-(--surface) px-3 py-1 text-sm text-(--foreground)">
      {labels[status]}
    </span>
    );
}