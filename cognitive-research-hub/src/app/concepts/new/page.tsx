"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";

import { saveConcept } from "@/lib/concepts";
import { Concept } from "@/types/concept";

export default function NewConceptPage() {
    const router = useRouter();


function handleSubmit(
    event: FormEvent<HTMLFormElement>
) {
    event.preventDefault();

    const formData = new FormData(
        event.currentTarget
    );

    const concept: Concept = {
        id: crypto.randomUUID(),

        name: formData.get("name") as string,

        definition:
            formData.get("definition") as string,

        field:
            formData.get("field") as string,

        aliases: (formData.get("aliases") as string)
            .split(",")
            .map((alias) => alias.trim())
            .filter(Boolean),

        relations: [],

        paperIds: [],

        notes:
            formData.get("notes") as string,
        understanding:
            formData.get("understanding") as string,

        openQuestions:
            formData.get("openQuestions") as string,

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    void saveConcept(concept);

    router.push(`/concepts/${concept.id}`);
}

return (
    <main className="min-h-screen bg-(--background) text-(--foreground)">
        <div className="mx-auto max-w-3xl px-6 py-12">

            {/* Back */}
            <button
                type="button"
                onClick={() => router.back()}
                className="
                    text-sm text-(--muted)
                    transition
                    hover:text-(--foreground)
                "
            >
                ← Back
            </button>

            {/* Header */}
            <header className="mt-8">

                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-(--accent)" />

                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--accent)">
                        Knowledge Base
                    </p>
                </div>

                <h1 className="mt-4 text-4xl font-semibold tracking-tight">
                    New Concept
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-7 text-(--muted)">
                    Create a concept that you can later connect
                    to papers and other concepts.
                </p>

            </header>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="mt-10 space-y-6"
            >

                {/* Basic information */}
                <section
                    className="
                        rounded-2xl
                        border border-(--border)
                        bg-(--surface)
                        p-6
                        shadow-sm
                    "
                >
                    <div>
                        <h2 className="text-lg font-semibold">
                            Basic Information
                        </h2>

                        <p className="mt-1 text-sm text-(--muted)">
                            Define the core identity of this concept.
                        </p>
                    </div>

                    <div className="mt-6 space-y-6">

                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="text-sm font-medium"
                            >
                                Name
                            </label>

                            <input
                                id="name"
                                name="name"
                                required
                                placeholder="e.g. Cognitive Offloading"
                                className="
                                    mt-2 w-full rounded-xl
                                    border border-(--border)
                                    bg-(--background)
                                    px-4 py-3
                                    text-(--foreground)
                                    outline-none
                                    transition
                                    focus:ring-2
                                    focus:ring-(--accent-soft)
                                "
                            />
                        </div>

                        {/* Field */}
                        <div>
                            <label
                                htmlFor="field"
                                className="text-sm font-medium"
                            >
                                Field
                            </label>

                            <input
                                id="field"
                                name="field"
                                placeholder="e.g. Cognitive Psychology"
                                className="
                                    mt-2 w-full rounded-xl
                                    border border-(--border)
                                    bg-(--background)
                                    px-4 py-3
                                    text-(--foreground)
                                    outline-none
                                    transition
                                    focus:ring-2
                                    focus:ring-(--accent-soft)
                                "
                            />
                        </div>

                        {/* Aliases */}
                        <div>
                            <label
                                htmlFor="aliases"
                                className="text-sm font-medium"
                            >
                                Aliases
                            </label>

                            <input
                                id="aliases"
                                name="aliases"
                                placeholder="Mental Offloading, Cognitive Externalization"
                                className="
                                    mt-2 w-full rounded-xl
                                    border border-(--border)
                                    bg-(--background)
                                    px-4 py-3
                                    text-(--foreground)
                                    outline-none
                                    transition
                                    focus:ring-2
                                    focus:ring-(--accent-soft)
                                "
                            />

                            <p className="mt-2 text-xs text-(--muted)">
                                Separate multiple aliases with commas.
                            </p>
                        </div>

                    </div>
                </section>

                {/* Definition */}
                <section
                    className="
                        rounded-2xl
                        border border-(--border)
                        bg-(--surface)
                        p-6
                        shadow-sm
                    "
                >
                    <div>
                        <h2 className="text-lg font-semibold">
                            Definition
                        </h2>

                        <p className="mt-1 text-sm text-(--muted)">
                            Capture the scientific meaning of the concept.
                        </p>
                    </div>

                    <textarea
                        id="definition"
                        name="definition"
                        rows={6}
                        placeholder="What does this concept mean? How is it defined in the literature?"
                        className="
                            mt-6 w-full resize-y rounded-xl
                            border border-(--border)
                            bg-(--background)
                            px-4 py-3
                            leading-6
                            text-(--foreground)
                            outline-none
                            transition
                            focus:ring-2
                            focus:ring-(--accent-soft)
                        "
                    />
                </section>
                {/* My Understanding */}
                <section
                    className="
                            rounded-2xl
                            border border-(--border)
                            bg-(--surface)
                            p-6
                            shadow-sm
                        "
                >
                    <div>
                        <h2 className="text-lg font-semibold">
                            My Understanding
                        </h2>

                        <p className="mt-1 text-sm text-(--muted)">
                            Explain the concept in your own words.
                        </p>
                    </div>

                    <textarea
                        id="understanding"
                        name="understanding"
                        rows={8}
                        placeholder="I currently understand this concept as..."
                        className="
                                mt-6 w-full resize-y rounded-xl
                                border border-(--border)
                                bg-(--background)
                                px-4 py-3
                                leading-6
                                text-(--foreground)
                                outline-none
                                transition
                                focus:ring-2
                                focus:ring-(--accent-soft)
                            "
                    />
                </section>

                {/* Open Questions */}
                <section
                    className="
                            rounded-2xl
                            border border-(--border)
                            bg-(--surface)
                            p-6
                            shadow-sm
                        "
                >
                    <div>
                        <h2 className="text-lg font-semibold">
                            Open Questions
                        </h2>

                        <p className="mt-1 text-sm text-(--muted)">
                            What do you still not understand or want to investigate?
                        </p>
                    </div>

                    <textarea
                        id="openQuestions"
                        name="openQuestions"
                        rows={8}
                        placeholder="I still don't understand..."
                        className="
                                mt-6 w-full resize-y rounded-xl
                                border border-(--border)
                                bg-(--background)
                                px-4 py-3
                                leading-6
                                text-(--foreground)
                                outline-none
                                transition
                                focus:ring-2
                                focus:ring-(--accent-soft)
                            "
                    />
                </section>

                {/* Personal notes */}
                <section
                    className="
                        rounded-2xl
                        border border-(--border)
                        bg-(--surface)
                        p-6
                        shadow-sm
                    "
                >
                    <div>
                        <h2 className="text-lg font-semibold">
                            My Notes
                        </h2>

                        <p className="mt-1 text-sm text-(--muted)">
                            Your own understanding, questions and thoughts.
                        </p>
                    </div>

                    <textarea
                        id="notes"
                        name="notes"
                        rows={8}
                        placeholder="What do you think about this concept? What questions remain?"
                        className="
                            mt-6 w-full resize-y rounded-xl
                            border border-(--border)
                            bg-(--background)
                            px-4 py-3
                            leading-6
                            text-(--foreground)
                            outline-none
                            transition
                            focus:ring-2
                            focus:ring-(--accent-soft)
                        "
                    />
                </section>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">

                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="
                            rounded-xl
                            px-4 py-2.5
                            text-sm font-medium
                            text-(--muted)
                            transition
                            hover:bg-(--surface-hover)
                            hover:text-(--foreground)
                        "
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="
                            rounded-xl
                            bg-(--accent)
                            px-5 py-2.5
                            text-sm font-medium text-white
                            shadow-sm
                            transition
                            hover:bg-(--accent-hover)
                            hover:shadow-md
                        "
                    >
                        Create Concept
                    </button>

                </div>

            </form>
        </div>
    </main>
);


}
