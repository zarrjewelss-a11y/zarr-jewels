"use client";

import Link from "next/link";
import { useCart } from "@/components/context/CartContext";
import { useWishlist } from "@/components/context/WishlistContext";
import { Heart, ShoppingBag } from "lucide-react";

const products = [
  {
    id: 101,
    name: "Elegant Clover Necklace",
    price: 2499,
    category: "Necklaces",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&q=90",
  },
  {
    id: 102,
    name: "Classic Gold Earrings",
    price: 1899,
    category: "Earrings",
    image:
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=900&q=90",
  },
  {
    id: 103,
    name: "Timeless Gold Ring",
    price: 1599,
    category: "Rings",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=900&q=90",
  },
  {
    id: 104,
    name: "Luxury Bracelet",
    price: 2199,
    category: "Bracelets",
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900&q=90",
  },
];

export default function FeaturedProducts() {
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const isWishlisted = (id: number) =>
  wishlist.some((item) => Number(item.id) === id);

  const toggleWishlist = (product: (typeof products)[number]) => {
    if (isWishlisted(product.id)) {
     removeFromWishlist(String(product.id));
    } else {
      addToWishlist({
        id: String(product.id),
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
  };

  return (
    <section className="relative py-20 lg:py-28 bg-[#FFFDF7] overflow-hidden">

      {/* Soft Background */}

      <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-[#A8AE91]/10 blur-3xl" />

      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#D8C8A8]/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">

        {/* ================= HEADER ================= */}

        <div className="text-center max-w-2xl mx-auto mb-14">

          <div className="flex items-center justify-center gap-4 mb-5">

            <span className="w-12 h-px bg-[#C8A96B]" />

            <span className="text-[#A88A55] text-xs tracking-[0.3em] uppercase">
              ZARR JEWELS
            </span>

            <span className="w-12 h-px bg-[#C8A96B]" />

          </div>

          <h2 className="font-serif text-4xl md:text-5xl text-[#27352C]">

            Our Featured{" "}

            <span className="italic font-normal text-[#A88A55]">
              Collection
            </span>

          </h2>

          <p className="mt-5 text-[#7F876D] text-sm md:text-base leading-7">
            Discover timeless jewelry pieces designed to complement
            your everyday elegance.
          </p>

        </div>

        {/* ================= PRODUCTS ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">

          {products.map((product) => (

            <div
              key={product.id}
              className="group relative"
            >

              {/* Product Image */}

              <div className="relative overflow-hidden rounded-[24px] bg-[#F0EFE4] aspect-[4/5]">

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Soft Overlay */}

                <div className="absolute inset-0 bg-gradient-to-t from-[#27352C]/10 to-transparent pointer-events-none" />

                {/* Wishlist */}

                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label={
                    isWishlisted(product.id)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#FFFDF7]/90 backdrop-blur-sm flex items-center justify-center text-[#27352C] hover:text-[#A88A55] shadow-md transition"
                >

                  <Heart
                    className={`w-5 h-5 ${
                      isWishlisted(product.id)
                        ? "fill-[#A88A55] text-[#A88A55]"
                        : ""
                    }`}
                  />

                </button>

                {/* Category */}

                <div className="absolute top-4 left-4">

                  <span className="bg-[#A8AE91] text-white px-3 py-1.5 rounded-full text-[10px] tracking-[0.15em] uppercase">
                    {product.category}
                  </span>

                </div>

                {/* Add To Cart */}

                <div className="absolute bottom-4 left-4 right-4 translate-y-16 group-hover:translate-y-0 transition-transform duration-500">

                  <button
                    onClick={() =>
                      addToCart({
                        id: String(product.id),
                        name: product.name,
                        price: product.price,
                        image: product.image,
                      })
                    }
                    className="w-full flex items-center justify-center gap-2 bg-[#FFFDF7] text-[#27352C] py-3.5 rounded-full text-sm font-medium shadow-xl hover:bg-[#A88A55] hover:text-white transition duration-300"
                  >

                    <ShoppingBag className="w-4 h-4" />

                    Add to Bag

                  </button>

                </div>

              </div>

              {/* Product Details */}

              <div className="pt-5 px-1">

                <p className="text-[10px] tracking-[0.22em] uppercase text-[#A88A55]">
                  {product.category}
                </p>

                <Link href="/shop">

                  <h3 className="font-serif text-lg text-[#27352C] mt-2 hover:text-[#A88A55] transition">
                    {product.name}
                  </h3>

                </Link>

                <p className="mt-2 text-sm font-semibold text-[#27352C]">
                  Rs. {product.price.toLocaleString()}
                </p>

              </div>

            </div>

          ))}

        </div>

        {/* ================= VIEW ALL ================= */}

        <div className="flex justify-center mt-14">

          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-8 py-3.5 border border-[#A88A55] rounded-full text-[#A88A55] text-sm font-medium hover:bg-[#A88A55] hover:text-white transition duration-300"
          >
            View All Jewelry
            <span>→</span>
          </Link>

        </div>

      </div>

    </section>
  );
}