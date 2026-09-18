"use client";

import Link from "next/link";
import {
  Gem,
  CircleDot,
  Heart,
  Sparkles,
} from "lucide-react";

const categories = [
  {
    name: "Necklaces",
    subtitle: "Elegant & Timeless",
    icon: Gem,
    href: "/shop?category=Necklaces",
  },
  {
    name: "Earrings",
    subtitle: "Made to Shine",
    icon: Sparkles,
    href: "/shop?category=Earrings",
  },
  {
    name: "Rings",
    subtitle: "Everyday Elegance",
    icon: CircleDot,
    href: "/shop?category=Rings",
  },
  {
    name: "Bracelets",
    subtitle: "Delicate Details",
    icon: Heart,
    href: "/shop?category=Bracelets",
  },
];

export default function Categories() {
  return (
    <section className="relative bg-[#FFFDF7] py-20 md:py-24 overflow-hidden">

      {/* Soft Background */}
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-[#A8AE91]/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#D8C8A8]/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">

          <div className="flex items-center justify-center gap-4 mb-5">
            <span className="w-12 h-px bg-[#C8A96B]" />

            <span className="text-[#A88A55] text-xs tracking-[0.3em] uppercase">
              Explore ZARR
            </span>

            <span className="w-12 h-px bg-[#C8A96B]" />
          </div>

          <h2 className="font-serif text-4xl md:text-5xl text-[#27352C]">
            Shop by
            <span className="italic font-normal text-[#A88A55]">
              {" "}Collection
            </span>
          </h2>

          <p className="mt-5 text-[#7F876D] text-sm md:text-base leading-7">
            Discover jewelry designed to add a touch of elegance
            to every moment.
          </p>

        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">

          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={category.href}
                className="group"
              >

                <div className="relative overflow-hidden rounded-[28px] bg-[#F0EFE4] border border-[#E3E0D3] p-8 md:p-10 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">

                  {/* Decorative Circle */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#A8AE91]/15 transition-transform duration-500 group-hover:scale-150" />

                  {/* Icon */}
                  <div className="relative mx-auto w-20 h-20 md:w-24 md:h-24 rounded-full border border-[#C8A96B]/50 bg-[#FFFDF7] flex items-center justify-center text-[#A88A55] shadow-sm transition-all duration-500 group-hover:bg-[#A88A55] group-hover:text-white group-hover:scale-105">

                    <Icon
                      strokeWidth={1.3}
                      className="w-9 h-9 md:w-10 md:h-10"
                    />

                  </div>

                  {/* Text */}
                  <h3 className="relative font-serif text-xl md:text-2xl text-[#27352C] mt-6">
                    {category.name}
                  </h3>

                  <p className="relative text-xs md:text-sm text-[#7F876D] mt-2">
                    {category.subtitle}
                  </p>

                  {/* Explore */}
                  <div className="relative mt-5 text-[#A88A55] text-xs tracking-[0.18em] uppercase opacity-70 group-hover:opacity-100 transition">
                    Explore →
                  </div>

                </div>

              </Link>
            );
          })}

        </div>

      </div>
    </section>
  );
}