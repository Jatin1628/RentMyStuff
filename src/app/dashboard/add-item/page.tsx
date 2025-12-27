"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";

export default function AddItemPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!images || images.length === 0) return alert("Upload at least one image");

    try {
      setLoading(true);

      // 1️⃣ Upload images to Firebase Storage
      const imageUrls: string[] = [];

      for (const image of Array.from(images)) {
        const imageRef = ref(
          storage,
          `items/${user.uid}/${Date.now()}-${image.name}`
        );

        await uploadBytes(imageRef, image);
        const url = await getDownloadURL(imageRef);
        imageUrls.push(url);
      }

      // 2️⃣ Save item data to Firestore
      await addDoc(collection(db, "items"), {
        title,
        description,
        pricePerDay: Number(pricePerDay),
        category,
        imageUrls,
        ownerId: user.uid,
        ownerName: user.displayName,
        ownerPhoto: user.photoURL,
        isAvailable: true,
        createdAt: serverTimestamp(),
      });

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Item</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Item title"
          className="w-full border p-3 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          className="w-full border p-3 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price per day (₹)"
          className="w-full border p-3 rounded"
          value={pricePerDay}
          onChange={(e) => setPricePerDay(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Category (Camera, Cycle, Tool...)"
          className="w-full border p-3 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(e.target.files)}
          className="w-full"
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-800"
        >
          {loading ? "Uploading..." : "Create Item"}
        </button>
      </form>
    </div>
  );
}


