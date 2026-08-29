"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/theme-toggle";

const navigation = [
    {
        name: "Papers",
        href: "/papers",
    },
    {
        name: "Concepts",
        href: "/concepts",
    },
    {
        name: "Notes",
        href: "/notes",
    },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <header
            className="
                sticky top-0 z-50
                border-b border-[var(--border)]
                bg-[var(--background)]/90
                backdrop-blur-xl
            "
        >
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-3"
                >
                    <div
                        className="
                            flex h-9 w-9 items-center justify-center
                            rounded-xl
                            bg-[var(--accent)]
                            text-sm font-semibold text-white
                        "
                    >
                        CR
                    </div>

                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold tracking-tight">
                            Cognitive Research
                        </p>

                        <p className="text-xs text-[var(--muted)]">
                            Personal Knowledge Base
                        </p>
                    </div>
                </Link>

                {/* Navigation */}
                <nav className="flex items-center gap-1">
                    {navigation.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            pathname.startsWith(
                                `${item.href}/`
                            );

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    rounded-lg px-3 py-2
                                    text-sm font-medium
                                    transition
                                    ${
                                    isActive
                                        ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                                        : "text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                                }
                                `}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Theme */}
                <ThemeToggle />

            </div>
        </header>
    );
}