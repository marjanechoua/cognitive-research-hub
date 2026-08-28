import Link from "next/link";

export default function PapersPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="mx-auto max-w-6xl px-6 py-10">

                <header className="flex items-center justify-between">
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
                        className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200"
                    >
                        + Add Paper
                    </Link>
                </header>

                <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
                    <p className="text-center text-zinc-500">
                        No papers yet.
                    </p>

                    <div className="mt-4 text-center">
                        <Link
                            href="/papers/new"
                            className="text-sm text-zinc-300 underline underline-offset-4"
                        >
                            Add your first paper
                        </Link>
                    </div>
                </div>

            </div>
        </main>
    );
}