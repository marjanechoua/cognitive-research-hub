"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getPapers } from "@/lib/papers";
import { getConcepts } from "@/lib/concepts";
import { Paper } from "@/types/paper";
import { Concept } from "@/types/concept";
import KnowledgeGraph from "@/components/knowledge-graph/knowledgeGraph";
import ResearchAnalytics from "@/components/dashboard/ResearchAnalytics";
import { supabase } from "@/lib/supabase/client";
export default function Home() {
    const [papers, setPapers] = useState<Paper[]>([]);
    const [concepts, setConcepts] = useState<Concept[]>([]);
    const [connectedPapersCount, setConnectedPapersCount] = useState(0);


useEffect(() => {
    async function loadData() {
        const papers = await getPapers();
        const concepts = await getConcepts();

        const {
            data: paperConcepts,
            error,
        } = await supabase
            .from("paper_concepts")
            .select("paper_id, concept_id");

        if (error) {
            console.error(
                "Failed to load paper-concept relationships:",
                error
            );
        }

        setPapers(papers);
        setConcepts(concepts);

        setConnectedPapersCount(
            paperConcepts?.length ?? 0
        );
    }

    loadData();
}, []);



    const relationshipCount = new Set(
        concepts.flatMap((concept) =>
            (concept.relations ?? []).map((relation) => {
                return [
                    concept.id,
                    relation.conceptId,
                ]
                    .sort()
                    .join("-");
            })
        )
    ).size;



const recentPapers = [...papers]
    .sort(
        (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

const recentConcepts = [...concepts]
    .sort(
        (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

return (
    <main className="min-h-screen bg-(--background) text-(--foreground)">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-12">

            {/* Header */}
            <header>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

                    <div>
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-(--accent)" />

                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--accent)">
                                Research Hub
                            </p>
                        </div>

                        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                            Research Dashboard
                        </h1>

                        <p className="mt-4 max-w-2xl text-base leading-7 text-(--muted)">
                            A central overview of your papers, concepts,
                            and the relationships between them.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/papers/new"
                            className="
                                rounded-xl
                                border border-(--border)
                                bg-(--surface)
                                px-4 py-2.5
                                text-sm font-medium
                                text-(--foreground)
                                shadow-sm
                                transition
                                hover:bg-(--surface-hover)
                            "
                        >
                            + New Paper
                        </Link>

                        <Link
                            href="/concepts/new"
                            className="
                                rounded-xl
                                bg-(--accent)
                                px-4 py-2.5
                                text-sm font-medium
                                text-white
                                shadow-sm
                                transition
                                hover:bg-(--accent-hover)
                            "
                        >
                            + New Concept
                        </Link>
                    </div>

                </div>
            </header>


            {/* Statistics */}
            <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    label="Papers"
                    value={papers.length}
                    description="Research papers in your library"
                />

                <StatCard
                    label="Concepts"
                    value={concepts.length}
                    description="Concepts in your knowledge base"
                />

                <StatCard
                    label="Relationships"
                    value={relationshipCount}
                    description="Connections between concepts"
                />

                <StatCard
                    label="Paper Connections"
                    value={connectedPapersCount}
                    description="Concept-to-paper connections"
                />

            </section>


            {/* Main dashboard */}
            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">

                {/* Recent Papers */}
                <section
                    className="
                        rounded-2xl
                        border border-(--border)
                        bg-(--surface)
                        p-6
                        shadow-sm
                    "
                >
                    <div className="flex items-start justify-between gap-4">

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--accent)">
                                Research
                            </p>

                            <h2 className="mt-2 text-xl font-semibold">
                                Recent Papers
                            </h2>

                            <p className="mt-1 text-sm text-(--muted)">
                                The latest papers added to your library.
                            </p>
                        </div>

                        <Link
                            href="/papers"
                            className="
                                text-sm
                                text-(--muted)
                                transition
                                hover:text-(--foreground)
                            "
                        >
                            View all →
                        </Link>

                    </div>


                    <div className="mt-6 space-y-2">

                        {recentPapers.length === 0 ? (

                            <EmptyState
                                text="No papers yet."
                                action="Add your first paper"
                                href="/papers/new"
                            />

                        ) : (

                            recentPapers.map((paper) => (
                                <Link
                                    key={paper.id}
                                    href={`/papers/${paper.id}`}
                                    className="
                                        group block rounded-xl
                                        border border-transparent
                                        px-4 py-4
                                        transition
                                        hover:border-(--border)
                                        hover:bg-(--surface-hover)
                                    "
                                >
                                    <div className="flex items-start justify-between gap-4">

                                        <div className="min-w-0">

                                            <h3 className="
                                                line-clamp-2
                                                text-sm font-medium
                                                leading-6
                                                text-(--foreground)
                                            ">
                                                {paper.title}
                                            </h3>

                                            {paper.authors && (
                                                <p className="
                                                    mt-1
                                                    line-clamp-1
                                                    text-xs
                                                    text-(--accent)
                                                ">
                                                    {paper.authors}
                                                </p>
                                            )}

                                        </div>

                                        <span className="
                                            shrink-0
                                            rounded-full
                                            bg-(--background)
                                            px-2.5 py-1
                                            text-xs
                                            text-(--muted)
                                        ">
                                            {paper.year || paper.status}
                                        </span>

                                    </div>
                                </Link>
                            ))

                        )}

                    </div>

                </section>


                {/* Recent Concepts */}
                <section
                    className="
                        rounded-2xl
                        border border-(--border)
                        bg-(--surface)
                        p-6
                        shadow-sm
                    "
                >
                    <div className="flex items-start justify-between gap-4">

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--accent)">
                                Knowledge Base
                            </p>

                            <h2 className="mt-2 text-xl font-semibold">
                                Recent Concepts
                            </h2>

                            <p className="mt-1 text-sm text-(--muted)">
                                Recently created concepts.
                            </p>
                        </div>

                        <Link
                            href="/concepts"
                            className="
                                text-sm
                                text-(--muted)
                                transition
                                hover:text-(--foreground)
                            "
                        >
                            View all →
                        </Link>

                    </div>


                    <div className="mt-6 space-y-2">

                        {recentConcepts.length === 0 ? (

                            <EmptyState
                                text="No concepts yet."
                                action="Create a concept"
                                href="/concepts/new"
                            />

                        ) : (

                            recentConcepts.map((concept) => (
                                <Link
                                    key={concept.id}
                                    href={`/concepts/${concept.id}`}
                                    className="
                                        group block rounded-xl
                                        border border-transparent
                                        px-4 py-4
                                        transition
                                        hover:border-(--border)
                                        hover:bg-(--surface-hover)
                                    "
                                >

                                    <div className="flex items-center gap-4">

                                        <div className="
                                            flex h-10 w-10
                                            shrink-0
                                            items-center justify-center
                                            rounded-xl
                                            bg-(--accent-soft)
                                            text-sm font-semibold
                                            text-(--accent)
                                        ">
                                            {concept.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div className="min-w-0">

                                            <h3 className="
                                                truncate
                                                text-sm font-medium
                                                text-(--foreground)
                                            ">
                                                {concept.name}
                                            </h3>

                                            <p className="
                                                mt-1 truncate
                                                text-xs
                                                text-(--accent)
                                            ">
                                                {concept.field ||
                                                    "Concept"}{" "}
                                                ·{" "}
                                                {(concept.relations ?? []).length}{" "}
                                                {(concept.relations ?? []).length === 1
                                                    ? "relationship"
                                                    : "relationships"}
                                            </p>

                                        </div>

                                    </div>

                                </Link>
                            ))

                        )}

                    </div>


                </section>

            </div>
            {/* Knowledge Graph */}

            <section className="mt-6">

                <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--accent)">
                        Knowledge Graph
                    </p>

                    <h2 className="mt-2 text-xl font-semibold">
                        Your research network
                    </h2>

                    <p className="mt-1 max-w-2xl text-sm leading-6 text-(--muted)">
                        Explore how your concepts connect to each other
                        and how they form the structure of your research.
                    </p>
                </div>

                {/* Graph */}
                <KnowledgeGraph concepts={concepts} />

                <ResearchAnalytics
                    concepts={concepts}
                    papers={papers}
                />

                {/* Graph statistics */}
                <div className="mt-4 grid gap-3 sm:grid-cols-3">

                    <GraphStat
                        value={concepts.length}
                        label="Concepts"
                    />

                    <GraphStat
                        value={relationshipCount}
                        label="Concept relationships"
                    />

                    <GraphStat
                        value={connectedPapersCount}
                        label="Paper connections"
                    />

                </div>



            </section>








            {/* Quick Actions */}
            <section className="mt-6">

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--accent)">
                    Quick Actions
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">

                    <Link
                        href="/papers/new"
                        className="
                            group rounded-2xl
                            border border-(--border)
                            bg-(--surface)
                            p-6
                            shadow-sm
                            transition
                            hover:border-(--accent)
                            hover:bg-(--surface-hover)
                        "
                    >
                        <div className="
                            flex h-10 w-10
                            items-center justify-center
                            rounded-xl
                            bg-(--accent-soft)
                            text-lg
                            text-(--accent)
                        ">
                            +
                        </div>

                        <h3 className="mt-4 text-base font-semibold">
                            Add a Paper
                        </h3>

                        <p className="mt-1 text-sm text-(--muted)">
                            Add a new research paper to your library.
                        </p>
                    </Link>


                    <Link
                        href="/concepts/new"
                        className="
                            group rounded-2xl
                            border border-(--border)
                            bg-(--surface)
                            p-6
                            shadow-sm
                            transition
                            hover:border-(--accent)
                            hover:bg-(--surface-hover)
                        "
                    >
                        <div className="
                            flex h-10 w-10
                            items-center justify-center
                            rounded-xl
                            bg-(--accent-soft)
                            text-lg
                            text-(--accent)
                        ">
                            +
                        </div>

                        <h3 className="mt-4 text-base font-semibold">
                            Create a Concept
                        </h3>

                        <p className="mt-1 text-sm text-(--muted)">
                            Define a concept and connect it to your research.
                        </p>
                    </Link>

                </div>

            </section>

        </div>
    </main>
);


}

/* -------------------------------- */
/* Components                       */
/* -------------------------------- */

function StatCard({
                      label,
                      value,
                      description,
                  }: {
    label: string;
    value: number;
    description: string;
}) {
    return ( <div
            className="
             rounded-2xl
             border border-(--border)
             bg-(--surface)
             p-6
             shadow-sm
         "
        > <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--accent)">
            {label} </p>


            <p className="mt-4 text-3xl font-semibold tracking-tight">
                {value}
            </p>

            <p className="mt-2 text-sm text-(--muted)">
                {description}
            </p>
        </div>
    );


}

function GraphStat({
value,
label,
}: {
value: number;
label: string;
}) {
return ( <div
         className="
             rounded-xl
             border border-(--border)
             bg-(--background)
             px-5 py-4
         "
     > <p className="text-2xl font-semibold">
{value} </p>


    <p className="mt-1 text-xs text-(--muted)">
        {label}
</p>
</div>
);


}

function EmptyState({
text,
action,
href,
}: {
text: string;
action: string;
href: string;
}) {
return ( <div
         className="
             rounded-xl
             border border-dashed
             border-(--border)
             px-5 py-8
             text-center
         "
     > <p className="text-sm text-(--accent)">
{text} </p>


    <Link
    href={href}
    className="
    mt-3 inline-block
    text-sm font-medium
    text-(--accent)
    transition
    hover:text-(--accent-hover)
    "
    >
    {action} →
</Link>
</div>
);


}
