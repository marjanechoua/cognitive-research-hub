
export default function Footer() {
    return (
        <footer className="border-t border-(--border) bg-(--surface)">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">

                <div>
                    <p className="text-sm font-medium text-(--foreground)">
                        Knowledge Base
                    </p>

                    <p className="mt-1 text-xs text-(--muted)">
                        Your personal research space.
                    </p>
                </div>

                <p className="text-xs text-(--subtle)">
                    Built for learning, thinking, and connecting ideas.
                </p>

            </div>
        </footer>
    );
}

