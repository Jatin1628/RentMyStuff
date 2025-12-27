"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";

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
    <main className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-2">Payment Success</h1>
      {status === "loading" && <p>Verifying payment...</p>}
      {status === "saved" && (
        <>
          <p className="mb-4">{message}</p>
          <button
            className="mt-4 bg-black text-white px-4 py-2 rounded"
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
          </button>
        </>
      )}
      {status === "error" && <p className="text-red-600">{message}</p>}
    </main>
  );
}

