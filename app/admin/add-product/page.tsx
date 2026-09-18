"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ArrowLeft, Save } from "lucide-react";

import { db } from "@/lib/firebase";

export default function AddProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Necklace");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (!category) {
      alert("Please select a category.");
      return;
    }

    if (!price || Number(price) <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    if (stock === "" || Number(stock) < 0) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    if (!image.trim()) {
      alert("Please enter product image URL.");
      return;
    }

    try {
      setSaving(true);

      await addDoc(collection(db, "products"), {
        name: name.trim(),
        category,
        price: Number(price),
        stock: Number(stock),
        image: image.trim(),
        description: description.trim(),
        createdAt: serverTimestamp(),
      });

      alert("Product added successfully! 🎉");

      router.push("/admin/products");
    } catch (error) {
      console.error("Error adding product:", error);

      alert(
        "Failed to add product. Please check Firebase permissions and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f0]">
      <div className="max-w-4xl mx-auto p-6">

        {/* Back Button */}
        <button
          onClick={() => router.push("/admin/products")}
          className="inline-flex items-center gap-2 text-[#b08d57] hover:text-[#8f713f] mb-6 font-medium"
        >
          <ArrowLeft size={18} />
          Back to Products
        </button>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#b08d57]">
            Add Product
          </h1>

          <p className="text-gray-500 mt-2">
            Add a new product to your ZARR JEWELS store.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Product Name */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Product Name
              </label>

              <input
                type="text"
                placeholder="e.g. Luxury Necklace"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#b08d57]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#b08d57] bg-white"
              >
                <option value="Necklace">Necklace</option>
                <option value="Earrings">Earrings</option>
                <option value="Ring">Ring</option>
                <option value="Jhumkay">Jhumkay</option>
                <option value="Bracelet">Bracelet</option>
                <option value="Bangles">Bangles</option>
                <option value="Pendant">Pendant</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Price + Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Price */}
              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Price (PKR)
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="3299"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#b08d57]"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Stock Quantity
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="12"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#b08d57]"
                />
              </div>

            </div>

            {/* Image URL */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Product Image URL
              </label>

              <input
                type="url"
                placeholder="https://example.com/product-image.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#b08d57]"
              />

              <p className="text-sm text-gray-400 mt-2">
                Enter a direct image URL.
              </p>
            </div>

            {/* Image Preview */}
            {image.trim() && (
              <div>
                <p className="font-semibold text-gray-700 mb-2">
                  Image Preview
                </p>

                <div className="w-40 h-40 border rounded-xl overflow-hidden bg-gray-50">
                  <img
                    src={image}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Description
              </label>

              <textarea
                rows={5}
                placeholder="Write a short description about this product..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#b08d57] resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">

              <button
                type="button"
                onClick={() => router.push("/admin/products")}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-[#b08d57] hover:bg-[#967643] disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold"
              >
                <Save size={18} />

                {saving ? "Saving Product..." : "Save Product"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}