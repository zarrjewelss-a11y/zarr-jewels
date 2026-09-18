"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  collection,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";

import { useCart } from "@/components/context/CartContext";
import { useWishlist } from "@/components/context/WishlistContext";


import {
  Heart,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Minus,
  Plus,
  Share2,
} from "lucide-react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  rating: number;
  sale?: boolean;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  stock?: number;
  description?: string;
};

type Review = {
  id: string;
  productId: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
};

export default function ProductPage({ params }: Props) {
  const { id } = use(params);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [tab, setTab] = useState<
    "description" | "shipping" | "reviews"
  >("description");

 // -----------------------------------------
// LOAD PRODUCT FROM FIREBASE
// -----------------------------------------

useEffect(() => {
  setLoading(true);

  const unsubscribe = onSnapshot(
    collection(db, "products"),
    (snapshot) => {
      const firestoreProducts: Product[] = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          name: data.name || "",
          price: Number(data.price) || 0,
          oldPrice:
            data.oldPrice !== undefined && data.oldPrice !== ""
              ? Number(data.oldPrice)
              : undefined,
          image: data.image || "",
          category: data.category || "",
          rating: Number(data.rating) || 0,
          sale: data.sale || false,
          featured: data.featured || false,
          bestSeller: data.bestSeller || false,
          newArrival: data.newArrival || false,
          stock: Number(data.stock) || 0,
          description: data.description || "",
        };
      });

      console.log("PRODUCT PAGE ID:", id);
console.log("FIREBASE PRODUCT IDS:", firestoreProducts.map((p) => p.id));
setProducts(firestoreProducts);
      setLoading(false);
    },
    (error) => {
      console.error("Failed to load products from Firebase:", error);
      setProducts([]);
      setLoading(false);
    }
  );

  return () => unsubscribe();
}, []);

  // -----------------------------------------
  // FIND PRODUCT
  // -----------------------------------------

  const product = useMemo(() => {
  return (
    products.find(
      (item) => item.id === id
    ) || null
  );
}, [products, id]);
  // -----------------------------------------
  // LOAD REVIEWS
  // -----------------------------------------

  useEffect(() => {
  if (!product) return;

  const reviewsQuery = collection(db, "reviews");

  const unsubscribe = onSnapshot(
    reviewsQuery,
    (snapshot) => {
      const loadedReviews: Review[] = snapshot.docs
        .map((docSnap) => {
          const data = docSnap.data();

          return {
            id: docSnap.id,
            productId: String(data.productId || ""),
            name: data.customerName || "Customer",
            rating: Number(data.rating || 0),
            comment: data.review || "",
            date: data.createdAt?.toDate
              ? data.createdAt.toDate().toISOString()
              : new Date().toISOString(),
          };
        })
        .filter(
          (review) => review.productId === String(product.id)
        );

      setReviews(loadedReviews);
    },
    (error) => {
      console.error("Failed to load reviews:", error);
      setReviews([]);
    }
  );

  return () => unsubscribe();
}, [product]);

  // -----------------------------------------
  // SET PRODUCT IMAGE
  // -----------------------------------------

  useEffect(() => {
    if (product?.image) {
      setSelectedImage(product.image);
    }
  }, [product]);

  // -----------------------------------------
  // PRODUCT IMAGES
  // -----------------------------------------

  const images = useMemo(() => {
    if (!product?.image) return [];

    return [
      product.image,
      product.image,
      product.image,
      product.image,
    ];
  }, [product]);

  // -----------------------------------------
  // AVERAGE RATING
  // -----------------------------------------

  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        ) / reviews.length
      : product?.rating || 0;

  // -----------------------------------------
  // DISCOUNT
  // -----------------------------------------

  const discount =
    product?.oldPrice && product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) /
            product.oldPrice) *
            100
        )
      : 0;

  // -----------------------------------------
  // WISHLIST
  // -----------------------------------------

  const liked = product
    ? isInWishlist(product.id)
    : false;

  // -----------------------------------------
  // RELATED PRODUCTS
  // -----------------------------------------

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return products.filter(
      (item) =>
        item.id !== product.id &&
        item.category === product.category
    );
  }, [products, product]);

  // -----------------------------------------
  // Add to Bag
  // -----------------------------------------

 const handleAddToCart = () => {
  if (!product) return;

  if ((product.stock ?? 0) <= 0) {
  alert("Sorry, this product is currently out of stock.");
  return;
}

  for (let i = 0; i < quantity; i++) {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  }

  alert(`${quantity} ${product.name} added to cart!`);
};

  // -----------------------------------------
  // SHARE
  // -----------------------------------------

  const handleShare = async () => {
    if (!product) return;

    const shareData = {
      title: product.name,
      text: `Check out ${product.name} at ZARR JEWELS`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          window.location.href
        );

        alert("Product link copied!");
      }
    } catch (error) {
      console.log("Share cancelled:", error);
    }
  };

  // -----------------------------------------
  // SUBMIT REVIEW
  // -----------------------------------------

  const handleSubmitReview = () => {
    if (!product) return;

    if (
      !reviewName.trim() ||
      !reviewComment.trim()
    ) {
      alert("Please enter your name and review.");
      return;
    }

    const newReview: Review = {
  id: Date.now().toString(),
  productId: product.id,
  name: reviewName.trim(),
  rating: reviewRating,
  comment: reviewComment.trim(),
  date: new Date().toISOString(),
};

    const updatedReviews = [
      ...reviews,
      newReview,
    ];

    setReviews(updatedReviews);

    localStorage.setItem(
      `reviews-${product.id}`,
      JSON.stringify(updatedReviews)
    );

    setReviewName("");
    setReviewComment("");
    setReviewRating(5);

    alert("Review submitted successfully! ⭐");
  };

  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (loading) {
    return (
      <>
        <Header />

        <main className="min-h-[60vh] flex items-center justify-center bg-[#faf9f4]">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-[#c5a15a] border-t-transparent rounded-full animate-spin mx-auto" />

            <p className="mt-4 text-gray-600">
              Loading product...
            </p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // -----------------------------------------
  // PRODUCT NOT FOUND
  // -----------------------------------------

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />

      <main className="bg-[#faf9f4]">

        {/* =====================================
            PRODUCT SECTION
        ===================================== */}

        <section className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-6">

            {/* BACK */}
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-[#b89552] hover:text-[#8f7139] font-medium transition"
            >
              ← Back to Shop
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mt-10">

              {/* =================================
                  LEFT - PRODUCT IMAGES
              ================================= */}

              <div>

                <div className="bg-white rounded-3xl overflow-hidden border border-[#e8e1d2] shadow-sm">
                  <img
                    src={
                      selectedImage ||
                      product.image ||
                      "/placeholder.jpg"
                    }
                    alt={product.name}
                    className="w-full h-[500px] md:h-[650px] object-cover"
                  />
                </div>

                {/* THUMBNAILS */}

                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 mt-4">

                    {images.map((img, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() =>
                          setSelectedImage(img)
                        }
                        className={`overflow-hidden rounded-xl border-2 transition ${
                          selectedImage === img
                            ? "border-[#b89552]"
                            : "border-[#e5dfd2] hover:border-[#cbb27d]"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} ${
                            index + 1
                          }`}
                          className="w-full h-24 object-cover"
                        />
                      </button>
                    ))}

                  </div>
                )}
              </div>

              {/* =================================
                  RIGHT - PRODUCT DETAILS
              ================================= */}

              <div className="flex flex-col">

                {/* CATEGORY */}

                <span className="inline-flex w-fit bg-[#eee9dc] text-[#a27f3d] px-4 py-2 rounded-full text-sm font-semibold">
                  {product.category}
                </span>

                {/* PRODUCT NAME */}

                <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#24352c] mt-5 leading-tight">
                  {product.name}
                </h1>

                {/* RATING */}

                <div className="flex items-center gap-3 mt-5">

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <Star
                          key={star}
                          size={20}
                          className={
                            star <=
                            Math.round(
                              averageRating
                            )
                              ? "fill-[#d4a84f] text-[#d4a84f]"
                              : "text-gray-300"
                          }
                        />
                      )
                    )}
                  </div>

                  <span className="text-gray-600">
                    {averageRating.toFixed(1)}
                  </span>

                  <span className="text-gray-400">
                    ({reviews.length}{" "}
                    {reviews.length === 1
                      ? "review"
                      : "reviews"})
                  </span>

                </div>

                {/* PRICE */}

                <div className="flex flex-wrap items-center gap-4 mt-7">

                  <span className="text-4xl font-bold text-[#b89552]">
                    Rs. {product.price}
                  </span>

                  {product.oldPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      Rs. {product.oldPrice}
                    </span>
                  )}

                  {discount > 0 && (
                    <span className="bg-[#e7f1e9] text-green-700 px-3 py-1 rounded-full font-semibold text-sm">
                      {discount}% OFF
                    </span>
                  )}

                </div>

                {/* DESCRIPTION */}

                <p className="mt-7 text-gray-600 leading-8">
                  {product.description ||
                    "Premium jewelry designed with elegant finishing for timeless beauty and everyday luxury."}
                </p>

                {/* FEATURES */}

                <div className="mt-8 space-y-4">

                  <div className="flex items-center gap-3 text-gray-700">
                    <Check
                      className="text-green-600"
                      size={20}
                    />
                    <span>
                      Premium Quality Guaranteed
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <Truck
                      className="text-[#b89552]"
                      size={20}
                    />
                    <span>
                      Free Shipping Nationwide
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <RotateCcw
                      className="text-blue-600"
                      size={20}
                    />
                    <span>
                      7 Days Easy Return
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <ShieldCheck
                      className="text-purple-600"
                      size={20}
                    />
                    <span>
                      100% Secure Payment
                    </span>
                  </div>

                </div>

                {/* STOCK */}

                <div className="mt-7">

                  {Number(product.stock) <= 0 ? (
                    <span className="text-red-600 font-semibold">
                      Out of Stock
                    </span>
                  ) : (
                    <span className="text-green-600 font-semibold">
                      ✓ In Stock
                    </span>
                  )}

                </div>

                {/* QUANTITY */}

                <div className="flex items-center gap-4 mt-7">

                  <span className="font-semibold">
                    Quantity:
                  </span>

                  <div className="flex items-center border border-[#ddd4c4] bg-white rounded-xl overflow-hidden">

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) =>
                          Math.max(1, q - 1)
                        )
                      }
                      className="p-3 hover:bg-[#f5f1e8] transition"
                    >
                      <Minus size={18} />
                    </button>

                    <span className="w-12 text-center font-bold">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) =>
                          q + 1
                        )
                      }
                      className="p-3 hover:bg-[#f5f1e8] transition"
                    >
                      <Plus size={18} />
                    </button>

                  </div>

                </div>

                {/* ACTION BUTTONS */}

                <div className="grid sm:grid-cols-2 gap-4 mt-8">

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={Number(product.stock) <= 0}
                    className="bg-[#b89552] hover:bg-[#a27f3d] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition"
                  >
                    {Number(product.stock) <= 0                    ? "Out of Stock"
                      : "Add to Bag"}
                  </button>

                  <button
  type="button"
  onClick={() => {
    if (!product || (product.stock ?? 0) <= 0) return;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }

    window.location.href = "/checkout";
  }}
  disabled={(product.stock ?? 0) <= 0}
  className="bg-[#24352c] hover:bg-[#18251f] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-center transition"
>
  {(product.stock ?? 0) <= 0 ? "Out of Stock" : "Buy Now"}
</button>

                </div>

                {/* WISHLIST + SHARE */}

                <div className="flex gap-4 mt-4">

                  <button
                    type="button"
                    onClick={() =>
                      toggleWishlist({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                      })
                    }
                    className={`flex-1 border rounded-xl py-3 flex items-center justify-center gap-2 transition ${
                      liked
                        ? "bg-[#b89552] text-white border-[#b89552]"
                        : "bg-white border-[#ddd4c4] hover:bg-[#f5f1e8]"
                    }`}
                  >
                    <Heart
                      size={18}
                      fill={
                        liked
                          ? "currentColor"
                          : "none"
                      }
                    />

                    {liked
                      ? "Wishlisted"
                      : "Wishlist"}
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex-1 border border-[#ddd4c4] bg-white rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-[#f5f1e8] transition"
                  >
                    <Share2 size={18} />
                    Share
                  </button>

                </div>

              </div>
            </div>

            {/* =================================
                TABS
            ================================= */}

            <div className="mt-20 bg-white rounded-3xl border border-[#e8e1d2] p-6 md:p-10">

              <div className="border-b border-[#e5dfd2] flex gap-6 md:gap-10 overflow-x-auto">

                <button
                  type="button"
                  onClick={() =>
                    setTab("description")
                  }
                  className={`pb-4 font-semibold whitespace-nowrap ${
                    tab === "description"
                      ? "border-b-2 border-[#b89552] text-[#b89552]"
                      : "text-gray-500"
                  }`}
                >
                  Description
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setTab("shipping")
                  }
                  className={`pb-4 font-semibold whitespace-nowrap ${
                    tab === "shipping"
                      ? "border-b-2 border-[#b89552] text-[#b89552]"
                      : "text-gray-500"
                  }`}
                >
                  Shipping
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setTab("reviews")
                  }
                  className={`pb-4 font-semibold whitespace-nowrap ${
                    tab === "reviews"
                      ? "border-b-2 border-[#b89552] text-[#b89552]"
                      : "text-gray-500"
                  }`}
                >
                  Reviews ({reviews.length})
                </button>

              </div>

              {/* DESCRIPTION TAB */}

              {tab === "description" && (
                <div className="mt-7 text-gray-600 leading-8">
                  <p>
                    {product.description ||
                      "This luxury jewelry piece is designed with premium materials and elegant finishing. Perfect for special occasions as well as everyday styling."}
                  </p>
                </div>
              )}

              {/* SHIPPING TAB */}

              {tab === "shipping" && (
                <div className="mt-7 space-y-5 text-gray-600 leading-8">

                  <div className="flex gap-4">
                    <Truck
                      className="text-[#b89552] shrink-0 mt-1"
                      size={22}
                    />

                    <div>
                      <h3 className="font-bold text-gray-800">
                        Fast Delivery
                      </h3>

                      <p>
                        Orders are normally
                        dispatched within 24 hours
                        and delivered within 3–5
                        business days.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <RotateCcw
                      className="text-blue-600 shrink-0 mt-1"
                      size={22}
                    />

                    <div>
                      <h3 className="font-bold text-gray-800">
                        Easy Returns
                      </h3>

                      <p>
                        Enjoy our 7-day easy return
                        policy for eligible products.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <ShieldCheck
                      className="text-purple-600 shrink-0 mt-1"
                      size={22}
                    />

                    <div>
                      <h3 className="font-bold text-gray-800">
                        Secure Payment
                      </h3>

                      <p>
                        Your payment information is
                        handled securely.
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* REVIEWS TAB */}

              {tab === "reviews" && (
                <div className="mt-8">

                  {/* REVIEW SUMMARY */}

                  <div className="grid md:grid-cols-2 gap-10">

                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Customer Reviews
                      </h3>

                      <div className="flex items-center gap-3 mt-4">

                        <span className="text-5xl font-bold text-[#b89552]">
                          {averageRating.toFixed(
                            1
                          )}
                        </span>

                        <div>
                          <div className="flex">

                            {[1, 2, 3, 4, 5].map(
                              (star) => (
                                <Star
                                  key={star}
                                  size={22}
                                  className={
                                    star <=
                                    Math.round(
                                      averageRating
                                    )
                                      ? "fill-[#d4a84f] text-[#d4a84f]"
                                      : "text-gray-300"
                                  }
                                />
                              )
                            )}

                          </div>

                          <p className="text-gray-500 mt-1">
                            Based on{" "}
                            {reviews.length}{" "}
                            review
                            {reviews.length !==
                            1
                              ? "s"
                              : ""}
                          </p>
                        </div>

                      </div>
                    </div>

                    {/* RATING BREAKDOWN */}

                    <div className="space-y-3">

                      {[5, 4, 3, 2, 1].map(
                        (rating) => {
                          const count =
                            reviews.filter(
                              (review) =>
                                review.rating ===
                                rating
                            ).length;

                          const percentage =
                            reviews.length > 0
                              ? (count /
                                  reviews.length) *
                                100
                              : 0;

                          return (
                            <div
                              key={rating}
                              className="flex items-center gap-3"
                            >
                              <span className="w-10 text-sm font-medium">
                                {rating} ★
                              </span>

                              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#d4a84f] rounded-full"
                                  style={{
                                    width: `${percentage}%`,
                                  }}
                                />
                              </div>

                              <span className="w-8 text-sm text-gray-500 text-right">
                                {count}
                              </span>
                            </div>
                          );
                        }
                      )}

                    </div>

                  </div>

                  {/* EXISTING REVIEWS */}

                  <div className="mt-10 space-y-4">

                    {reviews.length === 0 ? (
                      <div className="bg-[#faf9f4] rounded-2xl p-6 text-center text-gray-500">
                        No reviews yet. Be the
                        first to review this
                        product!
                      </div>
                    ) : (
                      [...reviews]
                        .reverse()
                        .map((review) => (
                          <div
                            key={review.id}
                            className="border border-[#e8e1d2] rounded-2xl p-5 bg-[#faf9f4]"
                          >

                            <div className="flex items-start justify-between gap-4">

                              <div>
                                <h4 className="font-semibold text-lg text-gray-800">
                                  {review.name}
                                </h4>

                                <div className="flex items-center gap-1 mt-1">

                                  {[1, 2, 3, 4, 5].map(
                                    (star) => (
                                      <Star
                                        key={star}
                                        size={17}
                                        className={
                                          star <=
                                          review.rating
                                            ? "fill-[#d4a84f] text-[#d4a84f]"
                                            : "text-gray-300"
                                        }
                                      />
                                    )
                                  )}

                                </div>
                              </div>

                              <span className="text-sm text-gray-400">
                                {new Date(
                                  review.date
                                ).toLocaleDateString(
                                  "en-GB"
                                )}
                              </span>

                            </div>

                            <p className="text-gray-600 mt-4 leading-relaxed">
                              {review.comment}
                            </p>

                          </div>
                        ))
                    )}

                  </div>

                  {/* WRITE REVIEW */}

                  <div className="mt-10 border-t border-[#e5dfd2] pt-10">

                    <h3 className="text-2xl font-bold text-gray-800">
                      Write a Review
                    </h3>

                    {/* NAME */}

                    <input
                      type="text"
                      value={reviewName}
                      onChange={(e) =>
                        setReviewName(
                          e.target.value
                        )
                      }
                      placeholder="Your Name"
                      className="w-full mt-6 border border-[#ddd4c4] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#b89552]"
                    />

                    {/* RATING */}

                    <div className="mt-5">

                      <p className="font-semibold mb-2">
                        Your Rating
                      </p>

                      <div className="flex gap-1">

                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() =>
                                setReviewRating(
                                  star
                                )
                              }
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                size={28}
                                className={
                                  star <=
                                  reviewRating
                                    ? "fill-[#d4a84f] text-[#d4a84f]"
                                    : "text-gray-300"
                                }
                              />
                            </button>
                          )
                        )}

                      </div>

                    </div>

                    {/* COMMENT */}

                    <textarea
                      value={reviewComment}
                      onChange={(e) =>
                        setReviewComment(
                          e.target.value
                        )
                      }
                      placeholder="Write your review..."
                      rows={4}
                      className="w-full border border-[#ddd4c4] rounded-xl p-3 mt-5 outline-none focus:ring-2 focus:ring-[#b89552]"
                    />

                    {/* SUBMIT */}

                    <button
                      type="button"
                      onClick={
                        handleSubmitReview
                      }
                      className="mt-4 bg-[#b89552] hover:bg-[#a27f3d] text-white px-7 py-3 rounded-xl font-bold transition"
                    >
                      Submit Review
                    </button>

                  </div>

                </div>
              )}

            </div>

            {/* =================================
                RELATED PRODUCTS
            ================================= */}

            {relatedProducts.length > 0 && (
              <div className="mt-20">

                <div className="text-center mb-10">

                  <span className="uppercase tracking-[0.3em] text-sm text-[#b89552] font-semibold">
                    You May Also Like
                  </span>

                  <h2 className="text-4xl font-serif font-bold text-[#24352c] mt-3">
                    Related Products
                  </h2>

                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

                  {relatedProducts
                    .slice(0, 4)
                    .map((item) => (

                      <Link
                        key={item.id}
                        href={`/product/${item.id}`}
                        className="bg-white border border-[#e8e1d2] rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition"
                      >

                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-56 object-cover"
                        />

                        <div className="p-5">

                          <span className="text-xs uppercase tracking-wider text-[#b89552]">
                            {item.category}
                          </span>

                          <h3 className="font-bold text-lg text-gray-800 mt-2">
                            {item.name}
                          </h3>

                          <div className="flex items-center gap-3 mt-3">

                            <span className="text-[#b89552] font-bold text-lg">
                              Rs. {item.price}
                            </span>

                            {item.oldPrice && (
                              <span className="text-gray-400 line-through text-sm">
                                Rs.{" "}
                                {item.oldPrice}
                              </span>
                            )}

                          </div>

                        </div>

                      </Link>

                    ))}

                </div>

              </div>
            )}

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}