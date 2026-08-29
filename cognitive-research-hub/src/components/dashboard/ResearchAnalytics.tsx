"use client";

import { Concept } from "@/types/concept";
import { Paper } from "@/types/paper";
import Link from "next/link";

type ResearchAnalyticsProps = {
    concepts: Concept[];
    papers: Paper[];
};

const relationColors: Record<string, string> = {
    related: "#71717a",
    contrasts: "#ef4444",
    "part-of": "#3b82f6",
    contains: "#3b82f6",
    causes: "#f59e0b",
    "caused-by": "#f59e0b",
    supports: "#8b5cf6",
    "supported-by": "#8b5cf6",
};

const relationLabels: Record<string, string> = {
    related: "Related",
    contrasts: "Contrasts",
    "part-of": "Part of",
    contains: "Contains",
    causes: "Causes",
    "caused-by": "Caused by",
    supports: "Supports",
    "supported-by": "Supported by",
};

export default function ResearchAnalytics({
                                              concepts,
                                              papers,
                                          }: ResearchAnalyticsProps) {
    const relationCounts = concepts.reduce<Record<string, number>>(
        (counts, concept) => {
            concept.relations.forEach((relation) => {
                counts[relation.type] =
                    (counts[relation.type] || 0) + 1;
            });

            return counts;
        },
        {}
    );

    const relationData = Object.entries(relationCounts)
        .sort((a, b) => b[1] - a[1]);

    const maxRelationCount =
        relationData.length > 0
            ? Math.max(...relationData.map(([, count]) => count))
            : 1;

    const connectedConcepts = [...concepts]
        .map((concept) => ({
            ...concept,
            connectionCount:
                concept.relations.length +
                concept.paperIds.length,
        }))
        .sort(
            (a, b) =>
                b.connectionCount - a.connectionCount
        )
        .slice(0, 5);

    const activity = getActivity(
        concepts,
        papers
    );

    const maxActivity = Math.max(
        ...activity.map((day) => day.count),
        1
    );

    return (
        <section className="mt-6 space-y-6">

            {/* Section Header */}
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                    Knowledge Analytics
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                    Understand your research network
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                    See how your concepts are connected and how
                    your research library is growing over time.
                </p>
            </div>

            {/* Analytics Grid */}
            <div className="grid gap-6 lg:grid-cols-2">

                {/* Relation Types */}
                <section
                    className="
                        rounded-2xl
                        border border-[var(--border)]
                        bg-[var(--surface)]
                        p-6
                        shadow-sm
                    "
                >
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                            Relationship Types
                        </p>

                        <h3 className="mt-2 text-lg font-semibold">
                            How your concepts connect
                        </h3>
                    </div>

                    {relationData.length === 0 ? (
                        <div className="mt-8 rounded-xl border border-dashed border-[var(--border)] px-5 py-8 text-center">
                            <p className="text-sm text-[var(--muted)]">
                                No relationships yet.
                            </p>

                            <p className="mt-1 text-xs text-[var(--subtle)]">
                                Connect concepts to see relationship statistics.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-7 space-y-5">
                            {relationData.map(
                                ([type, count]) => {
                                    const percentage =
                                        (count /
                                            maxRelationCount) *
                                        100;

                                    return (
                                        <div key={type}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="h-2 w-2 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                relationColors[
                                                                    type
                                                                    ] ??
                                                                "var(--accent)",
                                                        }}
                                                    />

                                                    <span className="text-sm text-[var(--foreground)]">
                                                        {relationLabels[
                                                            type
                                                            ] ?? type}
                                                    </span>
                                                </div>

                                                <span className="text-sm font-medium text-[var(--muted)]">
                                                    {count}
                                                </span>
                                            </div>

                                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--background)]">
                                                <div
                                                    className="h-full rounded-full transition-all"
                                                    style={{
                                                        width: `${percentage}%`,
                                                        backgroundColor:
                                                            relationColors[
                                                                type
                                                                ] ??
                                                            "var(--accent)",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
                </section>

                {/* Most Connected */}
                <section
                    className="
                        rounded-2xl
                        border border-[var(--border)]
                        bg-[var(--surface)]
                        p-6
                        shadow-sm
                    "
                >
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                            Most Connected
                        </p>

                        <h3 className="mt-2 text-lg font-semibold">
                            Your central concepts
                        </h3>
                    </div>

                    {connectedConcepts.length === 0 ? (
                        <div className="mt-8 rounded-xl border border-dashed border-[var(--border)] px-5 py-8 text-center">
                            <p className="text-sm text-[var(--muted)]">
                                No concepts yet.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-6 space-y-2">
                            {connectedConcepts.map(
                                (concept, index) => (
                                    <div
                                        key={concept.id}
                                        className="
                                            flex items-center gap-4
                                            rounded-xl
                                            px-3 py-3
                                            transition
                                            hover:bg-[var(--surface-hover)]
                                        "
                                    >
                                        <div
                                            className="
                                                flex h-9 w-9
                                                shrink-0
                                                items-center justify-center
                                                rounded-lg
                                                bg-[var(--accent-soft)]
                                                text-sm font-semibold
                                                text-[var(--accent)]
                                            "
                                        >
                                            {index + 1}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">
                                                {concept.name}
                                            </p>

                                            <p className="mt-1 text-xs text-[var(--muted)]">
                                                {concept.relations.length}{" "}
                                                {concept.relations.length === 1
                                                    ? "concept relationship"
                                                    : "concept relationships"}
                                                {" · "}
                                                {concept.paperIds.length}{" "}
                                                {concept.paperIds.length === 1
                                                    ? "paper"
                                                    : "papers"}
                                            </p>
                                        </div>

                                        <span className="text-sm font-semibold text-[var(--foreground)]">
                                            {concept.connectionCount}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                    {/* Explore */}
                    <div className="mt-4 flex justify-end">
                        <Link
                            href="/concepts"
                            className="
                rounded-xl
                border border-[var(--border)]
                bg-[var(--background)]
                px-4 py-2.5
                text-sm font-medium
                text-[var(--foreground)]
                transition
                hover:bg-[var(--surface-hover)]
                hover:border-[var(--accent)]
            "
                        >
                            Explore Concepts →
                        </Link>
                    </div>
                </section>
            </div>

            {/* Activity */}
            <section
                className="
                    rounded-2xl
                    border border-[var(--border)]
                    bg-[var(--surface)]
                    p-6
                    shadow-sm
                "
            >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                            Research Activity
                        </p>

                        <h3 className="mt-2 text-lg font-semibold">
                            Your research over the last 7 days
                        </h3>
                    </div>

                    <p className="text-sm text-[var(--muted)]">
                        {papers.length + concepts.length} total items
                    </p>
                </div>

                <div className="mt-8">
                    <div className="flex h-40 items-end gap-2 sm:gap-4">
                        {activity.map((day) => {
                            const height =
                                day.count === 0
                                    ? 4
                                    : Math.max(
                                        8,
                                        (day.count /
                                            maxActivity) *
                                        100
                                    );

                            return (
                                <div
                                    key={day.date}
                                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                                >
                                    <span className="text-xs font-medium text-[var(--muted)]">
                                        {day.count > 0
                                            ? day.count
                                            : ""}
                                    </span>

                                    <div className="flex h-full w-full items-end">
                                        <div
                                            className="
                                                w-full
                                                rounded-t-lg
                                                bg-[var(--accent)]
                                                opacity-80
                                                transition-all
                                                hover:opacity-100
                                            "
                                            style={{
                                                height: `${height}%`,
                                            }}
                                        />
                                    </div>

                                    <span className="text-[10px] text-[var(--subtle)] sm:text-xs">
                                        {day.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </section>
    );
}

function getActivity(
    concepts: Concept[],
    papers: Paper[]
) {
    const days = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();

        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - i);

        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const conceptCount = concepts.filter(
            (concept) => {
                const created = new Date(
                    concept.createdAt
                );

                return (
                    created >= date &&
                    created < nextDate
                );
            }
        ).length;

        const paperCount = papers.filter(
            (paper) => {
                const created = new Date(
                    paper.createdAt
                );

                return (
                    created >= date &&
                    created < nextDate
                );
            }
        ).length;

        days.push({
            date: date.toISOString(),
            label: date.toLocaleDateString(
                "en-US",
                {
                    weekday: "short",
                }
            ),
            count:
                conceptCount +
                paperCount,
        });
    }

    return days;
}