"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { authClient } from "@/lib/auth/client";

import { signInWithEmail } from "./actions";

export default function SignInPage() {
  const [state, formAction, isPending] = useActionState(signInWithEmail, null);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [googlePending, setGooglePending] = useState(false);

  async function onGoogleSignIn() {
    setGooglePending(true);
    setGoogleError(null);
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/categories",
      });
      if (error) {
        setGoogleError(error.message || "Google sign-in failed.");
      }
    } catch (error) {
      setGoogleError(error instanceof Error ? error.message : "Google sign-in failed.");
    } finally {
      setGooglePending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Sign in to Contexo</h1>
      <p className="mt-2 text-sm text-muted">
        Use your Contexo account to open Categories, Recents, and Connections.
      </p>

      <form action={formAction} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="rounded-md border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">Password</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="rounded-md border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
          />
        </label>

        {(state?.error || googleError) && (
          <p className="text-sm text-red-700" role="alert">
            {state?.error || googleError}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <button
        type="button"
        onClick={onGoogleSignIn}
        disabled={googlePending}
        className="mt-3 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-semibold text-foreground disabled:opacity-60"
      >
        {googlePending ? "Redirecting…" : "Continue with Google"}
      </button>

      <p className="mt-6 text-sm text-muted">
        No account yet?{" "}
        <Link href="/auth/sign-up" className="font-medium text-accent hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
