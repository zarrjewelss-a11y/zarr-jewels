"use client";

import toast from "react-hot-toast";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heart, Star, SlidersHorizontal } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { useCart } from "@/components/context/CartContext";
import { useWishlist } from "@/components/context/WishlistContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

function ShopPageContent() {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const searchParams = useSearchParams();
  const search = searchParams.get("search")?.toLowerCase() || "";

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 6;

  /* =========================
     LOAD PRODUCTS
  ========================= */

  useEffect(() => {
  setLoading(true);

  const unsubscribe = onSnapshot(
    collection(db, "products"),
    (snapshot) => {
      const firestoreProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(firestoreProducts);
      setLoading(false);
    },
    (error) => {
      console.error("Firestore error:", error);
      setProducts([]);
      setLoading(false);
    }
  );

  return () => unsubscribe();
}, []);

  /* =========================
     RESET PAGE
  ========================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, sortBy]);

  /* =========================
     FILTER + SORT
  ========================= */

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const productName = product.name?.toLowerCase() || "";
        const productCategory = product.category?.toLowerCase() || "";

        const matchesSearch =
          productName.includes(search) ||
          productCategory.includes(search);

        const matchesCategory =
          selectedCategory === "All" ||
          product.category === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "low") {
          return Number(a.price) - Number(b.price);
        }

        if (sortBy === "high") {
          return Number(b.price) - Number(a.price);
        }

        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }

        return 0;
      });
  }, [products, search, selectedCategory, sortBy]);

  /* =========================
     PAGINATION
  ========================= */

  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const categories = useMemo(() => {
  const uniqueCategories = Array.from(
    new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    )
  );

  return ["All", ...uniqueCategories];
}, [products]);

  /* =========================
     Add to Bag
  ========================= */

  const handleAddToCart = (product: any) => {
  if (Number(product.stock) <= 0) {
    toast.error("This product is currently out of stock.");
    return;
  }

  addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
  });

  toast.success(`${product.name} added to bag 🛍️`);
};

  /* =========================
     WISHLIST
  ========================= */

  const handleWishlist = (product: any) => {
    const alreadyInWishlist = wishlist.some(
      (item) => item.id === product.id
    );

    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    toast.success(
      alreadyInWishlist
        ? "Removed from Wishlist 💔"
        : "Added to Wishlist ❤️"
    );
  };
  

  return (
    <>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#f8f6ee] py-24 md:py-28">
        {/* Decorative Glow */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#e9e6d7] opacity-70 blur-3xl" />

        <div className="absolute -bottom-24 -right-20 w-80 h-80 rounded-full bg-[#d8c7a0] opacity-20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <span className="uppercase tracking-[0.35em] text-[#b49358] text-sm font-semibold">
            ZARR JEWELS
          </span>

          <h1 className="mt-7 text-5xl md:text-7xl font-serif font-bold text-[#20352c] leading-tight">
            Luxury Jewelry
          </h1>

          <h2 className="text-5xl md:text-7xl font-serif italic text-[#b49358] leading-tight">
            Collection
          </h2>

          <p className="max-w-2xl mx-auto mt-8 text-lg md:text-xl text-[#30465d] leading-8">
            Discover timeless pieces designed to add elegance,
            confidence and beauty to every special moment.
          </p>
        </div>
      </section>

      {/* =====================================================
          SHOP SECTION
      ===================================================== */}

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">

          {/* FILTER BAR */}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            {/* CATEGORIES */}

            <div className="flex flex-wrap items-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full border transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-[#bd9958] text-white border-[#bd9958] shadow-lg"
                      : "bg-white text-[#20352c] border-[#e2dccd] hover:border-[#bd9958] hover:text-[#bd9958]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* SORT */}

            <div className="flex items-center gap-3">
              <SlidersHorizontal
                size={20}
                className="text-[#bd9958]"
              />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-[#e2dccd] rounded-full px-6 py-3 bg-white outline-none text-[#20352c] min-w-[190px] cursor-pointer"
              >
                <option value="default">Sort By</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>
          </div>

          {/* PRODUCT COUNT */}

          <div className="mt-10 mb-6">
            <p className="text-[#64748b]">
              Showing{" "}
              <span className="font-semibold text-[#20352c]">
                {filteredProducts.length}
              </span>{" "}
              {filteredProducts.length === 1
                ? "product"
                : "products"}
            </p>
          </div>

{/* =====================================================
    PRODUCTS GRID
===================================================== */}

{loading ? (
  <div className="py-24 flex flex-col items-center justify-center">
    <div className="w-12 h-12 border-4 border-[#e8dfcf] border-t-[#bd9958] rounded-full animate-spin" />

    <p className="mt-5 text-[#20352c] font-medium">
      Loading our collection...
    </p>
  </div>
) : currentProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">

              {currentProducts.map((product) => {
                const isWishlisted = wishlist.some(
                  (item) => item.id === product.id
                );

                const discount =
                  product.oldPrice && product.price
                    ? Math.round(
                        ((product.oldPrice - product.price) /
                          product.oldPrice) *
                          100
                      )
                    : 0;

                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-[28px] overflow-hidden border border-[#eee9dc] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                  >

                    {/* IMAGE */}

                    <div className="relative overflow-hidden bg-[#f5f3ed]">

                      <Link href={`/product/${product.id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-[390px] object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </Link>

                      {/* DISCOUNT */}

                      {discount > 0 && (
                        <span className="absolute top-5 left-5 bg-[#20352c] text-white px-4 py-2 rounded-full text-xs font-bold">
                          {discount}% OFF
                        </span>
                      )}

                      {/* WISHLIST */}

                      <button
                        onClick={() => handleWishlist(product)}
                        className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-md hover:scale-110 transition"
                        aria-label="Wishlist"
                      >
                        <Heart
                          size={21}
                          className={
                            isWishlisted
                              ? "fill-[#c79b58] text-[#c79b58]"
                              : "text-[#20352c]"
                          }
                        />
                      </button>
                    </div>

                    {/* PRODUCT INFO */}

                    <div className="p-6">

                      <div className="flex items-center justify-between gap-3">

                        <span className="text-xs uppercase tracking-wider bg-[#f3eee2] text-[#a17e42] px-3 py-2 rounded-full font-semibold">
                          {product.category}
                        </span>

                        {Number(product.stock) <= 0 && (
  <span className="text-xs text-red-500 font-semibold">
    Out of Stock
  </span>
)}
                      </div>

                      {/* NAME */}

                      <Link href={`/product/${product.id}`}>
                        <h2 className="text-2xl font-serif font-bold text-[#20352c] mt-5 hover:text-[#b49358] transition">
                          {product.name}
                        </h2>
                      </Link>

                      {/* RATING */}

                      <div className="flex items-center gap-1 mt-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={17}
                            className={
                              star <= (product.rating || 0)
                                ? "fill-[#d4aa61] text-[#d4aa61]"
                                : "text-gray-300"
                            }
                          />
                        ))}

                        <span className="text-sm text-gray-500 ml-2">
                          {product.rating || 0}.0
                        </span>
                      </div>

                      {/* PRICE */}

                      <div className="flex items-center gap-3 mt-5">
                        <span className="text-2xl font-bold text-[#b49358]">
                          Rs. {product.price}
                        </span>

                        {product.oldPrice && (
                          <span className="text-gray-400 line-through">
                            Rs. {product.oldPrice}
                          </span>
                        )}
                      </div>

                      {/* Add to Bag */}

                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={Number(product.stock) <= 0}
                        className={`w-full mt-6 py-3.5 rounded-full font-semibold transition-all ${
  Number(product.stock) <= 0
    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
    : "bg-[#20352c] hover:bg-[#b49358] text-white"
}`}
                      >
                        {Number(product.stock) <= 0
  ? "Out of Stock"
  : "Add to Bag"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* =====================================================
                NO PRODUCTS
            ===================================================== */

            <div className="text-center py-20">
              <h2 className="text-3xl font-serif font-bold text-[#20352c]">
                No Products Found
              </h2>

              <p className="text-gray-500 mt-3">
                Try another search or category.
              </p>

              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSortBy("default");
                }}
                className="mt-6 bg-[#20352c] text-white px-7 py-3 rounded-full hover:bg-[#b49358] transition"
              >
                View All Products
              </button>
            </div>
          )}

          {/* =====================================================
              PAGINATION
          ===================================================== */}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-14">

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.max(prev - 1, 1)
                  )
                }
                disabled={currentPage === 1}
                className="px-5 py-3 rounded-full border border-[#e2dccd] disabled:opacity-40 hover:bg-[#f7f3e9] transition"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-11 h-11 rounded-full font-semibold transition ${
                      currentPage === page
                        ? "bg-[#bd9958] text-white shadow-md"
                        : "border border-[#e2dccd] hover:bg-[#f7f3e9]"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, totalPages)
                  )
                }
                disabled={currentPage === totalPages}
                className="px-5 py-3 rounded-full border border-[#e2dccd] disabled:opacity-40 hover:bg-[#f7f3e9] transition"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />
    </>
  );
}
export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#e8dfcf] border-t-[#bd9958] rounded-full animate-spin" />
        </div>
      }
    >
      <ShopPageContent />
    </Suspense>
  );
}