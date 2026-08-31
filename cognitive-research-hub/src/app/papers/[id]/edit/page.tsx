"use client";

import { SubmitEventHandler, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getPaper, savePaper } from "@/lib/papers";
import { Paper, PaperStatus } from "@/types/paper";

export default function EditPaperPage() {
  const params = useParams();
  const router = useRouter();

  const [paper, setPaper] = useState<Paper | null>(null);

  useEffect(() => {
    async function loadPaper() {
      const id = params.id as string;
      const foundPaper = await getPaper(id);

      setPaper(foundPaper ?? null);
    }

    void loadPaper();
  }, [params.id]);

  if (!paper) {
    return (
      <main className="min-h-screen bg-(--background) text-(--foreground)">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <p className="text-(--muted)">Paper not found.</p>
        </div>
      </main>
    );
  }

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!paper) return;

    const formData = new FormData(event.currentTarget);

    const updatedPaper: Paper = {
      id: paper.id,
      title: String(formData.get("title") ?? ""),
      authors: String(formData.get("authors") ?? "")
        .split(",")
        .map((author) => author.trim())
        .filter(Boolean),
      year: Number(formData.get("year")),
      doi: String(formData.get("doi") ?? ""),
      url: String(formData.get("url") ?? ""),
      status: formData.get("status") as PaperStatus,
      topics: String(formData.get("topics") ?? "")
        .split(",")
        .map((topic) => topic.trim())
        .filter(Boolean),
      conceptIds: paper.conceptIds ?? [],
      researchQuestion: String(formData.get("researchQuestion") ?? ""),
      method: String(formData.get("method") ?? ""),
      results: String(formData.get("results") ?? ""),
      interpretation: String(formData.get("interpretation") ?? ""),
      critique: String(formData.get("critique") ?? ""),
      whatILearned: String(formData.get("whatILearned") ?? ""),
      createdAt: paper.createdAt,
    };

    void savePaper(updatedPaper);

    router.push(`/papers/${paper.id}`);
  };

  return (
    <main className="min-h-screen bg-(--background) text-(--foreground)">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <button
          onClick={() => router.back()}
          className="text-sm text-(--muted) hover:text-(--foreground)"
        >
          ← Back
        </button>

        <header className="mt-8 mb-10">
          <p className="text-sm font-medium text-(--muted)">RESEARCH LIBRARY</p>

          <h1 className="mt-2 text-3xl font-semibold">Edit Paper</h1>

          <p className="mt-2 text-(--muted)">
            Update your paper and research notes.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="rounded-2xl border border-(--border) bg-(--surface) p-6">
            <h2 className="text-lg font-semibold">Paper Information</h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="text-sm text-(--foreground)">Title</label>

                <input
                  name="title"
                  required
                  defaultValue={paper.title}
                  className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-(--foreground)">Authors</label>

                <input
                  name="authors"
                  defaultValue={paper.authors}
                  className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 outline-none"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-sm text-(--foreground)">
                    Publication Year
                  </label>

                  <input
                    name="year"
                    type="number"
                    defaultValue={paper.year}
                    className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-(--foreground)">Status</label>

                  <select
                    name="status"
                    defaultValue={paper.status}
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
                <label className="text-sm text-(--foreground)">DOI</label>

                <input
                  name="doi"
                  defaultValue={paper.doi}
                  className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-(--foreground)">Paper URL</label>

                <input
                  name="url"
                  type="url"
                  defaultValue={paper.url}
                  className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-(--foreground)">Topics</label>

                <input
                  name="topics"
                  defaultValue={paper.topics.join(", ")}
                  className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 outline-none"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-(--border) bg-(--surface) p-6">
            <h2 className="text-lg font-semibold">Research Analysis</h2>

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
              className="rounded-xl border border-(--border) px-5 py-3 text-sm text-(--foreground) hover:border-zinc-500"
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
      <label className="text-sm text-(--foreground)">{label}</label>

      <textarea
        name={name}
        rows={5}
        defaultValue={defaultValue}
        className="mt-2 w-full resize-y rounded-xl border border-(--border) bg-(--background) px-4 py-3 leading-6 outline-none"
      />
    </div>
  );
}
