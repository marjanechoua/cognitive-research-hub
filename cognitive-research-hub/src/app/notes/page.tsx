"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, ReactNode } from "react";

import { getConcepts } from "@/lib/concepts";
import { getPapers } from "@/lib/papers";

import { Concept } from "@/types/concept";
import { Paper } from "@/types/paper";
import NotesWordCloud from "@/components/notes/NotesWordCloud";

type NoteFilter = "all" | "concepts" | "papers";
type NoteSort = "newest" | "oldest" | "concepts" | "papers";

type NoteItem = {
  id: string;
  type: "concept" | "paper";
  title: string;
  content: string;
  field?: string;
  href: string;
  section?: string;
  date: string;
  dateLabel: "Updated" | "Created";
  paperCount?: number;
  relationshipCount?: number;
};

export default function NotesPage() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<NoteFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState<NoteSort>("newest");

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      const [conceptData, paperData] = await Promise.all([
        getConcepts(),
        getPapers(),
      ]);

      const normalizedConcepts = conceptData.map((concept) => ({
        ...concept,
        aliases: concept.aliases ?? [],
        relations: concept.relations ?? [],
        paperIds: concept.paperIds ?? [],
        notes: concept.notes ?? "",
        definition: concept.definition ?? "",
        field: concept.field ?? "",
        understanding: concept.understanding ?? "",
        openQuestions: concept.openQuestions ?? "",
      }));

      const normalizedPapers = paperData.map((paper) => ({
        ...paper,
        authors: paper.authors ?? [],
        topics: paper.topics ?? [],
      }));

      setConcepts(normalizedConcepts);
      setPapers(normalizedPapers);
      setIsLoading(false);
    }

    void loadData();
  }, []);

  const notes = useMemo<NoteItem[]>(() => {
    const conceptNotes: NoteItem[] = [];

    for (const concept of concepts) {
      const conceptSections = [
        {
          key: "my-notes",
          title: "My Notes",
          content: concept.notes,
        },
        {
          key: "understanding",
          title: "My Understanding",
          content: concept.understanding,
        },
        {
          key: "open-questions",
          title: "Open Questions",
          content: concept.openQuestions,
        },
      ];

      for (const section of conceptSections) {
        if (!section.content?.trim()) continue;

        conceptNotes.push({
          id: `concept-${concept.id}-${section.key}`,
          type: "concept",
          title: concept.name,
          content: section.content,
          field: concept.field,
          href: `/concepts/${concept.id}`,
          section: section.title,
          date: concept.updatedAt,
          dateLabel: "Updated",
          paperCount: concept.paperIds.length,
          relationshipCount: concept.relations.length,
        });
      }
    }

    const paperNotes: NoteItem[] = [];

    for (const paper of papers) {
      const paperSections = [
        {
          key: "research-question",
          title: "Research Question",
          content: paper.researchQuestion,
        },
        {
          key: "method",
          title: "Method",
          content: paper.method,
        },
        {
          key: "results",
          title: "Key Results",
          content: paper.results,
        },
        {
          key: "interpretation",
          title: "My Interpretation",
          content: paper.interpretation,
        },
        {
          key: "critique",
          title: "My Critique",
          content: paper.critique,
        },
        {
          key: "what-i-learned",
          title: "What I Learned",
          content: paper.whatILearned,
        },
      ];

      for (const section of paperSections) {
        if (!section.content?.trim()) continue;

        paperNotes.push({
          id: `paper-${paper.id}-${section.key}`,
          type: "paper",
          title: paper.title,
          content: section.content,
          field: paper.authors?.length ? paper.authors.join(", ") : undefined,
          href: `/papers/${paper.id}`,
          section: section.title,
          date: paper.createdAt,
          dateLabel: "Created",
        });
      }
    }

    return [...conceptNotes, ...paperNotes];
  }, [concepts, papers]);

  const filteredNotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return notes
      .filter((note) => {
        if (filter === "concepts") {
          return note.type === "concept";
        }

        if (filter === "papers") {
          return note.type === "paper";
        }

        return true;
      })
      .filter((note) => {
        if (!query) return true;

        return (
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.field?.toLowerCase().includes(query) ||
          note.section?.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (sort === "newest") {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }

        if (sort === "oldest") {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }

        if (sort === "concepts") {
          return Number(b.type === "concept") - Number(a.type === "concept");
        }

        if (sort === "papers") {
          return Number(b.type === "paper") - Number(a.type === "paper");
        }

        return 0;
      });
  }, [notes, searchQuery, filter, sort]);

  const conceptNoteCount = notes.filter(
    (note) => note.type === "concept",
  ).length;

  const paperNoteCount = notes.filter((note) => note.type === "paper").length;
  const totalNoteCount = notes.length;

  return (
      <main
          className="
        min-h-screen
        bg-(--background)
        text-(--foreground)
        relative
        overflow-hidden
    "
      >
        {/* Notebook paper background */}
        <div
            className="
            pointer-events-none
            absolute inset-0
            opacity-[0.035]
        "
            style={{
              backgroundImage:
                  "linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "100% 32px",
            }}
        />

        {/* Notebook margin */}
        <div
            className="
            pointer-events-none
            absolute inset-y-0 left-[8%]
            hidden w-px
            bg-red-400/10
            lg:block
        "
        />


        <div className="relative mx-auto max-w-6xl px-6 pt-8 pb-10 lg:px-8 lg:pt-10 lg:pb-12">

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
                Your personal thoughts, questions, and observations connected to
                your research.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className="
            rounded-full
            border border-(--border)
            bg-(--surface)
            px-3 py-1.5
            text-sm text-(--muted)
        "
              >
                {totalNoteCount} {totalNoteCount === 1 ? "note" : "notes"}
              </span>

              <span
                className="
            rounded-full
            border border-(--border)
            bg-(--surface)
            px-3 py-1.5
            text-sm text-(--muted)
        "
              >
                {conceptNoteCount} concepts
              </span>

              <span
                className="
            rounded-full
            border border-(--border)
            bg-(--surface)
            px-3 py-1.5
            text-sm text-(--muted)
        "
              >
                {paperNoteCount} papers
              </span>
            </div>
          </div>
        </header>

        {/* Controls */}
        <section className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <span
                className="
                                    pointer-events-none
                                    absolute left-4 top-1/2
                                    -translate-y-1/2
                                    text-sm text-(--subtle)
                                "
              >
                ⌕
              </span>

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search notes..."
                className="
                                    w-full rounded-xl
                                    border border-(--border)
                                    bg-(--surface)
                                    py-3 pl-10 pr-4
                                    text-sm text-(--foreground)
                                    outline-none
                                    transition
                                "
              />
            </div>
          </div>

          {/* Filters + Sort */}
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            {/* Filters */}
            <div className="flex flex-wrap gap-2">

              <FilterButton
                  active={filter === "all"}
                  onClick={() => setFilter("all")}
              >
                All Notes
              </FilterButton>

              <FilterButton
                  active={filter === "concepts"}
                  onClick={() => setFilter("concepts")}
              >
                Concept Notes
                <span className="ml-1.5 opacity-60">
                {conceptNoteCount}
            </span>
              </FilterButton>

              <FilterButton
                  active={filter === "papers"}
                  onClick={() => setFilter("papers")}
              >
                Paper Notes
                <span className="ml-1.5 opacity-60">
                {paperNoteCount}
            </span>
              </FilterButton>

            </div>

            {/* Sort */}
            <div className="flex items-center gap-3">

              <label
                  htmlFor="note-sort"
                  className="text-xs font-medium text-(--muted)"
              >
                Sort by
              </label>

              <select
                  id="note-sort"
                  value={sort}
                  onChange={(event) =>
                      setSort(event.target.value as NoteSort)
                  }
                  className="
                rounded-xl
                border border-(--border)
                bg-(--surface)
                px-3 py-2
                text-sm text-(--foreground)
                outline-none
                transition
            "
              >
                <option value="newest">
                  Newest
                </option>

                <option value="oldest">
                  Oldest
                </option>

                <option value="concepts">
                  Concepts first
                </option>

                <option value="papers">
                  Papers first
                </option>
              </select>

            </div>

          </div>
        </section>

        {/* Notes */}
        <section className="mt-8">
          {isLoading ? (
            <div
              className="
                                rounded-2xl
                                border border-(--border)
                                bg-(--surface)
                                px-6 py-16
                                text-center
                            "
            >
              <p className="text-sm text-(--muted)">Loading notes...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <EmptyState
              hasSearch={Boolean(searchQuery.trim())}
              filter={filter}
            />
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {filteredNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
        </section>
          {/* Word Cloud */}
          {!isLoading && <NotesWordCloud notes={notes} />}
      </div>
    </main>
  );
}
function NoteCard({
                    note,
                  }: {
  note: NoteItem;
}) {
  const isConcept = note.type === "concept";

return (
    <article
        className={`
  group relative overflow-hidden
  rounded-2xl
  border border-(--border)
  bg-(--surface)
  p-6
  shadow-sm
  transition-all duration-200
  hover:-translate-y-1
  hover:shadow-lg
  ${
    isConcept
        ? "hover:border-amber-500/40"
        : "hover:border-blue-500/40"
  }
  `}
    >

        {/* Notebook accent */}
        <div
            className={`
  absolute left-0 top-0 h-full w-1
  ${
    isConcept
        ? "bg-amber-400/70"
        : "bg-blue-400/70"
  }
  `}
        />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 pl-2">

            <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-2">

                    {/* Type */}
                    <span
                        className={`
  inline-flex items-center gap-1.5
  rounded-full
  px-2.5 py-1
  text-[10px]
  font-semibold
  uppercase
  tracking-[0.14em]
  ${
    isConcept
        ? "bg-amber-400/10 text-amber-400"
        : "bg-blue-400/10 text-blue-400"
  }
  `}
                    >
                        <span
                            className={`
  h-1.5 w-1.5 rounded-full
  ${
    isConcept
        ? "bg-amber-400"
        : "bg-blue-400"
  }
  `}
                        />

                        {isConcept ? "Concept" : "Paper"}
                    </span>

                    {note.section && (
                        <span className="text-xs text-(--subtle)">
                            {note.section}
                        </span>
                    )}

                    {note.field && (
                        <span className="truncate text-xs text-(--subtle)">
                            {note.field}
                        </span>
                    )}

                </div>

                {/* Title */}
                <Link
                    href={note.href}
                    className="
                        mt-3 block
                        line-clamp-2
                        text-xl font-semibold
                        leading-tight
                        tracking-tight
                        transition
                        hover:text-(--accent)
                    "
                >
                    {note.title}
                </Link>

            </div>

            {/* Open */}
            <Link
                href={note.href}
                className="
                    shrink-0
                    rounded-lg
                    border border-(--border)
                    px-2.5 py-1.5
                    text-xs
                    text-(--muted)
                    transition
                    hover:border-(--accent)
                    hover:bg-(--accent-soft)
                    hover:text-(--accent)
                "
            >
                Open
            </Link>

        </div>


        {/* Note paper */}
        <div
            className="
                relative
                mt-6
                overflow-hidden
                rounded-xl
                border border-(--border)
                bg-(--background)
                p-5
                pl-6
            "
        >




            {/* Content */}
            <p
                className="
                    relative
                    whitespace-pre-wrap
                    text-sm
                    leading-7
                    text-(--muted)
                "
            >
                {note.content}
            </p>

        </div>


        {/* Metadata */}
        <div
            className="
                mt-5
                flex flex-wrap
                items-center
                gap-x-5 gap-y-2
                pl-2
                text-xs
                text-(--subtle)
            "
        >

            <span>
                {note.dateLabel}{" "}
                {new Date(note.date).toLocaleDateString()}
            </span>

            {isConcept && (
                <>
                    <span>
                        {note.paperCount ?? 0}{" "}
                        {note.paperCount === 1
                            ? "paper"
                            : "papers"}
                    </span>

                    <span>
                        {note.relationshipCount ?? 0}{" "}
                        {note.relationshipCount === 1
                            ? "relationship"
                            : "relationships"}
                    </span>
                </>
            )}

            {!isConcept && (
                <span>
                    Research note
                </span>
            )}

        </div>

    </article>
);


}



function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
rounded-xl
border
px-3.5 py-2
text-sm
transition
${
  active
    ? "border-(--accent) bg-(--accent-soft) text-(--accent)"
    : "border-(--border) bg-(--surface) text-(--muted) hover:border-(--accent) hover:text-(--accent)"
}
`}
    >
      {children}
    </button>
  );
}

function EmptyState({
  hasSearch,
  filter,
}: {
  hasSearch: boolean;
  filter: NoteFilter;
}) {
  let title = "No notes yet";
  let description =
    "Your personal notes will appear here once you add them to a concept or paper.";

  if (hasSearch) {
    title = "No matching notes";
    description = "Try a different search term or clear your search.";
  } else if (filter === "concepts") {
    title = "No concept notes yet";
    description =
      "Add personal notes to your concepts and they will appear here.";
  } else if (filter === "papers") {
    title = "No paper notes yet";
    description =
      "Add research notes to your papers and they will appear here.";
  }

  return (
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

      <h2 className="mt-5 text-lg font-semibold">{title}</h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-(--muted)">
        {description}
      </p>

      {!hasSearch && (
        <Link
          href={filter === "papers" ? "/papers" : "/concepts"}
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
          {filter === "papers" ? "Browse Papers" : "Browse Concepts"}
        </Link>
      )}
    </div>
  );
}
