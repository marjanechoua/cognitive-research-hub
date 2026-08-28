const stats = [
    { label: "Papers", value: "0" },
    { label: "Concepts", value: "0" },
    { label: "Projects", value: "0" },
    { label: "Notes", value: "0" },
];

export default function Home() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="mx-auto max-w-7xl px-6 py-10">

                {/* Header */}
                <header className="mb-12">
                    <p className="mb-3 text-sm font-medium text-zinc-400">
                        COGNITIVE SCIENCE RESEARCH HUB
                    </p>

                    <h1 className="text-4xl font-semibold tracking-tight">
                        Welcome back.
                    </h1>

                    <p className="mt-3 max-w-2xl text-zinc-400">
                        Your personal research space for exploring cognition,
                        neuroscience, human-AI interaction and related fields.
                    </p>
                </header>

                {/* Stats */}
                <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
                        >
                            <p className="text-sm text-zinc-400">
                                {stat.label}
                            </p>

                            <p className="mt-2 text-3xl font-semibold">
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </section>

                {/* Current research */}
                <section className="mt-12">
                    <div className="mb-5">
                        <h2 className="text-xl font-semibold">
                            Current Research
                        </h2>

                        <p className="mt-1 text-sm text-zinc-400">
                            What you are currently exploring.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                        <p className="text-sm text-zinc-400">
                            Research focus
                        </p>

                        <h3 className="mt-2 text-2xl font-medium">
                            Generative AI & Cognitive Offloading
                        </h3>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                            Exploring the relationship between generative AI,
                            cognitive delegation, metacognition and critical
                            judgment.
                        </p>
                    </div>
                </section>

                {/* Quick actions */}
                <section className="mt-12">
                    <h2 className="mb-5 text-xl font-semibold">
                        Quick Actions
                    </h2>

                    <div className="grid gap-4 md:grid-cols-3">

                        <button className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-left transition hover:border-zinc-600">
                            <p className="font-medium">+ Add Paper</p>
                            <p className="mt-2 text-sm text-zinc-400">
                                Add a new paper to your research library.
                            </p>
                        </button>

                        <button className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-left transition hover:border-zinc-600">
                            <p className="font-medium">+ Add Concept</p>
                            <p className="mt-2 text-sm text-zinc-400">
                                Document a concept you want to understand.
                            </p>
                        </button>

                        <button className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-left transition hover:border-zinc-600">
                            <p className="font-medium">+ Add Project</p>
                            <p className="mt-2 text-sm text-zinc-400">
                                Start documenting a research project.
                            </p>
                        </button>

                    </div>
                </section>

            </div>
        </main>
    );
}