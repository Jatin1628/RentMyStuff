"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

export default function AddItemPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImages(files);
      const previews = Array.from(files).map((file) => {
        const reader = new FileReader();
        let result = "";
        reader.onload = () => {
          result = reader.result as string;
          setImagePreview((prev) => [...prev, result]);
        };
        reader.readAsDataURL(file);
        return file;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }
    if (!description.trim()) {
      setError("Please enter a description");
      return;
    }
    if (!pricePerDay || Number(pricePerDay) <= 0) {
      setError("Please enter a valid price");
      return;
    }
    if (!category.trim()) {
      setError("Please select a category");
      return;
    }
    if (!images || images.length === 0) {
      setError("Please upload at least one image");
      return;
    }

    try {
      setLoading(true);

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

      router.push("/uploads");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "Electronics",
    "Tools",
    "Sports",
    "Furniture",
    "Bicycles",
    "Camping",
    "Gaming",
    "Audio",
    "Photography",
    "Other",
  ];

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link href="/uploads" className="text-sm text-gray-600 hover:text-gray-900 transition-colors mb-8 block">
          ← Back to Listings
        </Link>

        {/* Header */}
        <div className="space-y-2 mb-10">
          <h1 className="text-4xl font-bold text-gray-900">List a New Item</h1>
          <p className="text-lg text-gray-600">
            Fill in the details below to start earning money from your item
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Title Section */}
          <div className="space-y-3">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900">
              Item Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g., Professional Camera Canon EOS"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-900">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Describe your item, its condition, and what's included..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Price & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Price */}
            <div className="space-y-3">
              <label htmlFor="price" className="block text-sm font-semibold text-gray-900">
                Price Per Day (₹)
              </label>
              <input
                id="price"
                type="number"
                placeholder="e.g., 500"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-3">
              <label htmlFor="category" className="block text-sm font-semibold text-gray-900">
                Category
              </label>
              <select
                id="category"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">
              Photos
            </label>
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer block space-y-2">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <p className="text-gray-900 font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-600">PNG, JPG, GIF up to 10MB</p>
              </label>
            </div>

            {/* Image Preview */}
            {images && images.length > 0 && (
              <div className="space-y-3 mt-6">
                <p className="text-sm font-semibold text-gray-900">
                  {images.length} {images.length === 1 ? "image" : "images"} selected
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {Array.from(images).map((file, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${i}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-200 space-y-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 font-semibold rounded-lg transition-all transform active:scale-98 text-lg ${
                loading
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700"
              }`}
            >
              {loading ? "Creating Listing..." : "Create Listing"}
            </button>
            <p className="text-center text-sm text-gray-600">
              Your item will be live immediately after creation
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
