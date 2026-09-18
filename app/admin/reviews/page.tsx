"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Star, Trash2, ArrowLeft, Search, Pencil } from "lucide-react";

type Review = {
  id: number;
  productId: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
};

type Product = {
  id: number;
  name: string;
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [editingReview, setEditingReview] = useState<Review | null>(null);
const [editName, setEditName] = useState("");
const [editRating, setEditRating] = useState(5);
const [editComment, setEditComment] = useState("");

  useEffect(() => {
    const adminProducts = JSON.parse(
      localStorage.getItem("adminProducts") || "[]"
    );

    setProducts(adminProducts);

    const allReviews: Review[] = [];

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("reviews-")) {
        try {
          const savedReviews = JSON.parse(
            localStorage.getItem(key) || "[]"
          );

          if (Array.isArray(savedReviews)) {
            allReviews.push(...savedReviews);
          }
        } catch (error) {
          console.error("Failed to load reviews:", error);
        }
      }
    });

    setReviews(allReviews);
  }, []);

  const getProductName = (productId: number) => {
    const product = products.find((item) => item.id === productId);

    return product?.name || `Product #${productId}`;
  };

  const deleteReview = (review: Review) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) return;

    const storageKey = `reviews-${review.productId}`;

    const savedReviews: Review[] = JSON.parse(
      localStorage.getItem(storageKey) || "[]"
    );

    const updatedReviews = savedReviews.filter(
      (item) => item.id !== review.id
    );

    localStorage.setItem(
      storageKey,
      JSON.stringify(updatedReviews)
    );

    setReviews((prev) =>
      prev.filter((item) => item.id !== review.id)
    );
  };
  const startEditing = (review: Review) => {
  setEditingReview(review);
  setEditName(review.name);
  setEditRating(review.rating);
  setEditComment(review.comment);
};

const cancelEditing = () => {
  setEditingReview(null);
  setEditName("");
  setEditRating(5);
  setEditComment("");
};

const saveEditedReview = () => {
  if (!editingReview) return;

  if (!editName.trim() || !editComment.trim()) {
    alert("Please enter customer name and review.");
    return;
  }

  const storageKey = `reviews-${editingReview.productId}`;

  const savedReviews: Review[] = JSON.parse(
    localStorage.getItem(storageKey) || "[]"
  );

  const updatedReview: Review = {
    ...editingReview,
    name: editName.trim(),
    rating: editRating,
    comment: editComment.trim(),
  };

  const updatedReviews = savedReviews.map((review) =>
    review.id === editingReview.id
      ? updatedReview
      : review
  );

  localStorage.setItem(
    storageKey,
    JSON.stringify(updatedReviews)
  );

  setReviews((prev) =>
    prev.map((review) =>
      review.id === editingReview.id
        ? updatedReview
        : review
    )
  );

  cancelEditing();

  alert("Review updated successfully! ⭐");
};

  const filteredReviews = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) return reviews;

    return reviews.filter((review) => {
      const productName = getProductName(review.productId);

      return (
        review.name.toLowerCase().includes(searchText) ||
        review.comment.toLowerCase().includes(searchText) ||
        productName.toLowerCase().includes(searchText)
      );
    });
  }, [reviews, search, products]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length
      : 0;
const editModal = editingReview && (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Edit Review
        </h2>

        <button
          onClick={cancelEditing}
          className="text-gray-400 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      {/* Name */}
      <label className="block font-semibold mb-2">
        Customer Name
      </label>

      <input
        type="text"
        value={editName}
        onChange={(e) => setEditName(e.target.value)}
        className="w-full border rounded-xl p-3 mb-5 outline-none focus:ring-2 focus:ring-pink-500"
      />

      {/* Rating */}
      <label className="block font-semibold mb-2">
        Rating
      </label>

      <div className="flex gap-2 mb-5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setEditRating(star)}
            className="hover:scale-110 transition"
          >
            <Star
              size={30}
              className={
                star <= editRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }
            />
          </button>
        ))}
      </div>

      {/* Comment */}
      <label className="block font-semibold mb-2">
        Review
      </label>

      <textarea
        value={editComment}
        onChange={(e) => setEditComment(e.target.value)}
        rows={5}
        className="w-full border rounded-xl p-3 mb-6 outline-none focus:ring-2 focus:ring-pink-500"
      />

      {/* Buttons */}
      <div className="flex gap-3">

        <button
          onClick={cancelEditing}
          className="flex-1 border border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={saveEditedReview}
          className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-bold"
        >
          Save Changes
        </button>

      </div>

    </div>
  </div>
);
  return (
  <>
    {editModal}

    <div className="min-h-screen bg-pink-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-pink-600 hover:underline mb-4"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </Link>

            <h1 className="text-4xl font-bold text-pink-600">
              Reviews Management
            </h1>

            <p className="text-gray-500 mt-2">
              Manage customer reviews and ratings
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-500">
              Total Reviews
            </p>

            <h2 className="text-4xl font-bold text-pink-600 mt-2">
              {reviews.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-500">
              Average Rating
            </p>

            <div className="flex items-center gap-3 mt-2">
              <h2 className="text-4xl font-bold text-yellow-500">
                {averageRating.toFixed(1)}
              </h2>

              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className={
                      star <= Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-500">
              5 Star Reviews
            </p>

            <h2 className="text-4xl font-bold text-green-600 mt-2">
              {
                reviews.filter(
                  (review) => review.rating === 5
                ).length
              }
            </h2>
          </div>

        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">
          <div className="relative">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer, product or review..."
              className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-pink-500"
            />

          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">
              Customer Reviews
            </h2>

            <p className="text-gray-500 mt-1">
              {filteredReviews.length} review
              {filteredReviews.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {filteredReviews.length === 0 ? (

            <div className="p-10 text-center">
              <p className="text-gray-500 text-lg">
                No reviews found.
              </p>
            </div>

          ) : (

            <div className="divide-y">

              {[...filteredReviews]
                .reverse()
                .map((review) => (

                  <div
                    key={review.id}
                    className="p-6 hover:bg-gray-50 transition"
                  >

                    <div className="flex items-start justify-between gap-6">

                      <div className="flex-1">

                        <div className="flex items-center justify-between gap-4">

                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              {review.name}
                            </h3>

                            <p className="text-sm text-pink-600 font-semibold mt-1">
                              {getProductName(review.productId)}
                            </p>
                          </div>

                          <span className="text-sm text-gray-400">
                            {review.date}
                          </span>

                        </div>

                        {/* Rating */}
                        <div className="flex gap-1 mt-3">

                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={19}
                              className={
                                star <= review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}

                        </div>

                        {/* Comment */}
                        <p className="text-gray-600 mt-4 leading-relaxed">
                          {review.comment}
                        </p>

                      </div>

                      {/* Delete */}
                      <div className="flex items-center gap-2">

  <button
    onClick={() => startEditing(review)}
    className="bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white p-3 rounded-xl transition"
    title="Edit Review"
  >
    <Pencil size={20} />
  </button>

  <button
    onClick={() => deleteReview(review)}
    className="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white p-3 rounded-xl transition"
    title="Delete Review"
  >
    <Trash2 size={20} />
  </button>

</div>
                    </div>

                  </div>

                ))}

            </div>

          )}

        </div>

      </div>
    </div>
    </>
  );
}