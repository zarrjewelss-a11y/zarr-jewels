"use client";

import Link from "next/link";
import {
  Instagram,
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#27352C] text-[#FFFDF7]">

      {/* Soft Background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#A8AE91]/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#C8A96B]/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">

        {/* ================= FOOTER GRID ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">

          {/* ================= BRAND ================= */}

          <div className="lg:pr-8">

            <Link href="/" className="inline-block">
              <h2 className="font-serif text-3xl tracking-[0.12em] text-[#FFFDF7]">
                ZARR
              </h2>

              <p className="text-[#C8A96B] text-[9px] tracking-[0.45em] uppercase mt-1">
                JEWELS
              </p>
            </Link>

            <p className="mt-6 text-[#BFC4B7] text-sm leading-7">
              Discover timeless elegance with our premium jewelry
              collection. Beautiful pieces crafted to make every
              moment shine.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-7">

              <a
                href="https://www.instagram.com/zarrjewelers/"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-[#C8A96B]/40 flex items-center justify-center text-[#C8A96B] hover:bg-[#C8A96B] hover:text-[#27352C] transition duration-300"
              >
                <Instagram size={17} />
              </a>

              <a
                href="#"
                aria-label="Website"
                className="w-10 h-10 rounded-full border border-[#C8A96B]/40 flex items-center justify-center text-[#C8A96B] hover:bg-[#C8A96B] hover:text-[#27352C] transition duration-300"
              >
                <Globe size={17} />
              </a>

              <a
                href="zarrjewelss@gmail.com"
                aria-label="Email"
                className="w-10 h-10 rounded-full border border-[#C8A96B]/40 flex items-center justify-center text-[#C8A96B] hover:bg-[#C8A96B] hover:text-[#27352C] transition duration-300"
              >
                <Mail size={17} />
              </a>

            </div>

          </div>


          {/* ================= QUICK LINKS ================= */}

          <div>

            <h3 className="font-serif text-xl text-[#FFFDF7] mb-6">
              Quick Links
            </h3>

            <ul className="space-y-4 text-sm text-[#BFC4B7]">

              <li>
                <Link
                  href="/"
                  className="hover:text-[#C8A96B] transition"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/shop"
                  className="hover:text-[#C8A96B] transition"
                >
                  Shop
                </Link>
              </li>

              <li>
                <Link
                  href="/collections"
                  className="hover:text-[#C8A96B] transition"
                >
                  Collections
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="hover:text-[#C8A96B] transition"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#C8A96B] transition"
                >
                  Contact
                </Link>
              </li>

            </ul>

          </div>


          {/* ================= SHOP CATEGORIES ================= */}

          <div>

            <h3 className="font-serif text-xl text-[#FFFDF7] mb-6">
              Shop Categories
            </h3>

            <ul className="space-y-4 text-sm text-[#BFC4B7]">

              <li>
                <Link
                  href="/shop?category=Necklaces"
                  className="hover:text-[#C8A96B] transition"
                >
                  Necklaces
                </Link>
              </li>

              <li>
                <Link
                  href="/shop?category=Earrings"
                  className="hover:text-[#C8A96B] transition"
                >
                  Earrings
                </Link>
              </li>

              <li>
                <Link
                  href="/shop?category=Rings"
                  className="hover:text-[#C8A96B] transition"
                >
                  Rings
                </Link>
              </li>

              <li>
                <Link
                  href="/shop?category=Bracelets"
                  className="hover:text-[#C8A96B] transition"
                >
                  Bracelets
                </Link>
              </li>

            </ul>

          </div>


          {/* ================= CONTACT ================= */}

          <div>

            <h3 className="font-serif text-xl text-[#FFFDF7] mb-6">
              Contact Us
            </h3>

            <div className="space-y-5 text-sm text-[#BFC4B7]">

              <div className="flex items-start gap-3">
                <MapPin
                  className="text-[#C8A96B] mt-0.5 shrink-0"
                  size={18}
                />

                <span>
                  Islamabad, Pakistan
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone
                  className="text-[#C8A96B] shrink-0"
                  size={18}
                />

                <span>
                  +92 329 1406464
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Mail
                  className="text-[#C8A96B] shrink-0"
                  size={18}
                />

                <span>
                  zarrjewelss@gmail.com
                </span>
              </div>

            </div>

          </div>

        </div>


        {/* ================= DIVIDER ================= */}

        <div className="flex items-center gap-4 mt-14">

          <div className="flex-1 h-px bg-[#C8A96B]/20" />

          <span className="text-[#C8A96B] text-xs">
            ✦
          </span>

          <div className="flex-1 h-px bg-[#C8A96B]/20" />

        </div>


        {/* ================= BOTTOM ================= */}

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-7 text-xs">

          <p className="text-[#8F9788]">
            © 2026 ZARR JEWELS. All rights reserved.
          </p>

          <p className="text-[#8F9788]">
            Crafted with <span className="text-[#C8A96B]">♡</span>{" "}
            for timeless elegance.
          </p>

        </div>

      </div>


      {/* ================= BACK TO TOP ================= */}

      <button
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        aria-label="Back to top"
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#C8A96B] hover:bg-[#A88A55] text-white shadow-2xl transition duration-300 hover:scale-110 z-50 flex items-center justify-center text-lg"
      >
        ↑
      </button>

    </footer>
  );
}