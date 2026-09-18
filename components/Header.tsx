"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";

import { useCart } from "@/components/context/CartContext";
import { useWishlist } from "@/components/context/WishlistContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  const router = useRouter();

  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const { wishlist } = useWishlist();

  const cartQuantity = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSearch = () => {
    if (!search.trim()) return;

    router.push(
      `/shop?search=${encodeURIComponent(search.trim())}`
    );

    setMobileMenu(false);
  };

  return (
    <>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 bg-[#F8F6EC]/95 backdrop-blur-md border-b border-[#D8D6C3]">

        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-[86px] flex items-center justify-between">

          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            href="/"
            className="group flex flex-col items-center leading-none"
          >
            <span
              className="
                text-[29px]
                md:text-[32px]
                font-serif
                font-semibold
                tracking-[0.20em]
                text-[#27352C]
                group-hover:text-[#A88A55]
                transition-colors
                duration-300
              "
            >
              ZARR
            </span>

            <span
              className="
                mt-1
                text-[8px]
                md:text-[9px]
                tracking-[0.55em]
                text-[#A88A55]
              "
            >
              JEWELS
            </span>
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <nav className="hidden md:flex items-center gap-9 lg:gap-11">

            <Link
              href="/"
              className="
                text-sm
                font-medium
                text-[#27352C]
                hover:text-[#A88A55]
                transition-colors
              "
            >
              Home
            </Link>

            <Link
              href="/shop"
              className="
                text-sm
                font-medium
                text-[#27352C]
                hover:text-[#A88A55]
                transition-colors
              "
            >
              Shop
            </Link>

            <Link
              href="/collections"
              className="
                text-sm
                font-medium
                text-[#27352C]
                hover:text-[#A88A55]
                transition-colors
              "
            >
              Collections
            </Link>

            <Link
              href="/about"
              className="
                text-sm
                font-medium
                text-[#27352C]
                hover:text-[#A88A55]
                transition-colors
              "
            >
              About
            </Link>

            <Link
              href="/contact"
              className="
                text-sm
                font-medium
                text-[#27352C]
                hover:text-[#A88A55]
                transition-colors
              "
            >
              Contact
            </Link>

          </nav>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="flex items-center gap-1 md:gap-2">

            {/* SEARCH */}

            <div
              className="
                hidden
                lg:flex
                items-center
                w-[225px]
                h-[42px]
                px-4
                rounded-full
                border
                border-[#D6D3C0]
                bg-[#F3F1E6]
                focus-within:border-[#A88A55]
                transition
              "
            >
              <Search className="w-4 h-4 text-[#7F876D]" />

              <input
                type="text"
                placeholder="Search jewelry..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="
                  ml-2
                  w-full
                  bg-transparent
                  outline-none
                  text-sm
                  text-[#27352C]
                  placeholder:text-[#999C8C]
                "
              />
            </div>

            {/* MOBILE SEARCH */}

            <button
              onClick={() => {
                if (search.trim()) {
                  handleSearch();
                }
              }}
              className="
                lg:hidden
                p-2
                text-[#27352C]
                hover:text-[#A88A55]
                transition
              "
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* WISHLIST */}

            <Link
              href="/wishlist"
              className="
                relative
                p-2
                text-[#27352C]
                hover:text-[#A88A55]
                transition
              "
              aria-label="Wishlist"
            >
              <Heart className="w-[21px] h-[21px]" />

              {wishlist.length > 0 && (
                <span
                  className="
                    absolute
                    -top-0.5
                    -right-0.5
                    min-w-[17px]
                    h-[17px]
                    px-1
                    rounded-full
                    bg-[#A88A55]
                    text-white
                    text-[9px]
                    font-bold
                    flex
                    items-center
                    justify-center
                  "
                >
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* ACCOUNT */}

            <Link
              href="/profile"
              className="
                hidden
                sm:block
                p-2
                text-[#27352C]
                hover:text-[#A88A55]
                transition
              "
              aria-label="Account"
            >
              <User className="w-[21px] h-[21px]" />
            </Link>

            {/* SHOPPING BAG */}

            <button
              onClick={() => setCartOpen(true)}
              className="
                relative
                p-2
                text-[#27352C]
                hover:text-[#A88A55]
                transition
              "
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-[21px] h-[21px]" />

              {cartQuantity > 0 && (
                <span
                  className="
                    absolute
                    -top-0.5
                    -right-0.5
                    min-w-[17px]
                    h-[17px]
                    px-1
                    rounded-full
                    bg-[#A88A55]
                    text-white
                    text-[9px]
                    font-bold
                    flex
                    items-center
                    justify-center
                  "
                >
                  {cartQuantity}
                </span>
              )}
            </button>

            {/* MOBILE MENU */}

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="
                md:hidden
                p-2
                text-[#27352C]
                hover:text-[#A88A55]
                transition
              "
              aria-label="Menu"
            >
              {mobileMenu ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

          </div>

        </div>

        {/* =================================================
            MOBILE MENU
        ================================================= */}

        {mobileMenu && (
          <div
            className="
              md:hidden
              border-t
              border-[#D8D6C3]
              bg-[#F8F6EC]
            "
          >

            {/* Search */}

            <div className="px-5 pt-5">

              <div
                className="
                  flex
                  items-center
                  h-12
                  px-4
                  rounded-full
                  border
                  border-[#D6D3C0]
                  bg-[#F3F1E6]
                "
              >
                <Search className="w-4 h-4 text-[#7F876D]" />

                <input
                  type="text"
                  placeholder="Search jewelry..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  className="
                    ml-2
                    w-full
                    bg-transparent
                    outline-none
                    text-sm
                    text-[#27352C]
                  "
                />
              </div>

            </div>

            {/* Navigation */}

            <nav className="flex flex-col px-5 py-6">

              {[
                ["Home", "/"],
                ["Shop", "/shop"],
                ["Collections", "/collections"],
                ["About", "/about"],
                ["Contact", "/contact"],
              ].map(([name, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenu(false)}
                  className="
                    px-4
                    py-3.5
                    text-[#27352C]
                    hover:text-[#A88A55]
                    border-b
                    border-[#E2E0D3]
                    transition
                  "
                >
                  {name}
                </Link>
              ))}

              <div className="my-3 border-t border-[#D8D6C3]" />

              <Link
                href="/wishlist"
                onClick={() => setMobileMenu(false)}
                className="
                  flex
                  items-center
                  justify-between
                  px-4
                  py-3.5
                  text-[#27352C]
                  hover:text-[#A88A55]
                "
              >
                <span className="flex items-center gap-3">
                  <Heart className="w-5 h-5" />
                  Wishlist
                </span>

                {wishlist.length > 0 && (
                  <span
                    className="
                      bg-[#A88A55]
                      text-white
                      text-xs
                      rounded-full
                      px-2
                      py-1
                    "
                  >
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link
                href="/profile"
                onClick={() => setMobileMenu(false)}
                className="
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3.5
                  text-[#27352C]
                  hover:text-[#A88A55]
                "
              >
                <User className="w-5 h-5" />
                My Account
              </Link>

            </nav>

          </div>
        )}

      </header>

      {/* =====================================================
          CART DRAWER
      ===================================================== */}

      {cartOpen && (
        <div className="fixed inset-0 z-[100]">

          {/* Overlay */}

          <div
            className="
              absolute
              inset-0
              bg-[#27352C]/45
              backdrop-blur-sm
            "
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer */}

          <aside
            className="
              absolute
              right-0
              top-0
              h-full
              w-full
              sm:w-[430px]
              bg-[#F8F6EC]
              shadow-2xl
              flex
              flex-col
            "
          >

            {/* Drawer Header */}

            <div
              className="
                flex
                items-center
                justify-between
                px-6
                py-6
                border-b
                border-[#D8D6C3]
              "
            >

              <div>

                <p
                  className="
                    text-[10px]
                    tracking-[0.3em]
                    text-[#A88A55]
                    uppercase
                  "
                >
                  ZARR JEWELS
                </p>

                <h2
                  className="
                    text-2xl
                    font-serif
                    font-semibold
                    text-[#27352C]
                    mt-1
                  "
                >
                  Your Bag
                </h2>

              </div>

              <button
                onClick={() => setCartOpen(false)}
                className="
                  p-2.5
                  rounded-full
                  border
                  border-[#D8D6C3]
                  text-[#27352C]
                  hover:text-[#A88A55]
                  hover:border-[#A88A55]
                  transition
                "
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* Cart Content */}

            <div className="flex-1 overflow-y-auto px-6 py-6">

              {cart.length === 0 ? (

                <div
                  className="
                    h-full
                    flex
                    flex-col
                    items-center
                    justify-center
                    text-center
                  "
                >

                  <ShoppingBag
                    className="
                      w-12
                      h-12
                      text-[#A8AE91]
                      mb-5
                    "
                  />

                  <h3
                    className="
                      text-xl
                      font-serif
                      font-semibold
                      text-[#27352C]
                    "
                  >
                    Your bag is empty
                  </h3>

                  <p
                    className="
                      text-sm
                      text-[#7F876D]
                      mt-2
                      max-w-[260px]
                    "
                  >
                    Discover our timeless jewelry collection
                    and find something made to shine.
                  </p>

                  <Link
                    href="/shop"
                    onClick={() => setCartOpen(false)}
                    className="
                      mt-6
                      px-7
                      py-3
                      rounded-full
                      bg-[#A8AE91]
                      hover:bg-[#7F876D]
                      text-white
                      text-sm
                      font-semibold
                      transition
                    "
                  >
                    Explore Collection
                  </Link>

                </div>

              ) : (

                <div className="space-y-5">

                  {cart.map((item) => (

                    <div
                      key={item.id}
                      className="
                        flex
                        gap-4
                        pb-5
                        border-b
                        border-[#E0DED1]
                      "
                    >

                      <img
                        src={item.image}
                        alt={item.name}
                        className="
                          w-20
                          h-20
                          rounded-xl
                          object-cover
                          bg-[#F0EEE2]
                        "
                      />

                      <div className="flex-1 min-w-0">

                        <div
                          className="
                            flex
                            justify-between
                            gap-3
                          "
                        >

                          <h3
                            className="
                              font-semibold
                              text-[#27352C]
                              text-sm
                              leading-5
                            "
                          >
                            {item.name}
                          </h3>

                          <button
                            onClick={() =>
                              removeFromCart(item.id)
                            }
                            className="
                              text-[#8B8D82]
                              hover:text-red-500
                            "
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>

                        <p
                          className="
                            text-[#A88A55]
                            font-semibold
                            mt-1
                          "
                        >
                          Rs.{" "}
                          {Number(item.price).toLocaleString()}
                        </p>

                        <div className="flex items-center gap-3 mt-3">

                          <button
                            onClick={() =>
                              decreaseQuantity(item.id)
                            }
                            className="
                              w-7
                              h-7
                              rounded-full
                              border
                              border-[#D8D6C3]
                              flex
                              items-center
                              justify-center
                              text-[#27352C]
                              hover:border-[#A88A55]
                              hover:text-[#A88A55]
                            "
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <span
                            className="
                              text-sm
                              font-semibold
                              text-[#27352C]
                              min-w-[18px]
                              text-center
                            "
                          >
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              increaseQuantity(item.id)
                            }
                            className="
                              w-7
                              h-7
                              rounded-full
                              bg-[#A88A55]
                              flex
                              items-center
                              justify-center
                              text-white
                              hover:bg-[#8F7547]
                            "
                          >
                            <Plus className="w-3 h-3" />
                          </button>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

            {/* Cart Footer */}

            {cart.length > 0 && (

              <div
                className="
                  border-t
                  border-[#D8D6C3]
                  px-6
                  py-6
                  bg-[#F1EFE4]
                "
              >

                <div
                  className="
                    flex
                    justify-between
                    items-center
                    mb-5
                  "
                >

                  <span className="text-sm text-[#7F876D]">
                    Subtotal
                  </span>

                  <span
                    className="
                      text-xl
                      font-semibold
                      text-[#27352C]
                    "
                  >
                    Rs. {cartTotal.toLocaleString()}
                  </span>

                </div>

                <p
                  className="
                    text-xs
                    text-[#8B8D82]
                    mb-4
                  "
                >
                  Shipping calculated at checkout.
                </p>

                <Link
                  href="/cart"
                  onClick={() => setCartOpen(false)}
                  className="
                    block
                    w-full
                    text-center
                    border
                    border-[#A88A55]
                    text-[#7F876D]
                    hover:bg-[#A88A55]
                    hover:text-white
                    py-3
                    rounded-full
                    text-sm
                    font-semibold
                    transition
                  "
                >
                  View Shopping Bag
                </Link>

                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="
                    block
                    w-full
                    text-center
                    mt-3
                    bg-[#A8AE91]
                    hover:bg-[#7F876D]
                    text-white
                    py-3
                    rounded-full
                    text-sm
                    font-semibold
                    transition
                  "
                >
                  Proceed to Checkout
                </Link>

              </div>

            )}

          </aside>

        </div>
      )}
    </>
  );
}