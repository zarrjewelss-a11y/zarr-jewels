"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import {
  ArrowLeft,
  Search,
  Plus,
  Minus,
  FileSpreadsheet,
  FileText,
  Upload,
} from "lucide-react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const totalProducts = products.length;
  const [stockHistory, setStockHistory] = useState<any[]>([]);

const lowStockCount = products.filter(
  (p) => Number(p.stock) > 0 && Number(p.stock) <= 5
).length;

const outOfStockCount = products.filter(
  (p) => Number(p.stock) === 0
).length;

const totalInventoryValue = products.reduce(
  (sum, p) =>
    sum + Number(p.price || 0) * Number(p.stock || 0),
  0
);
  const [search, setSearch] = useState("");
const [categoryFilter, setCategoryFilter] = useState("All");
const [statusFilter, setStatusFilter] = useState("All");
const [sortBy, setSortBy] = useState("Default");
const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
const toggleSelectAll = () => {
  if (selectedProducts.length === filteredProducts.length) {
    setSelectedProducts([]);
  } else {
    setSelectedProducts(
      filteredProducts.map((item) => String(item.id))
    );
  }
};
 useEffect(() => {
  const loadProducts = async () => {
    try {
      const productsSnapshot = await getDocs(
        collection(db, "products")
      );

      const firebaseProducts = productsSnapshot.docs.map(
        (productDoc) => ({
          id: productDoc.id,
          ...productDoc.data(),
        })
      );

      setProducts(firebaseProducts);

      // Backup only
      localStorage.setItem(
        "adminProducts",
        JSON.stringify(firebaseProducts)
      );

      const historyQuery = query(
        collection(db, "stockHistory"),
        orderBy("createdAt", "desc")
      );

      const historySnapshot = await getDocs(historyQuery);

      const firebaseHistory = historySnapshot.docs.map(
        (historyDoc) => ({
          id: historyDoc.id,
          ...historyDoc.data(),
        })
      );

      setStockHistory(firebaseHistory);
    } catch (error) {
      console.error(
        "Failed to load inventory from Firebase:",
        error
      );
    }
  };

  loadProducts();
}, []);

const saveProducts = async (updated: any[]) => {
  setProducts(updated);

  // Local storage backup
  localStorage.setItem(
    "inventoryProducts",
    JSON.stringify(updated)
  );

  localStorage.setItem(
    "adminProducts",
    JSON.stringify(updated)
  );

  try {
    for (const product of updated) {
      if (!product.id) continue;

      await updateDoc(
        doc(db, "products", String(product.id)),
        {
          stock: Number(product.stock || 0),
        }
      );
    }

    console.log("✅ Inventory stock saved to Firebase");
  } catch (error) {
    console.error(
      "❌ Failed to save inventory to Firebase:",
      error
    );
  }
};
const addStockHistory = async (
  product: any,
  action: "Increase" | "Decrease",
  quantity: number
) => {
  try {
    const historyData = {
      productId: product.id,
      product: product.name,
      action,
      quantity,
      createdAt: serverTimestamp(),
    };

    const historyRef = await addDoc(
      collection(db, "stockHistory"),
      historyData
    );

    const newHistory = {
      id: historyRef.id,
      ...historyData,
      time: new Date().toLocaleString(),
    };

    setStockHistory((prev) => [
      newHistory,
      ...prev,
    ]);

    console.log(
      "✅ Stock history saved to Firebase"
    );
  } catch (error) {
    console.error(
      "❌ Failed to save stock history:",
      error
    );
  }
};

const increaseStock = async (id: string) => {
  const product = products.find(
    (p) => String(p.id) === String(id)
  );

  if (!product) return;

  const newStock = Number(product.stock || 0) + 1;

  try {
    await updateDoc(
      doc(db, "products", String(id)),
      {
        stock: newStock,
      }
    );

    const historyRef = await addDoc(
      collection(db, "stockHistory"),
      {
        product: product.name,
        productId: String(id),
        action: "Increase",
        quantity: 1,
        createdAt: serverTimestamp(),
      }
    );

    const updatedProducts = products.map((item) =>
      String(item.id) === String(id)
        ? {
            ...item,
            stock: newStock,
          }
        : item
    );

    setProducts(updatedProducts);

    setStockHistory((prev) => [
      {
        id: historyRef.id,
        product: product.name,
        productId: String(id),
        action: "Increase",
        quantity: 1,
        createdAt: new Date(),
      },
      ...prev,
    ]);
  } catch (error) {
    console.error("Increase stock failed:", error);
  }
};

const decreaseStock = async (id: string) => {
  const product = products.find(
    (p) => String(p.id) === String(id)
  );

  if (!product) return;

  const currentStock = Number(product.stock || 0);

  if (currentStock <= 0) {
    return;
  }

  const newStock = currentStock - 1;

  try {
    await updateDoc(
      doc(db, "products", String(id)),
      {
        stock: newStock,
      }
    );

    const historyRef = await addDoc(
      collection(db, "stockHistory"),
      {
        product: product.name,
        productId: String(id),
        action: "Decrease",
        quantity: 1,
        createdAt: serverTimestamp(),
      }
    );

    const updatedProducts = products.map((item) =>
      String(item.id) === String(id)
        ? {
            ...item,
            stock: newStock,
          }
        : item
    );

    setProducts(updatedProducts);

    setStockHistory((prev) => [
      {
        id: historyRef.id,
        product: product.name,
        productId: String(id),
        action: "Decrease",
        quantity: 1,
        createdAt: new Date(),
      },
      ...prev,
    ]);
  } catch (error) {
    console.error("Decrease stock failed:", error);
  }
};
const toggleSelection = (id: string) => {
  setSelectedProducts((prev) =>
    prev.includes(id)
      ? prev.filter((item) => item !== id)
      : [...prev, id]
  );
};

const bulkIncreaseStock = async () => {
  if (selectedProducts.length === 0) return;

  try {
    const updatedProducts = [...products];

    for (const id of selectedProducts) {
      const productIndex = updatedProducts.findIndex(
        (p) => String(p.id) === String(id)
      );

      if (productIndex === -1) continue;

      const product = updatedProducts[productIndex];
      const newStock = Number(product.stock || 0) + 1;

      // Update Firebase product
      await updateDoc(
        doc(db, "products", String(id)),
        {
          stock: newStock,
        }
      );

      // Save history
      const historyRef = await addDoc(
        collection(db, "stockHistory"),
        {
          product: product.name,
          productId: String(id),
          action: "Increase",
          quantity: 1,
          createdAt: serverTimestamp(),
        }
      );

      // Update local UI
      updatedProducts[productIndex] = {
        ...product,
        stock: newStock,
      };

      setStockHistory((prev) => [
        {
          id: historyRef.id,
          product: product.name,
          productId: String(id),
          action: "Increase",
          quantity: 1,
          createdAt: new Date(),
        },
        ...prev,
      ]);
    }

    setProducts(updatedProducts);

    localStorage.setItem(
      "adminProducts",
      JSON.stringify(updatedProducts)
    );

    setSelectedProducts([]);

    console.log("✅ Bulk increase completed");
  } catch (error) {
    console.error("❌ Bulk increase failed:", error);
  }
};

const bulkDecreaseStock = async () => {
  if (selectedProducts.length === 0) return;

  try {
    const updatedProducts = [...products];

    for (const id of selectedProducts) {
      const productIndex = updatedProducts.findIndex(
        (p) => String(p.id) === String(id)
      );

      if (productIndex === -1) continue;

      const product = updatedProducts[productIndex];
      const currentStock = Number(product.stock || 0);

      // Don't decrease below 0
      if (currentStock <= 0) continue;

      const newStock = currentStock - 1;

      // Update Firebase product
      await updateDoc(
        doc(db, "products", String(id)),
        {
          stock: newStock,
        }
      );

      // Save history
      const historyRef = await addDoc(
        collection(db, "stockHistory"),
        {
          product: product.name,
          productId: String(id),
          action: "Decrease",
          quantity: 1,
          createdAt: serverTimestamp(),
        }
      );

      // Update local UI
      updatedProducts[productIndex] = {
        ...product,
        stock: newStock,
      };

      setStockHistory((prev) => [
        {
          id: historyRef.id,
          product: product.name,
          productId: String(id),
          action: "Decrease",
          quantity: 1,
          createdAt: new Date(),
        },
        ...prev,
      ]);
    }

    setProducts(updatedProducts);

    localStorage.setItem(
      "adminProducts",
      JSON.stringify(updatedProducts)
    );

    setSelectedProducts([]);

    console.log("✅ Bulk decrease completed");
  } catch (error) {
    console.error("❌ Bulk decrease failed:", error);
  }
};
const deleteSelectedProducts = async () => {
  if (selectedProducts.length === 0) return;

  const confirmDelete = window.confirm(
    `Are you sure you want to delete ${selectedProducts.length} selected product(s)?`
  );

  if (!confirmDelete) return;

  try {
    // Delete products
    for (const id of selectedProducts) {
      await deleteDoc(
        doc(db, "products", String(id))
      );
    }

    // Find related stock history
    const historySnapshot = await getDocs(
      collection(db, "stockHistory")
    );

    const relatedHistory =
      historySnapshot.docs.filter((historyDoc) => {
        const data = historyDoc.data();

        return selectedProducts.includes(
          String(data.productId)
        );
      });

    // Delete related history
    for (const historyDoc of relatedHistory) {
      await deleteDoc(
        doc(
          db,
          "stockHistory",
          historyDoc.id
        )
      );
    }

    // Update products UI
    const updatedProducts = products.filter(
      (item) =>
        !selectedProducts.includes(
          String(item.id)
        )
    );

    // Update history UI
    const updatedHistory =
      stockHistory.filter(
        (item) =>
          !selectedProducts.includes(
            String(item.productId)
          )
      );

    setProducts(updatedProducts);
    setStockHistory(updatedHistory);
    setSelectedProducts([]);

    localStorage.setItem(
      "adminProducts",
      JSON.stringify(updatedProducts)
    );

    localStorage.setItem(
      "inventoryProducts",
      JSON.stringify(updatedProducts)
    );

    console.log(
      "✅ Products and related history deleted"
    );

  } catch (error) {
    console.error(
      "❌ Delete products failed:",
      error
    );

    alert(
      "❌ Failed to delete selected products."
    );
  }
};
const categories = [
  "All",
  ...new Set(products.map((item) => item.category)),
];
const filteredProducts = products
  .filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" ||
      item.category === categoryFilter;

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "In Stock" && item.stock > 5) ||
      (statusFilter === "Low Stock" &&
        item.stock > 0 &&
        item.stock <= 5) ||
      (statusFilter === "Out of Stock" &&
        item.stock === 0);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus
    );
  })
  .sort((a, b) => {
    switch (sortBy) {
      case "Price Low":
        return Number(a.price) - Number(b.price);

      case "Price High":
        return Number(b.price) - Number(a.price);

      case "Stock Low":
        return Number(a.stock) - Number(b.stock);

      case "Stock High":
        return Number(b.stock) - Number(a.stock);

      default:
        return 0;
    }
  });
const lowStockProducts = products.filter(
  (item) => Number(item.stock) > 0 && Number(item.stock) <= 5
);
  const inStock = products.filter((p) => p.stock > 5).length;
  const lowStock = products.filter(
    (p) => p.stock > 0 && p.stock <= 5
  ).length;
  const outOfStock = products.filter(
    (p) => p.stock === 0
  ).length;
  const totalStock = products.reduce(
  (sum, item) => sum + Number(item.stock),
  0
);

const inventoryValue = products.reduce(
  (sum, item) =>
    sum + Number(item.stock) * Number(item.price),
  0
);
const stockChartData = [
  { name: "In Stock", value: inStock },
  { name: "Low Stock", value: lowStock },
  { name: "Out of Stock", value: outOfStock },
];

const COLORS = ["#22c55e", "#facc15", "#ef4444"];
const exportExcel = () => {
  const data = filteredProducts.map((item) => ({
    ID: item.id,
    Product: item.name,
    Category: item.category,
    Price: item.price,
    Stock: item.stock,
    Status:
      item.stock === 0
        ? "Out of Stock"
        : item.stock <= 5
        ? "Low Stock"
        : "In Stock",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Inventory"
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(
    new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    "Inventory_Report.xlsx"
  );
};

const exportPDF = () => {
  const doc = new jsPDF();

  // Header
  doc.setFillColor(219, 39, 119);
  doc.rect(0, 0, 210, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("NEXA Jewelry", 14, 15);

  doc.setFontSize(11);
  doc.text("Inventory Report", 14, 23);

  // Reset color
  doc.setTextColor(0, 0, 0);

  const reportDate = new Date().toLocaleString();

  doc.setFontSize(10);
  doc.text(`Generated: ${reportDate}`, 14, 38);

  // Summary
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Inventory Summary", 14, 50);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  doc.text(`Total Products : ${totalProducts}`, 14, 60);
  doc.text(`Total Stock : ${totalStock}`, 14, 68);
  doc.text(`Low Stock : ${lowStockCount}`, 14, 76);
  doc.text(`Out of Stock : ${outOfStockCount}`, 14, 84);
  doc.text(`Inventory Value : Rs. ${totalInventoryValue}`, 14, 92);

  autoTable(doc, {
    startY: 102,

    head: [
      [
        "ID",
        "Product",
        "Category",
        "Price",
        "Stock",
        "Status",
      ],
    ],

    body: filteredProducts.map((item) => [
      item.id,
      item.name,
      item.category,
      `Rs. ${item.price}`,
      item.stock,
      item.stock === 0
        ? "Out of Stock"
        : item.stock <= 5
        ? "Low Stock"
        : "In Stock",
    ]),

    headStyles: {
      fillColor: [219, 39, 119],
    },

    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
  });

  const pageHeight = doc.internal.pageSize.height;

  doc.setFontSize(10);
  doc.setTextColor(120);

  doc.text(
    "Generated by NEXA Jewelry Admin Panel",
    14,
    pageHeight - 10
  );

  doc.save("NEXA_Inventory_Report.pdf");
};
const importExcel = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = async (e) => {
    try {
      const data = new Uint8Array(
        e.target?.result as ArrayBuffer
      );

      const workbook = XLSX.read(data, {
        type: "array",
      });

      const sheet =
        workbook.Sheets[workbook.SheetNames[0]];

      const excelData: any[] =
        XLSX.utils.sheet_to_json(sheet);

      const updatedProducts = [...products];

      for (const product of updatedProducts) {
        const found = excelData.find(
          (row) =>
            String(row.ID) === String(product.id)
        );

        if (!found || found.Stock === undefined) {
          continue;
        }

        const oldStock = Number(product.stock || 0);
        const newStock = Number(found.Stock);

        if (oldStock === newStock) {
          continue;
        }

        // Update Firebase
        await updateDoc(
          doc(db, "products", String(product.id)),
          {
            stock: newStock,
          }
        );

        // Determine action
        const action =
          newStock > oldStock
            ? "Increase"
            : "Decrease";

        const quantity = Math.abs(
          newStock - oldStock
        );

        // Save history
        const historyRef = await addDoc(
          collection(db, "stockHistory"),
          {
            product: product.name,
            productId: String(product.id),
            action,
            quantity,
            createdAt: serverTimestamp(),
          }
        );

        // Update local product
        product.stock = newStock;

        // Update history UI
        setStockHistory((prev) => [
          {
            id: historyRef.id,
            product: product.name,
            productId: String(product.id),
            action,
            quantity,
            createdAt: new Date(),
          },
          ...prev,
        ]);
      }

      setProducts(updatedProducts);

      localStorage.setItem(
        "adminProducts",
        JSON.stringify(updatedProducts)
      );

      localStorage.setItem(
        "inventoryProducts",
        JSON.stringify(updatedProducts)
      );

      alert("✅ Inventory imported successfully!");

    } catch (error) {
      console.error(
        "❌ Excel import failed:",
        error
      );

      alert(
        "❌ Failed to import inventory."
      );
    }

    // Reset input so same file can be selected again
    event.target.value = "";
  };

  reader.readAsArrayBuffer(file);
};
  return (
    <div className="min-h-screen bg-pink-50">
      <div className="max-w-7xl mx-auto p-6">

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-pink-600 mb-6"
        >
          <ArrowLeft size={18} />
          Back Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">

  <h1 className="text-4xl font-bold text-pink-600">
    Inventory Management
  </h1>

  <div className="flex gap-3">

    <button
      onClick={exportExcel}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold transition"
    >
      <FileSpreadsheet size={18} />
      Export Excel
    </button>

    <button
      onClick={exportPDF}
      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-semibold transition"
    >
      <FileText size={18} />
      Export PDF
    </button>
    <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold cursor-pointer transition">

  <Upload size={18} />

  Import Excel

  <input
    type="file"
    accept=".xlsx,.xls"
    className="hidden"
    onChange={importExcel}
  />

</label>

  </div>

</div>
<div className="grid md:grid-cols-4 gap-5 mb-8">

  <div className="bg-white rounded-2xl shadow p-5">
    <p className="text-gray-500">Total Products</p>
    <h2 className="text-3xl font-bold text-pink-600">
      {totalProducts}
    </h2>
  </div>

  <div className="bg-white rounded-2xl shadow p-5">
    <p className="text-gray-500">Low Stock</p>
    <h2 className="text-3xl font-bold text-yellow-600">
      {lowStockCount}
    </h2>
  </div>

  <div className="bg-white rounded-2xl shadow p-5">
    <p className="text-gray-500">Out of Stock</p>
    <h2 className="text-3xl font-bold text-red-600">
      {outOfStockCount}
    </h2>
  </div>

  <div className="bg-white rounded-2xl shadow p-5">
    <p className="text-gray-500">Inventory Value</p>
    <h2 className="text-3xl font-bold text-green-600">
      Rs. {totalInventoryValue}
    </h2>
  </div>
  </div>
<div className="bg-white rounded-2xl shadow p-6 mb-8">
  <h2 className="text-2xl font-bold mb-6">
    Inventory Status Overview
  </h2>

  <div className="h-80">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={stockChartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ name, percent }) =>
            `${name} ${(percent! * 100).toFixed(0)}%`
          }
        >
          {stockChartData.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
 </div>
</div>

        <div className="bg-white rounded-2xl shadow p-5 mb-6">

          <div className="flex items-center border rounded-xl px-4">

            <Search
              size={18}
              className="text-gray-400"
            />

            <input
              className="w-full p-3 outline-none"
              placeholder="Search product..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">

  <select
    value={categoryFilter}
    onChange={(e) =>
      setCategoryFilter(e.target.value)
    }
    className="border rounded-xl p-3"
  >
    {categories.map((cat) => (
      <option key={cat} value={cat}>
        {cat}
      </option>
    ))}
  </select>

  <select
    value={statusFilter}
    onChange={(e) =>
      setStatusFilter(e.target.value)
    }
    className="border rounded-xl p-3"
  >
    <option>All</option>
    <option>In Stock</option>
    <option>Low Stock</option>
    <option>Out of Stock</option>
  </select>
<select
  value={sortBy}
  onChange={(e) =>
    setSortBy(e.target.value)
  }
  className="border rounded-xl p-3"
>
  <option>Default</option>
  <option>Price Low</option>
  <option>Price High</option>
  <option>Stock Low</option>
  <option>Stock High</option>
</select>
</div>
{lowStockProducts.length > 0 && (
  <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-5 mb-6">

    <h2 className="text-xl font-bold text-yellow-700 mb-4">
      ⚠️ Low Stock Alert
    </h2>

    <div className="space-y-3">

      {lowStockProducts.map((item) => (

        <div
          key={item.id}
          className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm"
        >
          <div>
            <p className="font-semibold">
              {item.name}
            </p>

            <p className="text-sm text-gray-500">
              {item.category}
            </p>
          </div>

          <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold">
            {item.stock} Left
          </span>
        </div>

      ))}

    </div>

  </div>
)}
<div className="flex gap-3 mb-6">

  <button
    onClick={bulkIncreaseStock}
    disabled={selectedProducts.length === 0}
    className="bg-green-600 text-white px-5 py-3 rounded-xl disabled:opacity-50"
  >
    + Increase Selected
  </button>

  <button
    onClick={bulkDecreaseStock}
    disabled={selectedProducts.length === 0}
    className="bg-red-600 text-white px-5 py-3 rounded-xl disabled:opacity-50"
  >
    - Decrease Selected
  </button>
<button
  onClick={deleteSelectedProducts}
  disabled={selectedProducts.length === 0}
  className="bg-red-700 hover:bg-red-800 text-white px-5 py-3 rounded-xl disabled:opacity-50"
>
  🗑 Delete Selected
</button>
</div>
        <div className="bg-white rounded-2xl shadow overflow-hidden">

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
    onChange={toggleSelectAll}
  />
</th>
    <th className="text-left p-4">Image</th>
    <th className="text-left p-4">Product</th>
    <th className="text-left p-4">Category</th>
    <th className="text-left p-4">Price</th>
    <th className="text-center p-4">Stock</th>
    <th className="text-center p-4">Update</th>
  </tr>
</thead>

            <tbody>

              {filteredProducts.map((item) => (

                <tr
                  key={item.id}
                  className="border-b"
                >
                  <td className="text-center">
  <input
    type="checkbox"
    checked={selectedProducts.includes(item.id)}
    onChange={() => toggleSelection(item.id)}
  />
</td>
                  <td className="p-4">
  <img
    src={item.image}
    alt={item.name}
    className="w-16 h-16 rounded-xl object-cover"
  />
</td>
                  <td className="p-4 font-semibold">
                    {item.name}
                  </td>

                  <td className="p-4">
                    {item.category}
                  </td>
<td className="p-4 font-bold text-pink-600">
  Rs. {item.price}
</td>
                  <td className="text-center p-4">

  <div className="flex flex-col items-center gap-2">

    <span
      className={`font-bold ${
        item.stock === 0
          ? "text-red-600"
          : item.stock <= 5
          ? "text-yellow-600"
          : "text-green-600"
      }`}
    >
      {item.stock}
    </span>

    <span
      className={`text-xs px-3 py-1 rounded-full font-semibold ${
        item.stock === 0
          ? "bg-red-100 text-red-600"
          : item.stock <= 5
          ? "bg-yellow-100 text-yellow-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      {item.stock === 0
        ? "Out of Stock"
        : item.stock <= 5
        ? "Low Stock"
        : "In Stock"}
    </span>

  </div>

</td>

                  <td className="p-4">

                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() =>
                          decreaseStock(item.id)
                        }
                        className="bg-red-500 text-white p-2 rounded-lg"
                      >
                        <Minus size={16} />
                      </button>

                      <button
                        onClick={() =>
                          increaseStock(item.id)
                        }
                        className="bg-green-500 text-white p-2 rounded-lg"
                      >
                        <Plus size={16} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>
<div className="bg-white rounded-2xl shadow p-6 mt-8">
  <h2 className="text-2xl font-bold mb-6">
    Recent Stock Activity
  </h2>

  {stockHistory.length > 0 ? (
    <div className="space-y-3">
      {stockHistory.slice(0, 10).map((item: any) => (
        <div
          key={item.id}
          className="flex justify-between items-center border-b pb-3"
        >
          <div>
            <p className="font-semibold">
              {item.product}
            </p>

            <p className="text-sm text-gray-500">
              {item.createdAt?.seconds
  ? new Date(
      item.createdAt.seconds * 1000
    ).toLocaleString()
  : item.time || "Just now"}
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm font-bold ${
              item.action === "Increase"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {item.action} ({item.quantity})
          </span>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">
      No stock activity yet.
    </p>
  )}
</div>
        </div>

{/* Stock History */}

<div className="bg-white rounded-2xl shadow p-6 mt-8">
  <h2 className="text-2xl font-bold mb-5">
    Stock History
  </h2>

  {stockHistory.length > 0 ? (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Product</th>
            <th className="p-3 text-left">Action</th>
            <th className="p-3 text-left">Qty</th>
            <th className="p-3 text-left">Time</th>
          </tr>
        </thead>

        <tbody>
          {stockHistory.map((item) => (
            <tr
              key={item.id}
              className="border-b"
            >
              <td className="p-3">{item.product}</td>

              <td
                className={`p-3 font-bold ${
                  item.action === "Increase"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {item.action}
              </td>

              <td className="p-3">
                {item.quantity}
              </td>

              <td className="p-3 text-gray-500">
                {item.createdAt?.toDate
  ? item.createdAt.toDate().toLocaleString()
  : "Just now"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p className="text-gray-500">
      No stock history available.
    </p>
  )}
</div>
    </div>
  </div>
);
}