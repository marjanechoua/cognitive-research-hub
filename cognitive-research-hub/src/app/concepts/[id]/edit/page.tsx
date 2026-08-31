"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getConcept, saveConcept } from "@/lib/concepts";

import { Concept } from "@/types/concept";

export default function EditConceptPage() {
  const params = useParams();
  const router = useRouter();

  const [concept, setConcept] = useState<Concept | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadConcept() {
      const id = params.id as string;

      const foundConcept = await getConcept(id);

      if (foundConcept) {
        setConcept({
          ...foundConcept,
          aliases: foundConcept.aliases ?? [],
          relations: foundConcept.relations ?? [],
          paperIds: foundConcept.paperIds ?? [],
          notes: foundConcept.notes ?? "",
          definition: foundConcept.definition ?? "",
          field: foundConcept.field ?? "",
          understanding: foundConcept.understanding ?? "",
          openQuestions: foundConcept.openQuestions ?? "",
        });
      } else {
        setConcept(null);
      }

      setLoading(false);
    }

    void loadConcept();
  }, [params.id]);

  function updateField(field: keyof Concept, value: string) {
    if (!concept) return;

    setConcept({
      ...concept,
      [field]: value,
    });
  }

  function updateAliases(value: string) {
    if (!concept) return;

    const aliases = value
      .split(",")
      .map((alias) => alias.trim())
      .filter(Boolean);

    setConcept({
      ...concept,
      aliases,
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!concept) return;

    setSaving(true);
    setError("");

    try {
      await saveConcept(concept);

      router.push(`/concepts/${concept.id}`);
    } catch (error) {
      console.error("Failed to save concept:", error);

      setError("Failed to save concept. Please try again.");

      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-(--background) text-(--foreground)">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <p className="text-sm text-(--muted)">Loading concept...</p>
        </div>
      </main>
    );
  }

  if (!concept) {
    return (
      <main className="min-h-screen bg-(--background) text-(--foreground)">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <Link
            href="/concepts"
            className="text-sm text-(--muted) transition hover:text-(--foreground)"
          >
            ← Back to Concepts
          </Link>

          <div className="mt-12">
            <h1 className="text-3xl font-semibold">Concept not found</h1>

            <p className="mt-3 text-(--muted)">
              This concept does not exist in your knowledge base.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-(--background) text-(--foreground)">
      <div className="mx-auto max-w-4xl px-6 py-10 lg:py-12">
        <Link
          href={`/concepts/${concept.id}`}
          className="text-sm text-(--muted) transition hover:text-(--foreground)"
        >
          ← Back to Concept
        </Link>

        <header className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--accent)">
            Knowledge Base
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Edit Concept
          </h1>

          <p className="mt-3 text-sm leading-6 text-(--muted)">
            Update the information and notes associated with this concept.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          {/* Name */}

          <section className="rounded-2xl border border-(--border) bg-(--surface) p-6">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>

            <input
              id="name"
              type="text"
              value={concept.name}
              onChange={(event) => updateField("name", event.target.value)}
              required
              className="
                                mt-2 w-full rounded-xl
                                border border-(--border)
                                bg-(--background)
                                px-4 py-3
                                text-sm text-(--foreground)
                                outline-none
                                transition
                            "
            />
          </section>

          {/* Field */}

          <section className="rounded-2xl border border-(--border) bg-(--surface) p-6">
            <label htmlFor="field" className="text-sm font-medium">
              Field
            </label>

            <input
              id="field"
              type="text"
              value={concept.field}
              onChange={(event) => updateField("field", event.target.value)}
              placeholder="e.g. Neuroscience"
              className="
                                mt-2 w-full rounded-xl
                                border border-(--border)
                                bg-(--background)
                                px-4 py-3
                                text-sm text-(--foreground)
                                outline-none
                                transition
                            "
            />
          </section>

          {/* Definition */}

          <section className="rounded-2xl border border-(--border) bg-(--surface) p-6">
            <label htmlFor="definition" className="text-sm font-medium">
              Definition
            </label>

            <textarea
              id="definition"
              value={concept.definition}
              onChange={(event) =>
                updateField("definition", event.target.value)
              }
              rows={6}
              className="
                                mt-2 w-full resize-y rounded-xl
                                border border-(--border)
                                bg-(--background)
                                px-4 py-3
                                text-sm leading-7
                                text-(--foreground)
                                outline-none
                                transition
                            "
            />
          </section>

          {/* My Understanding */}

          <section className="rounded-2xl border border-(--border) bg-(--surface) p-6">
            <label htmlFor="understanding" className="text-sm font-medium">
              My Understanding
            </label>

            <p className="mt-1 text-xs text-(--muted)">
              Explain the concept in your own words.
            </p>

            <textarea
              id="understanding"
              value={concept.understanding}
              onChange={(event) =>
                updateField("understanding", event.target.value)
              }
              rows={8}
              placeholder="I currently understand this concept as..."
              className="
            mt-3 w-full resize-y rounded-xl
            border border-(--border)
            bg-(--background)
            px-4 py-3
            text-sm leading-7
            text-(--foreground)
            outline-none
            transition
        "
            />
          </section>
          {/* Open Questions */}

          <section className="rounded-2xl border border-(--border)  bg-(--surface) p-6">
            <label htmlFor="openQuestions" className="text-sm font-medium">
              Open Questions
            </label>

            <p className="mt-1 text-xs text-(--muted)">
              What do you still not understand or want to investigate?
            </p>

            <textarea
              id="openQuestions"
              value={concept.openQuestions}
              onChange={(event) =>
                updateField("openQuestions", event.target.value)
              }
              rows={8}
              placeholder="I still don't understand..."
              className="
            mt-3 w-full resize-y rounded-xl
            border border-(--border)
            bg-(--background)
            px-4 py-3
            text-sm leading-7
            text-(--foreground)
            outline-none
            transition
        "
            />
          </section>

          {/* Aliases */}

          <section className="rounded-2xl border border-(--border) bg-(--surface) p-6">
            <label htmlFor="aliases" className="text-sm font-medium">
              Aliases
            </label>

            <p className="mt-1 text-xs text-(--muted)">
              Separate multiple aliases with commas.
            </p>

            <input
              id="aliases"
              type="text"
              value={concept.aliases.join(", ")}
              onChange={(event) => updateAliases(event.target.value)}
              placeholder="e.g. working memory, WM"
              className="
                                mt-3 w-full rounded-xl
                                border border-(--border)
                                bg-(--background)
                                px-4 py-3
                                text-sm text-(--foreground)
                                outline-none
                                transition
                            "
            />
          </section>

          {/* Notes */}

          <section className="rounded-2xl border border-(--border) bg-(--surface) p-6">
            <label htmlFor="notes" className="text-sm font-medium">
              My Notes
            </label>

            <textarea
              id="notes"
              value={concept.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              rows={8}
              placeholder="Write your personal notes about this concept..."
              className="
                                mt-2 w-full resize-y rounded-xl
                                border border-(--border)
                                bg-(--background)
                                px-4 py-3
                                text-sm leading-7
                                text-(--foreground)
                                outline-none
                                transition
                            "
            />
          </section>

          {/* Error */}

          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Actions */}

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <Link
              href={`/concepts/${concept.id}`}
              className="
                                rounded-xl
                                border border-(--border)
                                px-5 py-2.5
                                text-sm font-medium
                                text-(--foreground)
                                transition
                                hover:border-(--accent)
                                hover:bg-(--accent-soft)
                                hover:text-(--accent)
                            "
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="
                                rounded-xl
                                bg-(--accent)
                                px-5 py-2.5
                                text-sm font-medium
                                text-white
                                transition
                                hover:bg-(--accent-hover)
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
