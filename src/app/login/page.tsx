"use client";

import { signInWithGoogle } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Google sign-in failed");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-black text-white rounded-lg"
      >
        Sign in with Google
      </button>
    </main>
  );
}
