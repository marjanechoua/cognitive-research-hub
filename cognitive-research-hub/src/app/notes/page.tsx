"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getConcepts } from "@/lib/concepts";
import { Concept } from "@/types/concept";

export default function NotesPage() {
    const [concepts, setConcepts] = useState<Concept[]>([]);


    useEffect(() => {
        async function loadConcepts() {
            const data = await getConcepts();
            const normalizedConcepts = data.map((concept) => ({
                ...concept,
                aliases: concept.aliases ?? [],
                relations: concept.relations ?? [],
                paperIds: concept.paperIds ?? [],
                notes: concept.notes ?? "",
                definition: concept.definition ?? "",
                field: concept.field ?? "", }));
            setConcepts(normalizedConcepts); }
        loadConcepts();
        }, []);

const conceptsWithNotes = concepts
    .filter((concept) => concept.notes?.trim())
    .sort(
        (a, b) =>
            new Date(b.updatedAt).getTime() -
            new Date(a.updatedAt).getTime()
    );

return (
    <main className="min-h-screen bg-(--background) text-(--foreground)">
        <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8 lg:py-12">

            {/* Header */}
            <header>
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-(--accent)" />

                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--accent)">
                        Knowledge Base
                    </p>
                </div>

                <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                    <div>
                        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                            Notes
                        </h1>

                        <p className="mt-4 max-w-2xl text-base leading-7 text-(--muted)">
                            Your personal thoughts, questions, and
                            observations connected to your concepts.
                        </p>
                    </div>

                    <span
                        className="
                            w-fit rounded-full
                            border border-(--border)
                            bg-(--surface)
                            px-3 py-1.5
                            text-sm text-(--muted)
                        "
                    >
                        {conceptsWithNotes.length}{" "}
                        {conceptsWithNotes.length === 1
                            ? "note"
                            : "notes"}
                    </span>

                </div>
            </header>


            {/* Notes */}
            <section className="mt-10">

                {conceptsWithNotes.length === 0 ? (

                    <div
                        className="
                            rounded-2xl
                            border border-dashed
                            border-(--border)
                            bg-(--surface)
                            px-6 py-16
                            text-center
                        "
                    >
                        <div
                            className="
                                mx-auto flex h-12 w-12
                                items-center justify-center
                                rounded-xl
                                bg-(--accent-soft)
                                text-xl
                                text-(--accent)
                            "
                        >
                            ✎
                        </div>

                        <h2 className="mt-5 text-lg font-semibold">
                            No notes yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-(--muted)">
                            Your personal notes will appear here once
                            you add them to a concept.
                        </p>

                        <Link
                            href="/concepts"
                            className="
                                mt-6 inline-flex
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
                            Browse Concepts
                        </Link>
                    </div>

                ) : (

                    <div className="grid gap-5 lg:grid-cols-2">

                        {conceptsWithNotes.map((concept) => (
                            <article
                                key={concept.id}
                                className="
                                    group rounded-2xl
                                    border border-(--border)
                                    bg-(--surface)
                                    p-6
                                    shadow-sm
                                    transition
                                    hover:border-(--accent)
                                "
                            >

                                {/* Note header */}
                                <div className="flex items-start justify-between gap-4">

                                    <div className="min-w-0">

                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--subtle)">
                                            {concept.field || "Concept"}
                                        </p>

                                        <Link
                                            href={`/concepts/${concept.id}`}
                                            className="
                                                mt-2 block
                                                truncate
                                                text-lg font-semibold
                                                transition
                                                hover:text-(--accent)
                                            "
                                        >
                                            {concept.name}
                                        </Link>

                                    </div>

                                    <Link
                                        href={`/concepts/${concept.id}`}
                                        className="
                                            shrink-0
                                            rounded-lg
                                            border border-(--border)
                                            px-2.5 py-1.5
                                            text-xs
                                            text-(--muted)
                                            transition
                                            hover:bg-(--surface-hover)
                                            hover:text-(--foreground)
                                        "
                                    >
                                        Open
                                    </Link>

                                </div>


                                {/* Note content */}
                                <div
                                    className="
                                        mt-5
                                        rounded-xl
                                        border border-(--border)
                                        bg-(--background)
                                        p-5
                                    "
                                >
                                    <p
                                        className="
                                            whitespace-pre-wrap
                                            text-sm
                                            leading-7
                                            text-(--muted)
                                        "
                                    >
                                        {concept.notes}
                                    </p>
                                </div>


                                {/* Metadata */}
                                <div
                                    className="
                                        mt-5 flex flex-wrap
                                        items-center gap-x-5 gap-y-2
                                        text-xs text-(--subtle)
                                    "
                                >
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
                                        {concept.relations.length}{" "}
                                        {concept.relations.length === 1
                                            ? "relationship"
                                            : "relationships"}
                                    </span>
                                </div>

                            </article>
                        ))}

                    </div>

                )}

            </section>

        </div>
    </main>
);


}
