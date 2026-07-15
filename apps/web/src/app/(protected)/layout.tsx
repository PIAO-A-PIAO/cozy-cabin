"use client"

import { useContext, useEffect } from "react";
import { AuthContext } from "../AuthProvider";
import { useRouter } from "next/navigation";
import TopBar from "./TopBar";
import { Toaster } from "sonner";

export default function ProtectedRoute({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = useContext(AuthContext);
  const {user, isLoading} = auth;
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && user.id == "") {
      router.replace("/login")
    }
  }, [user, isLoading])
  
  if (isLoading || user.id == "") {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
      )
  }

  if (user.id == "") {
    return null
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <TopBar />
      {children}
      <Toaster position="top-center" richColors/>
    </div>
  );
}
