"use client"

import { useContext, useEffect } from "react";
import { AuthContext } from "../AuthProvider";
import { useRouter } from "next/navigation";

export default function GuestRoute({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {user, isLoading} = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && user.id != "") {
      router.replace("/home")
    }
  }, [user, isLoading, router])
  
  if (isLoading || user.id != "") {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
      )
  }

  return (
    <>
      {children}
    </>
  );
}
