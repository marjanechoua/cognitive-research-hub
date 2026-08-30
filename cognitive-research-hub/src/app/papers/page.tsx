"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { getPapers } from "@/lib/papers";
import { Paper } from "@/types/paper";

type StatusFilter = "all" | Paper["status"];

export default function PapersPage() {
    const [papers, setPapers] = useState<Paper[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("all");

    useEffect(() => {
        async function loadPapers() {
            const data = await getPapers();
            setPapers(data);
        }

        loadPapers();
    }, []);

    const filteredPapers = useMemo(() => {
        const normalizedSearch = search.toLowerCase().trim();

        return papers.filter((paper) => {
            const matchesStatus =
                statusFilter === "all" ||
                paper.status === statusFilter;

            const matchesSearch =
                normalizedSearch === "" ||
                paper.title.toLowerCase().includes(normalizedSearch) ||
                (paper.authors ?? []).some((author) =>
                    author.toLowerCase().includes(normalizedSearch)
                ) ||
                (paper.topics ?? []).some((topic) =>
                    topic.toLowerCase().includes(normalizedSearch)
                );

            return matchesStatus && matchesSearch;
        });
    }, [papers, search, statusFilter]);

    return (
        <main className="min-h-screen bg-(--background) text-(--foreground)">
            <div className="mx-auto max-w-6xl px-6 py-10">

                {/* Header */}
                <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                    <div>
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-(--accent)" />

                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--accent)">
                                Research Library
                            </p>
                        </div>

                        <h1 className="mt-2 text-3xl font-semibold">
                            Papers
                        </h1>

                        <p className="mt-2 text-(--muted)">
                            Your collection of scientific literature.
                        </p>
                    </div>

                    <Link
                        href="/papers/new"
                        className="
        w-fit rounded-xl
        bg-(--accent)
        px-4 py-2
        text-sm font-medium text-white
        shadow-sm
        transition
        hover:bg-(--accent-hover)
        hover:shadow-md
    "
                    >
                        + Add Paper
                    </Link>

                </header>

                {/* Stats */}
                <div className="mt-10 grid gap-4 md:grid-cols-3">

                    <StatCard
                        label="Total Papers"
                        value={papers.length}
                    />

                    <StatCard
                        label="Reading"
                        value={
                            papers.filter(
                                (paper) => paper.status === "reading"
                            ).length
                        }
                    />

                    <StatCard
                        label="Analyzed"
                        value={
                            papers.filter(
                                (paper) => paper.status === "analyzed"
                            ).length
                        }
                    />

                </div>

                {/* Search + Filter */}
                <section className="mt-10">

                    <div className="rounded-2xl border border-(--border) bg-(--surface) p-5">

                        {/* Search */}
                        <div>
                            <label
                                htmlFor="paper-search"
                                className="text-sm font-medium text-(--foreground)
"
                            >
                                Search
                            </label>

                            <div className="relative mt-2">

                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-(--muted)">
                  🔍
                </span>

                                <input
                                    id="paper-search"
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search by title, author or topic..."
                                    className="w-full rounded-xl border border-(--border) bg-(--background) py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-(--subtle)"
                                />

                            </div>
                        </div>

                        {/* Status filter */}
                        <div className="mt-5">

                            <p className="text-sm font-medium text-(--foreground)
">
                                Status
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">

                                <FilterButton
                                    label="All"
                                    active={statusFilter === "all"}
                                    onClick={() => setStatusFilter("all")}
                                />

                                <FilterButton
                                    label="To Read"
                                    active={statusFilter === "to-read"}
                                    onClick={() =>
                                        setStatusFilter("to-read")
                                    }
                                />

                                <FilterButton
                                    label="Reading"
                                    active={statusFilter === "reading"}
                                    onClick={() =>
                                        setStatusFilter("reading")
                                    }
                                />

                                <FilterButton
                                    label="Read"
                                    active={statusFilter === "read"}
                                    onClick={() =>
                                        setStatusFilter("read")
                                    }
                                />

                                <FilterButton
                                    label="Analyzed"
                                    active={statusFilter === "analyzed"}
                                    onClick={() =>
                                        setStatusFilter("analyzed")
                                    }
                                />

                            </div>

                        </div>

                    </div>

                </section>

                {/* Results */}
                <section className="mt-8">

                    <div className="mb-4 flex items-center justify-between">

                        <p className="text-sm text-(--muted)">
                            {filteredPapers.length}{" "}
                            {filteredPapers.length === 1
                                ? "paper"
                                : "papers"}
                        </p>

                        {(search || statusFilter !== "all") && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setStatusFilter("all");
                                }}
                                className="text-sm text-(--muted) transition hover:text-white"
                            >
                                Clear filters
                            </button>
                        )}

                    </div>

                    {filteredPapers.length === 0 ? (
                        <NoResults
                            hasPapers={papers.length > 0}
                            search={search}
                            statusFilter={statusFilter}
                        />
                    ) : (
                        <div className="grid gap-4">

                            {filteredPapers.map((paper) => (
                                <PaperCard
                                    key={paper.id}
                                    paper={paper}
                                />
                            ))}

                        </div>
                    )}

                </section>

            </div>
        </main>
    );
}

function PaperCard({
                       paper,
                   }: {
    paper: Paper;
}) {
    return (
        <Link
            href={`/papers/${paper.id}`}
            className="block rounded-2xl border border-(--border) bg-(--surface) p-6 transition hover:border-zinc-600 hover:bg-(--surface)/80"
        >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-3">

                        <StatusBadge status={paper.status} />

                        {paper.year && (
                            <span className="text-sm text-(--muted)">
                {paper.year}
              </span>
                        )}

                    </div>

                    <h2 className="mt-3 text-xl font-semibold">
                        {paper.title}
                    </h2>

                    {paper.authors && (
                        <p className="mt-2 text-sm text-(--muted)">
                            {paper.authors}
                        </p>
                    )}

                    {paper.topics.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">

                            {paper.topics.map((topic) => (
                                <span
                                    key={topic}
                                    className="rounded-full border border-(--border) px-2.5 py-1 text-xs text-(--muted)"
                                >
                  {topic}
                </span>
                            ))}

                        </div>
                    )}

                </div>

                <span className="shrink-0 text-sm text-(--muted)">
          View →
        </span>

            </div>
        </Link>
    );
}

function FilterButton({
                          label,
                          active,
                          onClick,
                      }: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                rounded-xl
                border
                px-4 py-2
                text-sm
                transition
                ${
                active
                    ? `
                            border-(--accent)
                            bg-(--accent-soft)
                            text-(--accent)
                        `
                    : `
                            border-(--border)
                            bg-(--background)
                            text-(--muted)
                            hover:border-(--accent)
                            hover:bg-(--accent-soft)
                            hover:text-(--accent)
                        `
            }
            `}
        >
            {label}
        </button>
    );
}
function StatusBadge({
                         status,
                     }: {
    status: Paper["status"];
}) {
    const labels = {
        "to-read": "To Read",
        reading: "Reading",
        read: "Read",
        analyzed: "Analyzed",
    };

    return (
        <span className="rounded-full border border-(--border) bg-(--background) px-3 py-1 text-xs text-(--foreground)
">
      {labels[status]}
    </span>
    );
}

function StatCard({
                      label,
                      value,
                  }: {
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-2xl border border-(--border) bg-(--surface) p-5">

            <p className="text-sm text-(--muted)">
                {label}
            </p>

            <p className="mt-2 text-3xl font-semibold">
                {value}
            </p>

        </div>
    );
}

function NoResults({
                       hasPapers,
                       search,
                       statusFilter,
                   }: {
    hasPapers: boolean;
    search: string;
    statusFilter: StatusFilter;
}) {
    if (!hasPapers) {
        return (
            <div className="rounded-2xl border border-dashed border-(--border) p-12 text-center">

                <h2 className="text-lg font-medium">
                    Your research library is empty
                </h2>

                <p className="mt-2 text-sm text-(--muted)">
                    Start building your literature collection by adding your first paper.
                </p>

                <Link
                    href="/papers/new"
                    className="mt-6 inline-block rounded-xl bg-(--surface) px-4 py-2 text-sm font-medium text-(--foreground) transition hover:bg-zinc-200"
                >
                    Add your first paper
                </Link>

            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-dashed border-(--border) p-12 text-center">

            <h2 className="text-lg font-medium">
                No papers found
            </h2>

            <p className="mt-2 text-sm text-(--muted)">
                {search
                    ? `No papers match "${search}".`
                    : `No papers with status "${getStatusLabel(statusFilter)}".`}
            </p>

        </div>
    );
}

function getStatusLabel(status: StatusFilter) {
    const labels = {
        all: "All",
        "to-read": "To Read",
        reading: "Reading",
        read: "Read",
        analyzed: "Analyzed",
    };

    return labels[status];
}