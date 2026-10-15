"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft } from "lucide-react";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<any>({
    id: "",
    name: "",
    price: "",
    category: "",
    stock: "",
    image: "",
    description: "",
  });

  const loadProduct = async () => {
    try {
      const docRef = doc(db, "products", String(id));
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct({
          id: docSnap.id,
          ...docSnap.data(),
        });
      } else {
        alert("Product not found");
        router.push("/admin/products");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");

    if (!isLoggedIn) {
      router.replace("/admin/login");
      return;
    }

    loadProduct();
  }, [id, router]);
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  setProduct((prev: any) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};
const saveProduct = async () => {
  try {
    await updateDoc(doc(db, "products", String(id)), {
      name: product.name,
      price: Number(product.price),
      category: product.category,
      stock: Number(product.stock),
      image: product.image,
      description: product.description,
    });

    alert("Product updated successfully!");
    router.push("/admin/products");
  } catch (error) {
    console.error(error);
    alert("Failed to update product.");
  }
};
  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">

        <Link
          href="/admin/products"
          className="flex items-center gap-2 text-pink-600 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Products
        </Link>

        <h1 className="text-4xl font-bold text-pink-600 mb-8">
          Edit Product
        </h1>

        <div className="space-y-5">

          <input
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full border rounded-xl p-4"
          />

          <input
            name="price"
            value={product.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full border rounded-xl p-4"
          />

          <input
            name="category"
            value={product.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full border rounded-xl p-4"
          />

          <input
            name="stock"
            value={product.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="w-full border rounded-xl p-4"
          />

          <input
            name="image"
            value={product.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full border rounded-xl p-4"
          />

          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows={5}
            placeholder="Description"
            className="w-full border rounded-xl p-4"
          />

          <button
            onClick={saveProduct}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-xl font-semibold"
          >
            Save Changes
          </button>

        </div>

      </div>
    </div>
  );
}