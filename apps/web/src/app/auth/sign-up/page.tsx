"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signUpWithEmail } from "./actions";

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUpWithEmail, null);

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Create your account</h1>
      <p className="mt-2 text-sm text-muted">
        Save and organise information across Categories, Recents, and Connections.
      </p>

      <form action={formAction} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">Name</span>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            className="rounded-md border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
          />
        </label>
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
            minLength={8}
            autoComplete="new-password"
            className="rounded-md border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-accent"
          />
        </label>

        {state?.error ? (
          <p className="text-sm text-red-700" role="alert">
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isPending ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/auth/sign-in" className="font-medium text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
