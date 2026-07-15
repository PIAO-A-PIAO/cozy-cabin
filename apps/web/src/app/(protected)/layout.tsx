"use client"

import { useContext, useEffect } from "react";
import { AuthContext } from "../AuthProvider";
import { useRouter } from "next/navigation";

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
    <>
      {children}
    </>
  );
}
