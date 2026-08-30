
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { supabase } from "@/lib/supabase/client";
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
    const router = useRouter();

    const [user, setUser] = useState<any>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function loadUser() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            setUser(user);
        }

        loadUser();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(
                    event.target as Node
                )
            ) {
                setMenuOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    async function handleLogout() {
        await supabase.auth.signOut();

        setMenuOpen(false);
        router.push("/login");
        router.refresh();
    }

    const userInitial =
        user?.email?.charAt(0).toUpperCase() ?? "?";

    return (
        <header
            className="
                sticky top-0 z-50
                border-b border-(--border)
                bg-(--background)/90
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
                            bg-(--accent)
                            text-sm font-semibold text-white
                        "
                    >
                        CR
                    </div>

                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold tracking-tight">
                            Cognitive Research
                        </p>

                        <p className="text-xs text-(--muted)">
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
                ? "bg-(--accent-soft) text-(--accent)"
                : "text-(--muted) hover:bg-(--surface-hover) hover:text-(--foreground)"
        }
                                `}
    >
        {item.name}
    </Link>
);
})}
</nav>

{/* Right side */}
<div className="flex items-center gap-2">

    <ThemeToggle />

    {/* User */}
    <div
        ref={menuRef}
        className="relative"
    >
        {user ? (
            <>
                <button
                    type="button"
                    onClick={() =>
                        setMenuOpen(!menuOpen)
                    }
                    className="
                                        flex h-9 w-9
                                        items-center justify-center
                                        rounded-full
                                        bg-(--accent-soft)
                                        text-sm font-semibold
                                        text-(--accent)
                                        transition
                                        hover:bg-(--accent)
                                        hover:text-white
                                    "
                    aria-label="Open user menu"
                >
                    {userInitial}
                </button>

                {menuOpen && (
                    <div
                        className="
                                            absolute right-0 mt-2
                                            w-64
                                            rounded-xl
                                            border border-(--border)
                                            bg-(--surface)
                                            p-2
                                            shadow-lg
                                        "
                    >
                        <div className="px-3 py-3">
                            <p className="text-xs font-medium uppercase tracking-wider text-(--muted)">
                                Signed in as
                            </p>

                            <p className="mt-1 truncate text-sm font-medium text-(--foreground)">
                                {user.email}
                            </p>
                        </div>

                        <div className="my-1 border-t border-(--border)" />

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="
                                                w-full rounded-lg
                                                px-3 py-2
                                                text-left text-sm
                                                text-(--muted)
                                                transition
                                                hover:bg-red-500/10
                                                hover:text-red-500
                                            "
                        >
                            Log out
                        </button>
                    </div>
                )}
            </>
        ) : (
            <Link
                href="/login"
                className="
                                    rounded-lg
                                    border border-(--border)
                                    px-3 py-2
                                    text-sm font-medium
                                    text-(--foreground)
                                    transition
                                    hover:border-(--accent)
                                    hover:bg-(--accent-soft)
                                    hover:text-(--accent)
                                "
            >
                Log in
            </Link>
        )}
    </div>

</div>

</div>
</header>
);
}

