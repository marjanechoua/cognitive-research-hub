"use client";

import { SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage(
          "Account created. Check your email if confirmation is required.",
        );
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push("/");
        router.refresh();
      }
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-(--background) text-(--foreground)">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-6">
        <div className="w-full">
          <div className="mb-8">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-(--accent)" />

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--accent)">
                Research Hub
              </p>
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>

            <p className="mt-3 text-sm leading-6 text-(--muted)">
              {isSignUp
                ? "Create an account to save your research securely."
                : "Log in to access your research library."}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-(--border) bg-(--surface) p-6 shadow-sm"
          >
            <div className="space-y-5">
              <div>
                <label className="text-sm text-(--muted)">Email</label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="text-sm text-(--muted)">Password</label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={6}
                  className="mt-2 w-full rounded-xl border border-(--border) bg-(--background) px-4 py-3 outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {error}
              </p>
            )}

            {message && (
              <p className="mt-4 rounded-xl bg-(--accent-soft) px-4 py-3 text-sm text-(--accent)">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-(--accent) px-5 py-3 text-sm font-medium text-white transition hover:bg-(--accent-hover) disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : isSignUp
                  ? "Create Account"
                  : "Log In"}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
                setMessage("");
              }}
              className="mt-4 w-full text-sm text-(--muted) transition hover:text-(--foreground)"
            >
              {isSignUp
                ? "Already have an account? Log in"
                : "Don't have an account? Create one"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
