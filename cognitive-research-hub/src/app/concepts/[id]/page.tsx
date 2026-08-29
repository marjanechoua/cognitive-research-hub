"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { getPapers } from "@/lib/papers";
import { Paper } from "@/types/paper";

import {
    getConcept,
    getConcepts,
    connectConcepts,
    disconnectConcepts,
} from "@/lib/concepts";

import {
    Concept,
    ConceptRelationType,
} from "@/types/concept";




function getRelationLabel(
    type: ConceptRelationType
): string {
    const labels: Record<
        ConceptRelationType,
        string
    > = {
        related: "Related to",
        contrasts: "Contrasts with",
        "part-of": "Part of",
        contains: "Contains",
        causes: "Causes / influences",
        "caused-by": "Caused by",
        supports: "Supports",
        "supported-by": "Supported by",
    };

    return labels[type];
}

export default function ConceptPage() {
    const params = useParams();

    const [papers, setPapers] = useState<Paper[]>([]);
    const [concept, setConcept] =
        useState<Concept | null>(null);

    const [allConcepts, setAllConcepts] =
        useState<Concept[]>([]);

    const [showRelationPicker, setShowRelationPicker] =
        useState(false);

    const [selectedConceptId, setSelectedConceptId] =
        useState("");

    const [selectedRelationType, setSelectedRelationType] =
        useState<ConceptRelationType>("related");

    useEffect(() => {
        const id = params.id as string;

        const foundConcept = getConcept(id);
        const concepts = getConcepts();
        const foundPapers = getPapers();

        if (foundConcept) {
            setConcept({
                ...foundConcept,
                paperIds: foundConcept.paperIds ?? [],
                relations: foundConcept.relations ?? [],
                aliases: foundConcept.aliases ?? [],
            });
        } else {
            setConcept(null);
        }

        setAllConcepts(concepts);
        setPapers(foundPapers);
    }, [params.id]);

    function handleConnectConcept() {
        if (!concept) return;
        if (!selectedConceptId) return;

        connectConcepts(
            concept.id,
            selectedConceptId,
            selectedRelationType
        );

        const updatedConcept = getConcept(concept.id);
        const updatedConcepts = getConcepts();

        setConcept(updatedConcept ?? null);
        setAllConcepts(updatedConcepts);

        setSelectedConceptId("");
        setSelectedRelationType("related");
        setShowRelationPicker(false);
    }

    function handleDisconnectConcept(
        relatedConceptId: string
    ) {
        if (!concept) return;

        disconnectConcepts(
            concept.id,
            relatedConceptId
        );

        const updatedConcept = getConcept(concept.id);
        const updatedConcepts = getConcepts();

        setConcept(updatedConcept ?? null);
        setAllConcepts(updatedConcepts);
    }

    if (!concept) {
        return (
            <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
                <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">

                    <Link
                        href="/concepts"
                        className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
                    >
                        ← Back to Concepts
                    </Link>

                    <div className="mt-12">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Concept not found
                        </h1>

                        <p className="mt-3 text-[var(--muted)]">
                            This concept does not exist in your knowledge base.
                        </p>
                    </div>

                </div>
            </main>
        );
    }

    const relatedConcepts = concept.relations
        .map((relation) => {
            const relatedConcept = allConcepts.find(
                (item) =>
                    item.id === relation.conceptId
            );

            if (!relatedConcept) return null;

            return {
                concept: relatedConcept,
                type: relation.type,
            };
        })
        .filter(
            (
                item
            ): item is {
                concept: Concept;
                type: ConceptRelationType;
            } => item !== null
        );

    const availableConcepts = allConcepts.filter(
        (item) =>
            item.id !== concept.id &&
            !concept.relations.some(
                (relation) =>
                    relation.conceptId === item.id
            )
    );

    return (
        <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">

            <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-12">

                {/* Back navigation */}

                <Link
                    href="/concepts"
                    className="inline-flex items-center text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
                >
                    ← Back to Concepts
                </Link>


                {/* Header */}

                <header className="mt-10">

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                        {concept.field || "Concept"}
                    </p>

                    <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

                        <div className="min-w-0">

                            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                                {concept.name}
                            </h1>

                            {concept.aliases.length > 0 && (
                                <div className="mt-5 flex flex-wrap gap-2">

                                    {concept.aliases.map((alias) => (
                                        <span
                                            key={alias}
                                            className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--muted)]"
                                        >
                                            {alias}
                                        </span>
                                    ))}

                                </div>
                            )}

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setShowRelationPicker(
                                    !showRelationPicker
                                )
                            }
                            className="shrink-0 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)]"
                        >
                            + Connect Concept
                        </button>

                    </div>

                </header>


                {/* Main content */}

                <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">


                    {/* LEFT COLUMN */}

                    <div className="space-y-6">


                        {/* Definition */}

                        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 p-7">

                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                                Definition
                            </p>

                            <p className="mt-5 max-w-3xl whitespace-pre-wrap text-base leading-8 text-zinc-300">
                                {concept.definition ||
                                    "No definition yet."}
                            </p>

                        </section>


                        {/* Notes */}

                        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 p-7">

                            <div className="flex items-center justify-between">

                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                                    My Notes
                                </p>

                            </div>

                            <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">
                                {concept.notes ||
                                    "No notes yet."}
                            </p>

                        </section>

                    </div>


                    {/* RIGHT COLUMN */}

                    <aside>

                        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 p-6">

                            <div className="flex items-start justify-between gap-4">

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                                        Knowledge Graph
                                    </p>

                                    <h2 className="mt-2 text-lg font-semibold">
                                        Related Concepts
                                    </h2>

                                </div>

                                <span className="rounded-full bg-[var(--background)] px-2.5 py-1 text-xs text-[var(--muted)]">
                                    {relatedConcepts.length}
                                </span>

                            </div>


                            {/* Existing relations */}

                            <div className="mt-6 space-y-3">

                                {relatedConcepts.length === 0 ? (

                                    <div className="rounded-xl border border-dashed border-[var(--border)] px-4 py-6 text-center">

                                        <p className="text-sm text-[var(--accent)]">
                                            No relationships yet.
                                        </p>

                                        <p className="mt-1 text-xs text-zinc-700">
                                            Connect this concept to another idea.
                                        </p>

                                    </div>

                                ) : (

                                    relatedConcepts.map(
                                        ({
                                             concept: related,
                                             type,
                                         }) => (

                                            <div
                                                key={related.id}
                                                className="group rounded-xl border border-[var(--border)] bg-[var(--background)]/70 p-4 transition hover:border-[var(--border)]"
                                            >

                                                <div className="flex items-start justify-between gap-3">

                                                    <div className="min-w-0">

                                                        <Link
                                                            href={`/concepts/${related.id}`}
                                                            className="block truncate text-sm font-medium text-[var(--foreground)] transition hover:text-[var(--foreground)]"
                                                        >
                                                            {related.name}
                                                        </Link>

                                                        <p className="mt-1.5 text-xs text-[var(--accent)]">
                                                            {getRelationLabel(type)}
                                                        </p>

                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDisconnectConcept(
                                                                related.id
                                                            )
                                                        }
                                                        className="text-lg leading-none text-zinc-700 opacity-0 transition group-hover:opacity-100 hover:text-zinc-300"
                                                        aria-label="Remove relationship"
                                                    >
                                                        ×
                                                    </button>

                                                </div>

                                            </div>

                                        )
                                    )

                                )}

                            </div>


                            {/* Relation picker */}

                            {showRelationPicker && (
                                <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--background)] p-5">

                                    <p className="text-sm font-medium text-zinc-300">
                                        Create relationship
                                    </p>

                                    <div className="mt-5 space-y-4">

                                        <div>

                                            <label className="text-xs text-[var(--muted)]">
                                                Concept
                                            </label>

                                            <select
                                                value={
                                                    selectedConceptId
                                                }
                                                onChange={(event) =>
                                                    setSelectedConceptId(
                                                        event.target.value
                                                    )
                                                }
                                                className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-zinc-300 outline-none transition focus:border-zinc-600"
                                            >

                                                <option value="">
                                                    Select concept...
                                                </option>

                                                {availableConcepts.map(
                                                    (item) => (
                                                        <option
                                                            key={item.id}
                                                            value={item.id}
                                                        >
                                                            {item.name}
                                                        </option>
                                                    )
                                                )}

                                            </select>

                                        </div>


                                        <div>

                                            <label className="text-xs text-[var(--muted)]">
                                                Relationship
                                            </label>

                                            <select
                                                value={
                                                    selectedRelationType
                                                }
                                                onChange={(event) =>
                                                    setSelectedRelationType(
                                                        event.target
                                                            .value as ConceptRelationType
                                                    )
                                                }
                                                className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-zinc-300 outline-none transition focus:border-zinc-600"
                                            >

                                                <option value="related">
                                                    Related to
                                                </option>

                                                <option value="contrasts">
                                                    Contrasts with
                                                </option>

                                                <option value="part-of">
                                                    Part of
                                                </option>

                                                <option value="causes">
                                                    Causes / influences
                                                </option>

                                                <option value="supports">
                                                    Supports
                                                </option>

                                            </select>

                                        </div>


                                        <button
                                            type="button"
                                            disabled={
                                                !selectedConceptId
                                            }
                                            onClick={
                                                handleConnectConcept
                                            }
                                            className="w-full rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Create Relationship
                                        </button>

                                    </div>

                                </div>
                            )}

                        </section>

                    </aside>

                </div>


                {/* Connected Papers */}

                <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 p-7">

                    <div className="flex items-end justify-between gap-4">

                        <div>

                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                                Research
                            </p>

                            <h2 className="mt-2 text-lg font-semibold">
                                Connected Papers
                            </h2>

                            <p className="mt-1 text-sm text-[var(--muted)]">
                                Papers associated with this concept.
                            </p>

                        </div>

                        <span className="text-sm text-[var(--accent)]">
                            {concept.paperIds.length}
                        </span>

                    </div>


                    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

                        {concept.paperIds.length === 0 ? (

                            <div className="sm:col-span-2 xl:col-span-3">

                                <div className="rounded-xl border border-dashed border-[var(--border)] px-6 py-10 text-center">

                                    <p className="text-sm text-[var(--accent)]">
                                        No papers connected yet.
                                    </p>

                                </div>

                            </div>

                        ) : (

                            concept.paperIds.map((paperId) => {

                                const paper = papers.find(
                                    (paper) =>
                                        paper.id === paperId
                                );

                                if (!paper) return null;

                                return (
                                    <Link
                                        key={paper.id}
                                        href={`/papers/${paper.id}`}
                                        className="group rounded-xl border border-[var(--border)] bg-[var(--background)]/70 p-5 transition hover:-translate-y-0.5 hover:border-[var(--border)]"
                                    >

                                        <div className="flex h-full flex-col">

                                            <div>

                                                <h3 className="line-clamp-3 text-sm font-medium leading-6 text-[var(--foreground)] transition group-hover:text-[var(--foreground)]">
                                                    {paper.title}
                                                </h3>

                                                {paper.authors && (
                                                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--accent)]">
                                                        {paper.authors}
                                                    </p>
                                                )}

                                            </div>

                                            <div className="mt-auto flex gap-3 pt-5 text-xs text-zinc-700">

                                                {paper.year && (
                                                    <span>
                                                        {paper.year}
                                                    </span>
                                                )}

                                                <span>
                                                    {paper.status}
                                                </span>

                                            </div>

                                        </div>

                                    </Link>
                                );
                            })
                        )}

                    </div>

                </section>


                {/* Metadata */}

                <section className="mt-6 border-t border-zinc-900 pt-6">

                    <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs text-zinc-700">

                        <span>
                            Created{" "}
                            {new Date(
                                concept.createdAt
                            ).toLocaleDateString()}
                        </span>

                        <span>
                            Updated{" "}
                            {new Date(
                                concept.updatedAt
                            ).toLocaleDateString()}
                        </span>

                        <span>
                            {concept.paperIds.length}{" "}
                            {concept.paperIds.length === 1
                                ? "paper"
                                : "papers"}
                        </span>

                        <span>
                            {relatedConcepts.length}{" "}
                            {relatedConcepts.length === 1
                                ? "relationship"
                                : "relationships"}
                        </span>

                    </div>

                </section>

            </div>

        </main>
    );
}