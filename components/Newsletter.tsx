"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) return;

    // Newsletter integration can be connected later.
    setEmail("");
  };

  return (
    <section className="relative overflow-hidden bg-[#27352C] py-20 lg:py-24">

      {/* Soft Luxury Background */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#A8AE91]/15 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#C8A96B]/10 blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">

        {/* Decorative Heading */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="w-12 h-px bg-[#C8A96B]" />

          <span className="text-[#C8A96B] text-xs tracking-[0.3em] uppercase">
            Stay Connected
          </span>

          <span className="w-12 h-px bg-[#C8A96B]" />
        </div>

        {/* Heading */}
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#FFFDF7]">
          Stay in the{" "}
          <span className="italic font-normal text-[#C8A96B]">
            ZARR Circle
          </span>
        </h2>

        {/* Description */}
        <p className="max-w-2xl mx-auto mt-6 text-[#D8D5C5] text-sm md:text-base leading-7">
          Be the first to discover new collections, exclusive offers and
          timeless jewelry inspiration from ZARR JEWELS.
        </p>

        {/* Newsletter Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
        >

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="flex-1 px-6 py-4 rounded-full bg-[#FFFDF7] text-[#27352C] placeholder:text-[#8A8F80] border border-[#D8C8A8] outline-none focus:ring-2 focus:ring-[#C8A96B] transition"
          />

          <button
            type="submit"
            className="px-8 py-4 rounded-full bg-[#C8A96B] text-white text-sm font-medium hover:bg-[#A88A55] transition duration-300 shadow-lg"
          >
            Subscribe
          </button>

        </form>

        {/* Small Trust Text */}
        <p className="mt-5 text-[#A8AE91] text-xs">
          No spam. Just beautiful jewelry, exclusive offers &amp; ZARR updates.
        </p>

      </div>
    </section>
  );
}