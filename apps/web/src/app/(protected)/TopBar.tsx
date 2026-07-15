"use client";

import { AuthContext } from "@/app/AuthProvider";
import { logout } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function TopBar() {
  const { user, resetUser } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    resetUser();
    router.replace("/login");
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
        Hello, {user.displayName || user.email || "User"}
      </div>
      <button
        onClick={handleLogout}
        className="rounded bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Logout
      </button>
    </header>
  );
}
