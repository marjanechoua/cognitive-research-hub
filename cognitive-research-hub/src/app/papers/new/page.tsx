"use client";
import type { SubmitEvent } from "react";

import { useRouter } from "next/navigation";

import { Paper, PaperStatus } from "@/types/paper";
import { savePaper } from "@/lib/papers";

export default function NewPaperPage() {
    const router = useRouter();

    function handleSubmit(
        event: SubmitEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const paper: Paper = {
            id: crypto.randomUUID(),

            title: formData.get("title") as string,
            authors: String(formData.get("authors") ?? "")
                .split(",")
                .map((author) => author.trim())
                .filter(Boolean),
            year: Number(formData.get("year")),
            doi: formData.get("doi") as string,
            url: formData.get("url") as string,

            status: formData.get("status") as PaperStatus,

            topics: (formData.get("topics") as string)
                .split(",")
                .map((topic) => topic.trim())
                .filter(Boolean),

            conceptIds: [],

            researchQuestion:
                formData.get("researchQuestion") as string,

            method:
                formData.get("method") as string,

            results:
                formData.get("results") as string,

            interpretation:
                formData.get("interpretation") as string,

            critique:
                formData.get("critique") as string,

            whatILearned:
                formData.get("whatILearned") as string,

            createdAt: new Date().toISOString(),
        };
        savePaper(paper);

        router.push(`/papers/${paper.id}`);
    }

    return (
        <main className="min-h-screen bg-(--background) text-(--foreground)">
            <div className="mx-auto max-w-4xl px-6 py-10">
                {/* Back */} <button type="button" onClick={() => router.back()} className=" text-sm text-(--muted) transition hover:text-(--foreground) " > ← Back </button>

                {/* Header */}
                <header className="mt-8">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-(--accent)" />
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--accent)">
                        Research Library </p>
                </div>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight"> Add Paper </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-(--muted)">
                    Document a scientific paper and capture your own understanding, analysis and reflections.
                </p>
                </header>

                <form onSubmit={handleSubmit} className=" mt-8 space-y-8">

                    {/* Paper Information */}
                    <section className="rounded-2xl border border-(--border) bg-(--surface) p-6">
                        <h2 className="text-lg font-semibold">
                            Paper Information
                        </h2>

                        <div className="mt-6 space-y-5">

                            <div>
                                <label className="text-sm text-(--muted)">
                                    Title
                                </label>

                                <input
                                    name="title"
                                    required
                                    className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 outline-none transition"
                                    placeholder="Enter the paper title"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-(--muted)">
                                    Authors
                                </label>

                                <input
                                    name="authors"
                                    className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 outline-none transition"
                                    placeholder="e.g. Smith, J., Miller, A."
                                />
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">

                                <div>
                                    <label className="text-sm text-(--muted)">
                                        Publication Year
                                    </label>

                                    <input
                                        name="year"
                                        type="number"
                                        className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 outline-none transition"
                                        placeholder="2026"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-(--muted)">
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        defaultValue="to-read"
                                        className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 outline-none"
                                    >
                                        <option value="to-read">To Read</option>
                                        <option value="reading">Reading</option>
                                        <option value="read">Read</option>
                                        <option value="analyzed">Analyzed</option>
                                    </select>
                                </div>

                            </div>

                            <div>
                                <label className="text-sm text-(--muted)">
                                    DOI
                                </label>

                                <input
                                    name="doi"
                                    className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 outline-none transition"
                                    placeholder="10.xxxx/xxxxx"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-(--muted)">
                                    Paper URL
                                </label>

                                <input
                                    name="url"
                                    type="url"
                                    className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 outline-none transition"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="text-sm text-(--muted)">
                                    Topics
                                </label>

                                <input
                                    name="topics"
                                    className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 outline-none transition"
                                    placeholder="Cognitive Offloading, Generative AI, Metacognition"
                                />

                                <p className="mt-2 text-xs text-(--muted)">
                                    Separate multiple topics with commas.
                                </p>
                            </div>

                        </div>
                    </section>

                    {/* Research Analysis */}
                    <section className="rounded-2xl border border-(--border) bg-(--surface) p-6">
                        <h2 className="text-lg font-semibold">
                            Research Analysis
                        </h2>

                        <div className="mt-6 space-y-6">

                            <TextArea
                                name="researchQuestion"
                                label="Research Question"
                                placeholder="What did the researchers want to investigate?"
                            />

                            <TextArea
                                name="method"
                                label="Method"
                                placeholder="How was the study conducted?"
                            />

                            <TextArea
                                name="results"
                                label="Key Results"
                                placeholder="What were the main findings?"
                            />

                            <TextArea
                                name="interpretation"
                                label="My Interpretation"
                                placeholder="What do these results mean to you?"
                            />

                            <TextArea
                                name="critique"
                                label="My Critique"
                                placeholder="What are strengths, weaknesses or limitations?"
                            />

                            <TextArea
                                name="whatILearned"
                                label="What I Learned"
                                placeholder="What are the three most important things you learned?"
                            />

                        </div>
                    </section>


                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2">

                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="
            rounded-xl
            px-4 py-2.5
            text-sm font-medium
            text-(--muted)
            transition
            hover:bg-(--surface-hover)
            hover:text-(--foreground)
        "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="
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
                            Save Paper
                        </button>

                    </div>



                </form>
            </div>
        </main>
    );
}

function TextArea({
                      name,
                      label,
                      placeholder,
                  }: {
    name: string;
    label: string;
    placeholder: string;
}) {
    return (
        <div>
            <label className="text-sm text-(--muted)">
                {label}
            </label>

            <textarea
                name={name}
                rows={5}
                className="mt-2 w-full resize-y rounded-xl border border-(--border) bg-(--background) px-4 py-3 leading-6 outline-none transition"
                placeholder={placeholder}
            />
        </div>
    );
}