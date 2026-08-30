"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { getConcepts } from "@/lib/concepts";
import { Concept } from "@/types/concept";

export default function ConceptsPage() {
    const [concepts, setConcepts] = useState<Concept[]>([]);

    useEffect(() => {
        async function loadConcepts() {
            const data = await getConcepts();

            // Load Paper ↔ Concept relationships
            const {
                data: paperConcepts,
                error: paperConceptsError,
            } = await supabase
                .from("paper_concepts")
                .select("paper_id, concept_id");

            if (paperConceptsError) {
                console.error(
                    "Failed to load paper-concept relationships:",
                    paperConceptsError
                );
            }

            // Load Concept ↔ Concept relationships
            const {
                data: conceptRelations,
                error: conceptRelationsError,
            } = await supabase
                .from("concept_relations")
                .select(
                    "concept_id, related_concept_id, relation_type"
                );

            if (conceptRelationsError) {
                console.error(
                    "Failed to load concept relationships:",
                    conceptRelationsError
                );
            }

            const normalizedConcepts = data.map((concept) => {
                const paperIds =
                    paperConcepts
                        ?.filter(
                            (relation) =>
                                relation.concept_id === concept.id
                        )
                        .map(
                            (relation) =>
                                relation.paper_id
                        ) ?? [];

                const relations =
                    conceptRelations
                        ?.filter(
                            (relation) =>
                                relation.concept_id === concept.id
                        )
                        .map((relation) => ({
                            conceptId:
                            relation.related_concept_id,
                            type:
                            relation.relation_type,
                        })) ?? [];

                return {
                    ...concept,
                    aliases: concept.aliases ?? [],
                    relations,
                    paperIds,
                    notes: concept.notes ?? "",
                    definition: concept.definition ?? "",
                    field: concept.field ?? "",
                };
            });

            setConcepts(normalizedConcepts);
        }

        loadConcepts();
    }, []);



return (
    <main className="min-h-screen bg-(--background) text-(--foreground)">
        <div className="mx-auto max-w-6xl px-6 py-12">

            {/* Header */}
            <header className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

                <div className="max-w-2xl">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-(--accent)" />

                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--accent)">
                            Knowledge Base
                        </p>
                    </div>

                    <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                        Concepts
                    </h1>

                    <p className="mt-4 max-w-xl text-base leading-7 text-(--muted)">
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
                        bg-(--accent)
                        px-5 py-2.5
                        text-sm font-medium text-white
                        shadow-sm
                        transition
                        hover:bg-(--accent-hover)
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

                    <div className="rounded-xl border border-(--border) bg-(--surface) px-4 py-3">
                        <p className="text-xs text-(--muted)">
                            Concepts
                        </p>

                        <p className="mt-1 text-lg font-semibold">
                            {concepts.length}
                        </p>
                    </div>

                    <div className="rounded-xl border border-(--border) bg-(--surface) px-4 py-3">
                        <p className="text-xs text-(--muted)">
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

                    <div className="rounded-xl border border-(--border) bg-(--surface) px-4 py-3">
                        <p className="text-xs text-(--muted)">
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
flex min-h-65 flex-col
rounded-2xl
border border-(--border)
bg-(--surface)
p-6
shadow-sm
transition-all duration-200
hover:-translate-y-1
hover:border-(--accent)
hover:shadow-md
"
        >
            {/* Top */} <div className="flex items-start justify-between gap-4">


            <div className="min-w-0">
                {concept.field && (
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--accent)">
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
                    bg-(--accent-soft)
                    text-(--accent)
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
                    <p className="line-clamp-4 text-sm leading-6 text-(--muted)">
                        {concept.definition}
                    </p>
                ) : (
                    <p className="text-sm italic text-(--subtle)">
                        No definition yet.
                    </p>
                )}
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center gap-4 border-t border-(--border) pt-4 text-xs text-(--muted)">

            <span>
                {concept.paperIds.length}{" "}
                {concept.paperIds.length === 1
                    ? "paper"
                    : "papers"}
            </span>

                <span className="h-1 w-1 rounded-full bg-(--subtle)" />

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
             border border-dashed border-(--border)
             bg-(--surface)
             px-6 py-16
             text-center
         "
     > <div
             className="
                 mx-auto flex h-14 w-14
                 items-center justify-center
                 rounded-2xl
                 bg-(--accent-soft)
                 text-xl text-(--accent)
             "
         >
✦ </div>


    <h2 className="mt-5 text-lg font-semibold">
        No concepts yet
    </h2>

    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-(--muted)">
        Concepts will become the nodes of your personal
        research knowledge graph.
    </p>

    <Link
        href="/concepts/new"
        className="
                mt-6 inline-flex
                rounded-xl
                bg-(--accent)
                px-4 py-2.5
                text-sm font-medium text-white
                transition
                hover:bg-(--accent-hover)
            "
    >
        Create your first concept
    </Link>
</div>
);


}
