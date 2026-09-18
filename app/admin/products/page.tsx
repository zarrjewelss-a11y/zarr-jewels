"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  writeBatch,
} from "firebase/firestore";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FileSpreadsheet } from "lucide-react";
import { useRouter } from "next/navigation";

import { db } from "@/lib/firebase";
import {
  Search,
  Pencil,
  Trash2,
  ArrowLeft,
  CheckSquare,
} from "lucide-react";

export default function AdminProductsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

const [products, setProducts] = useState<any[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const isLoggedIn = localStorage.getItem("adminLoggedIn");

  if (!isLoggedIn) {
    router.replace("/admin/login");
    return;
  }

  const unsubscribe = onSnapshot(
    collection(db, "products"),
    (snapshot) => {
      const list = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      setProducts(list);
      setLoading(false);
    },
    (error) => {
      console.error(error);
      setLoading(false);
    }
  );

  return () => unsubscribe();
}, [router]);

const filteredProducts = products.filter((product) =>
  product.name.toLowerCase().includes(search.toLowerCase())
);

const deleteProduct = async (id: string) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to permanently delete this product?"
  );

  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, "products", id));

  

    alert("Product deleted successfully!");
  } catch (error) {
    console.error(error);
    alert("Failed to delete product.");
  }
};
const toggleSelect = (id: string) => {
  if (selectedProducts.includes(id)) {
    setSelectedProducts(selectedProducts.filter((item) => item !== id));
  } else {
    setSelectedProducts([...selectedProducts, id]);
  }
};

const deleteSelected = async () => {
  if (selectedProducts.length === 0) {
    alert("Please select at least one product.");
    return;
  }

  const confirmDelete = window.confirm(
    `Delete ${selectedProducts.length} selected product(s)?`
  );

  if (!confirmDelete) return;

  try {
    const batch = writeBatch(db);

    selectedProducts.forEach((id) => {
      batch.delete(doc(db, "products", id));
    });

    await batch.commit();

    setSelectedProducts([]);
  

    alert("Selected products deleted successfully!");
  } catch (error) {
    console.error(error);
    alert("Failed to delete selected products.");
  }
};
const exportExcel = () => {
  const data =
    selectedProducts.length > 0
      ? products.filter((p) => selectedProducts.includes(p.id))
      : products;

  if (data.length === 0) {
    alert("No products available to export.");
    return;
  }

  const exportData = data.map((product) => ({
    ID: product.id,
    Name: product.name,
    Category: product.category,
    Price: product.price,
    Stock: product.stock,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Products"
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, "Products.xlsx");
};
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-lg font-semibold text-pink-600">
          Loading Products...
        </p>
      </div>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-pink-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-3"
            >
              <ArrowLeft size={18} />
              Back Dashboard
            </Link>

            <h1 className="text-4xl font-bold text-pink-600">
              Products
            </h1>
          </div>
<button
  onClick={exportExcel}
  className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold"
>
  Export Excel
</button>
          <Link
            href="/admin/add-product"
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl"
          >
            + Add Product
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow p-5 mb-6">
          <div className="flex items-center border rounded-xl px-4">
            <Search className="text-gray-400" size={18} />

            <input
              type="text"
              placeholder="Search products..."
              className="w-full p-3 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
<div className="flex justify-end mb-4">
  <button
    onClick={deleteSelected}
    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl"
  >
    <Trash2 size={18} />
    Delete Selected ({selectedProducts.length})
  </button>
</div>
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">

              <thead className="bg-pink-600 text-white">
                <tr>
<th className="text-center p-4">
  <input
    type="checkbox"
    checked={
      filteredProducts.length > 0 &&
      selectedProducts.length === filteredProducts.length
    }
    onChange={(e) => {
      if (e.target.checked) {
        setSelectedProducts(filteredProducts.map((p) => p.id));
      } else {
        setSelectedProducts([]);
      }
    }}
    className="w-5 h-5 accent-pink-600 cursor-pointer"
  />
</th>
                  <th className="text-left p-4">Image</th>
                  <th className="text-left p-4">Product</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Stock</th>
                  <th className="text-center p-4">Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b hover:bg-pink-50"
                  >
                    <td className="text-center">
  <input
    type="checkbox"
    checked={selectedProducts.includes(product.id)}
    onChange={() => toggleSelect(product.id)}
    className="w-5 h-5 accent-pink-600 cursor-pointer"
  />
</td>
                    <td className="p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                    </td>

                    <td className="p-4 font-semibold">
                      {product.name}
                    </td>

                    <td className="p-4">
                      {product.category}
                    </td>

                    <td className="p-4 text-pink-600 font-bold">
                      Rs. {product.price}
                    </td>

                    <td className="p-4">
                      {product.stock}
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-3">
 <Link
  href={`/admin/edit-product/${product.id}`}
  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
>
  <Pencil size={18} />
</Link>

                        <button
  onClick={() => deleteProduct(product.id)}
  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
}