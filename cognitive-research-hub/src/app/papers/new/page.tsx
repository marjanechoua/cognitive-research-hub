"use client";

import { FormEvent } from "react";

export default function NewPaperPage() {
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        console.log({
            title: formData.get("title"),
            authors: formData.get("authors"),
            year: formData.get("year"),
            doi: formData.get("doi"),
            url: formData.get("url"),
            status: formData.get("status"),
            topics: formData.get("topics"),
            researchQuestion: formData.get("researchQuestion"),
            method: formData.get("method"),
            results: formData.get("results"),
            interpretation: formData.get("interpretation"),
            critique: formData.get("critique"),
            whatILearned: formData.get("whatILearned"),
        });
    }

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="mx-auto max-w-4xl px-6 py-10">

                <header className="mb-10">
                    <p className="text-sm font-medium text-zinc-400">
                        RESEARCH LIBRARY
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold">
                        Add Paper
                    </h1>

                    <p className="mt-2 text-zinc-400">
                        Document a paper and your own understanding of it.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Metadata */}
                    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                        <h2 className="text-lg font-semibold">
                            Paper Information
                        </h2>

                        <div className="mt-6 space-y-5">

                            <div>
                                <label className="text-sm text-zinc-300">
                                    Title
                                </label>

                                <input
                                    name="title"
                                    required
                                    className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-zinc-400"
                                    placeholder="Enter the paper title"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-zinc-300">
                                    Authors
                                </label>

                                <input
                                    name="authors"
                                    className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-zinc-400"
                                    placeholder="e.g. Smith, J., Miller, A."
                                />
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">

                                <div>
                                    <label className="text-sm text-zinc-300">
                                        Publication Year
                                    </label>

                                    <input
                                        name="year"
                                        type="number"
                                        className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-zinc-400"
                                        placeholder="2026"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-zinc-300">
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        defaultValue="to-read"
                                        className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none"
                                    >
                                        <option value="to-read">To Read</option>
                                        <option value="reading">Reading</option>
                                        <option value="read">Read</option>
                                        <option value="analyzed">Analyzed</option>
                                    </select>
                                </div>

                            </div>

                            <div>
                                <label className="text-sm text-zinc-300">
                                    DOI
                                </label>

                                <input
                                    name="doi"
                                    className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-zinc-400"
                                    placeholder="10.xxxx/xxxxx"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-zinc-300">
                                    Paper URL
                                </label>

                                <input
                                    name="url"
                                    type="url"
                                    className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-zinc-400"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="text-sm text-zinc-300">
                                    Topics
                                </label>

                                <input
                                    name="topics"
                                    className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-zinc-400"
                                    placeholder="Cognitive Offloading, Metacognition, AI"
                                />

                                <p className="mt-2 text-xs text-zinc-500">
                                    Separate multiple topics with commas.
                                </p>
                            </div>

                        </div>
                    </section>

                    {/* Research Analysis */}
                    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
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

                    {/* Save */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="rounded-xl bg-white px-6 py-3 font-medium text-zinc-900 transition hover:bg-zinc-200"
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
            <label className="text-sm text-zinc-300">
                {label}
            </label>

            <textarea
                name={name}
                rows={5}
                className="mt-2 w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 leading-6 outline-none transition focus:border-zinc-400"
                placeholder={placeholder}
            />
        </div>
    );
}