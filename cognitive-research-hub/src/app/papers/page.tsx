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
        setPapers(getPapers());
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
                paper.authors.toLowerCase().includes(normalizedSearch) ||
                paper.topics.some((topic) =>
                    topic.toLowerCase().includes(normalizedSearch)
                );

            return matchesStatus && matchesSearch;
        });
    }, [papers, search, statusFilter]);

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="mx-auto max-w-6xl px-6 py-10">

                {/* Header */}
                <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                    <div>
                        <p className="text-sm font-medium text-zinc-400">
                            RESEARCH LIBRARY
                        </p>

                        <h1 className="mt-2 text-3xl font-semibold">
                            Papers
                        </h1>

                        <p className="mt-2 text-zinc-400">
                            Your collection of scientific literature.
                        </p>
                    </div>

                    <Link
                        href="/papers/new"
                        className="w-fit rounded-xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200"
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

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">

                        {/* Search */}
                        <div>
                            <label
                                htmlFor="paper-search"
                                className="text-sm font-medium text-zinc-300"
                            >
                                Search
                            </label>

                            <div className="relative mt-2">

                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
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
                                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-zinc-600 focus:border-zinc-400"
                                />

                            </div>
                        </div>

                        {/* Status filter */}
                        <div className="mt-5">

                            <p className="text-sm font-medium text-zinc-300">
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

                        <p className="text-sm text-zinc-500">
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
                                className="text-sm text-zinc-400 transition hover:text-white"
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
            className="block rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-zinc-600 hover:bg-zinc-900/80"
        >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-3">

                        <StatusBadge status={paper.status} />

                        {paper.year && (
                            <span className="text-sm text-zinc-500">
                {paper.year}
              </span>
                        )}

                    </div>

                    <h2 className="mt-3 text-xl font-semibold">
                        {paper.title}
                    </h2>

                    {paper.authors && (
                        <p className="mt-2 text-sm text-zinc-400">
                            {paper.authors}
                        </p>
                    )}

                    {paper.topics.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">

                            {paper.topics.map((topic) => (
                                <span
                                    key={topic}
                                    className="rounded-full border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400"
                                >
                  {topic}
                </span>
                            ))}

                        </div>
                    )}

                </div>

                <span className="shrink-0 text-sm text-zinc-500">
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
            className={`rounded-xl border px-4 py-2 text-sm transition ${
                active
                    ? "border-zinc-300 bg-zinc-100 text-zinc-900"
                    : "border-zinc-700 bg-zinc-950 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
            }`}
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
        <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-zinc-300">
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
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">

            <p className="text-sm text-zinc-500">
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
            <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center">

                <h2 className="text-lg font-medium">
                    Your research library is empty
                </h2>

                <p className="mt-2 text-sm text-zinc-500">
                    Start building your literature collection by adding your first paper.
                </p>

                <Link
                    href="/papers/new"
                    className="mt-6 inline-block rounded-xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200"
                >
                    Add your first paper
                </Link>

            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center">

            <h2 className="text-lg font-medium">
                No papers found
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
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