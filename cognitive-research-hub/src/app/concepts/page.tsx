"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getConcepts } from "@/lib/concepts";
import { Concept } from "@/types/concept";

export default function ConceptsPage() {
    const [concepts, setConcepts] = useState<Concept[]>([]);


useEffect(() => {
    setConcepts(getConcepts());
}, []);

return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <div className="mx-auto max-w-6xl px-6 py-12">

            {/* Header */}
            <header className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

                <div className="max-w-2xl">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />

                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                            Knowledge Base
                        </p>
                    </div>

                    <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                        Concepts
                    </h1>

                    <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted)]">
                        Build and connect the concepts behind your research.
                        Over time, these concepts will form your personal
                        research knowledge graph.
                    </p>
                </div>

                <Link
                    href="/concepts/new"
                    className="
                        inline-flex w-fit items-center gap-2
                        rounded-xl
                        bg-[var(--accent)]
                        px-5 py-2.5
                        text-sm font-medium text-white
                        shadow-sm
                        transition
                        hover:bg-[var(--accent-hover)]
                        hover:shadow-md
                    "
                >
                    <span className="text-lg leading-none">+</span>
                    Add Concept
                </Link>

            </header>

            {/* Stats */}
            {concepts.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-3">

                    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                        <p className="text-xs text-[var(--muted)]">
                            Concepts
                        </p>

                        <p className="mt-1 text-lg font-semibold">
                            {concepts.length}
                        </p>
                    </div>

                    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                        <p className="text-xs text-[var(--muted)]">
                            Connections
                        </p>

                        <p className="mt-1 text-lg font-semibold">
                            {concepts.reduce(
                                (total, concept) =>
                                    total + concept.relations.length,
                                0
                            )}
                        </p>
                    </div>

                    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                        <p className="text-xs text-[var(--muted)]">
                            Papers linked
                        </p>

                        <p className="mt-1 text-lg font-semibold">
                            {new Set(
                                concepts.flatMap(
                                    (concept) => concept.paperIds
                                )
                            ).size}
                        </p>
                    </div>

                </div>
            )}

            {/* Concepts */}
            {concepts.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {concepts.map((concept) => (
                        <ConceptCard
                            key={concept.id}
                            concept={concept}
                        />
                    ))}
                </div>
            )}

        </div>
    </main>
);


}

function ConceptCard({
                         concept,
                     }: {
    concept: Concept;
}) {
    return (
        <Link
            href={`/concepts/${concept.id}`}
            className="
group
flex min-h-[260px] flex-col
rounded-2xl
border border-[var(--border)]
bg-[var(--surface)]
p-6
shadow-sm
transition-all duration-200
hover:-translate-y-1
hover:border-[var(--accent)]
hover:shadow-md
"
        >
            {/* Top */} <div className="flex items-start justify-between gap-4">


            <div className="min-w-0">
                {concept.field && (
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                        {concept.field}
                    </p>
                )}

                <h2 className="mt-2 text-xl font-semibold tracking-tight">
                    {concept.name}
                </h2>
            </div>

            <span
                className="
                    flex h-8 w-8 shrink-0
                    items-center justify-center
                    rounded-lg
                    bg-[var(--accent-soft)]
                    text-[var(--accent)]
                    transition
                    group-hover:translate-x-0.5
                "
            >
                →
            </span>

        </div>

            {/* Definition */}
            <div className="mt-5 flex-1">
                {concept.definition ? (
                    <p className="line-clamp-4 text-sm leading-6 text-[var(--muted)]">
                        {concept.definition}
                    </p>
                ) : (
                    <p className="text-sm italic text-[var(--subtle)]">
                        No definition yet.
                    </p>
                )}
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center gap-4 border-t border-[var(--border)] pt-4 text-xs text-[var(--muted)]">

            <span>
                {concept.paperIds.length}{" "}
                {concept.paperIds.length === 1
                    ? "paper"
                    : "papers"}
            </span>

                <span className="h-1 w-1 rounded-full bg-[var(--subtle)]" />

                <span>
                {concept.relations.length}{" "}
                    {concept.relations.length === 1
                        ? "connection"
                        : "connections"}
            </span>

            </div>
        </Link>
    );


}

function EmptyState() {
return ( <div
         className="
             mt-10
             rounded-2xl
             border border-dashed border-[var(--border)]
             bg-[var(--surface)]
             px-6 py-16
             text-center
         "
     > <div
             className="
                 mx-auto flex h-14 w-14
                 items-center justify-center
                 rounded-2xl
                 bg-[var(--accent-soft)]
                 text-xl text-[var(--accent)]
             "
         >
✦ </div>


    <h2 className="mt-5 text-lg font-semibold">
        No concepts yet
    </h2>

    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
        Concepts will become the nodes of your personal
        research knowledge graph.
    </p>

    <Link
        href="/concepts/new"
        className="
                mt-6 inline-flex
                rounded-xl
                bg-[var(--accent)]
                px-4 py-2.5
                text-sm font-medium text-white
                transition
                hover:bg-[var(--accent-hover)]
            "
    >
        Create your first concept
    </Link>
</div>
);


}
