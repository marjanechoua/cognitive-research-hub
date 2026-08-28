"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getPaper, savePaper } from "@/lib/papers";
import { Paper, PaperStatus } from "@/types/paper";

export default function EditPaperPage() {
    const params = useParams();
    const router = useRouter();

    const [paper, setPaper] = useState<Paper | null>(null);

    useEffect(() => {
        const id = params.id as string;
        const foundPaper = getPaper(id);

        setPaper(foundPaper ?? null);
    }, [params.id]);

    if (!paper) {
        return (
            <main className="min-h-screen bg-zinc-950 text-zinc-100">
                <div className="mx-auto max-w-4xl px-6 py-10">
                    <p className="text-zinc-400">
                        Paper not found.
                    </p>
                </div>
            </main>
        );
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const updatedPaper: Paper = {
            ...paper,

            title: formData.get("title") as string,
            authors: formData.get("authors") as string,
            year: formData.get("year") as string,
            doi: formData.get("doi") as string,
            url: formData.get("url") as string,

            status: formData.get("status") as PaperStatus,

            topics: (formData.get("topics") as string)
                .split(",")
                .map((topic) => topic.trim())
                .filter(Boolean),

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
        };

        savePaper(updatedPaper);

        router.push(`/papers/${paper.id}`);
    }

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="mx-auto max-w-4xl px-6 py-10">

                <button
                    onClick={() => router.back()}
                    className="text-sm text-zinc-400 hover:text-zinc-200"
                >
                    ← Back
                </button>

                <header className="mt-8 mb-10">
                    <p className="text-sm font-medium text-zinc-400">
                        RESEARCH LIBRARY
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold">
                        Edit Paper
                    </h1>

                    <p className="mt-2 text-zinc-400">
                        Update your paper and research notes.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">

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
                                    defaultValue={paper.title}
                                    className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-zinc-400"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-zinc-300">
                                    Authors
                                </label>

                                <input
                                    name="authors"
                                    defaultValue={paper.authors}
                                    className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-zinc-400"
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
                                        defaultValue={paper.year}
                                        className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-zinc-400"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-zinc-300">
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        defaultValue={paper.status}
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
                                    defaultValue={paper.doi}
                                    className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-zinc-400"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-zinc-300">
                                    Paper URL
                                </label>

                                <input
                                    name="url"
                                    type="url"
                                    defaultValue={paper.url}
                                    className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-zinc-400"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-zinc-300">
                                    Topics
                                </label>

                                <input
                                    name="topics"
                                    defaultValue={paper.topics.join(", ")}
                                    className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-zinc-400"
                                />
                            </div>

                        </div>
                    </section>

                    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

                        <h2 className="text-lg font-semibold">
                            Research Analysis
                        </h2>

                        <div className="mt-6 space-y-6">

                            <TextArea
                                name="researchQuestion"
                                label="Research Question"
                                defaultValue={paper.researchQuestion}
                            />

                            <TextArea
                                name="method"
                                label="Method"
                                defaultValue={paper.method}
                            />

                            <TextArea
                                name="results"
                                label="Key Results"
                                defaultValue={paper.results}
                            />

                            <TextArea
                                name="interpretation"
                                label="My Interpretation"
                                defaultValue={paper.interpretation}
                            />

                            <TextArea
                                name="critique"
                                label="My Critique"
                                defaultValue={paper.critique}
                            />

                            <TextArea
                                name="whatILearned"
                                label="What I Learned"
                                defaultValue={paper.whatILearned}
                            />

                        </div>
                    </section>

                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="rounded-xl border border-zinc-700 px-5 py-3 text-sm text-zinc-300 hover:border-zinc-500"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-xl bg-white px-6 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
                        >
                            Save Changes
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
                      defaultValue,
                  }: {
    name: string;
    label: string;
    defaultValue: string;
}) {
    return (
        <div>
            <label className="text-sm text-zinc-300">
                {label}
            </label>

            <textarea
                name={name}
                rows={5}
                defaultValue={defaultValue}
                className="mt-2 w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 leading-6 outline-none focus:border-zinc-400"
            />
        </div>
    );
}