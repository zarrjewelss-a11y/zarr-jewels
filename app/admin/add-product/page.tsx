"use client";

import { useRef, useState } from "react";
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
  const [images, setImages] = useState<string[]>([]);
  const [description, setDescription] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const handleImageUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const files = Array.from(e.target.files || []);

  if (files.length === 0) return;

  const invalidFile = files.find(
    (file) => !file.type.startsWith("image/")
  );

  if (invalidFile) {
    alert("Please select image files only.");
    return;
  }

  try {
    setUploadingImage(true);

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", "zarr_jewels_products");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/grtgh7br/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.secure_url) {
        console.error("Cloudinary upload error:", data);
        throw new Error("Image upload failed.");
      }

      uploadedUrls.push(data.secure_url);
    }

    setImages((prev) => [...prev, ...uploadedUrls]);

    alert(
      `${uploadedUrls.length} image${
        uploadedUrls.length > 1 ? "s" : ""
      } uploaded successfully! 🎉`
    );
  } catch (error) {
    console.error("Image upload error:", error);
    alert("Failed to upload image. Please try again.");
  } finally {
    setUploadingImage(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
};
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

    if (images.length === 0) {
  alert("Please upload at least one product image.");
  return;
}
    try {
      setSaving(true);

      await addDoc(collection(db, "products"), {
        name: name.trim(),
        category,
        price: Number(price),
        stock: Number(stock),
        image: images[0],
images: images,
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

            {/* Product Image */}
<div>
  <label className="block font-semibold text-gray-700 mb-2">
    Product Image
  </label>

  <input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  multiple
  onChange={handleImageUpload}
  className="hidden"
/>

  <button
    type="button"
    onClick={() => fileInputRef.current?.click()}
    disabled={uploadingImage}
    className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#b08d57] text-[#b08d57] hover:bg-[#faf7f0] disabled:opacity-60 disabled:cursor-not-allowed font-semibold"
  >
    {uploadingImage ? "Uploading Image..." : "Upload Product Image"}
  </button>

  <p className="text-sm text-gray-400 mt-2">
    Select a product image from your phone or computer.
  </p>
</div>

{/* Image Preview */}
{images.length > 0 && (
  <div>
    <p className="font-semibold text-gray-700 mb-3">
      Product Images
    </p>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {images.map((url, index) => (
        <div
          key={url}
          className="relative border rounded-xl overflow-hidden bg-gray-50"
        >
          <img
            src={url}
            alt={`Product image ${index + 1}`}
            className="w-full h-40 object-cover"
          />

          {index === 0 && (
            <span className="absolute top-2 left-2 bg-[#b08d57] text-white text-xs px-2 py-1 rounded-lg">
              Main Image
            </span>
          )}

          <button
            type="button"
            onClick={() => {
              setImages((prev) =>
                prev.filter((_, i) => i !== index)
              );
            }}
            className="absolute top-2 right-2 bg-white text-red-500 text-xs px-2 py-1 rounded-lg shadow"
          >
            Remove
          </button>
        </div>
      ))}
    </div>

    <p className="text-sm text-green-600 mt-3">
      ✓ {images.length} image{images.length > 1 ? "s" : ""} uploaded
    </p>
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