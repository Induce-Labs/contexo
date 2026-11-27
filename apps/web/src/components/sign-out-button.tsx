"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth/client";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onSignOut() {
    setPending(true);
    try {
      const { error } = await authClient.signOut();
      if (error) {
        throw new Error(error.message || "Sign out failed");
      }
      router.push("/auth/sign-in");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onSignOut}
      disabled={pending}
      className="rounded-md px-3 py-2 text-left text-sm font-medium text-muted hover:bg-white/70 hover:text-foreground disabled:opacity-60"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
