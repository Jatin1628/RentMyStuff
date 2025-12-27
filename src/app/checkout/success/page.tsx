"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [status, setStatus] = useState<"loading" | "saved" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      const sessionId = params.get("session_id");
      if (!sessionId) {
        setStatus("error");
        setMessage("Missing session id");
        return;
      }
      try {
        const res = await fetch(`/api/checkout/session?session_id=${sessionId}`);
        const s = await res.json();
        if (!res.ok) throw new Error(s.error || "Failed to verify session");
        const meta = s.metadata as Record<string, string>;
        const amount = Number(meta.amount ?? s.amount_total / 100);
        const duration = Number(meta.days ?? 1);
        const itemId = meta.itemId;
        const ownerId = meta.ownerId;
        const renterId = meta.renterId || user?.uid || "";
        if (!itemId || !ownerId || !renterId) throw new Error("Missing metadata");

        await addDoc(collection(db, "orders"), {
          itemId,
          renterId,
          ownerId,
          amount,
          duration,
          status: "paid",
          createdAt: serverTimestamp(),
        });
        setStatus("saved");
        setMessage("Payment successful. Order saved.");
      } catch (e) {
        setStatus("error");
        setMessage(e instanceof Error ? e.message : "Failed to save order");
      }
    };
    run();
  }, [params, user]);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {status === "loading" && (
          <>
            <div className="animate-spin w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900">Verifying Payment</h1>
            <p className="text-gray-600">Please wait while we process your order...</p>
          </>
        )}

        {status === "saved" && (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Successful!</h1>
            <p className="text-gray-600">
              Your rental order has been confirmed. You'll receive a confirmation email shortly.
            </p>
            <div className="pt-4 space-y-3">
              <button
                className="w-full px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => router.push("/rentals")}
              >
                View My Rentals
              </button>
              <Link
                href="/items"
                className="block px-6 py-3 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Failed</h1>
            <p className="text-gray-600">{message}</p>
            <Link
              href="/items"
              className="inline-block px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Back to Marketplace
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
