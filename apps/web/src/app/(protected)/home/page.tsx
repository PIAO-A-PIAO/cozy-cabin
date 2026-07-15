"use client";

import { AuthContext } from "@/app/AuthProvider";
import { logout } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function HomePage() {
  const { user, resetUser } = useContext(AuthContext); 
  const router = useRouter()

  const handleLogout = async () => {
    await logout();
    resetUser();
    router.replace('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 shadow-sm text-center">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
          Welcome, {user?.displayName || user?.email || "User"}
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          You are successfully logged in.
        </p>
        <button
          onClick={handleLogout}
          className="w-full py-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-medium rounded text-sm transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
