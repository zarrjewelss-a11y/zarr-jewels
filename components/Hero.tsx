import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F8F7EF]">

      {/* =========================
          SOFT BACKGROUND
      ========================== */}

      <div className="absolute inset-0 pointer-events-none">

        {/* Sage glow */}
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-[#A8AE91]/20 blur-3xl" />

        {/* Champagne glow */}
        <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-[#D8C8A8]/20 blur-3xl" />

        {/* Very subtle center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-white/50 blur-3xl" />

      </div>


      {/* =========================
          DECORATIVE LEAVES
      ========================== */}

      <div className="absolute top-24 right-[42%] text-[#A8AE91]/20 text-7xl font-serif rotate-12 pointer-events-none select-none">
        ❧
      </div>

      <div className="absolute bottom-16 left-10 text-[#A88A55]/15 text-8xl font-serif -rotate-12 pointer-events-none select-none">
        ❧
      </div>


      {/* =========================
          MAIN CONTAINER
      ========================== */}

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-16 md:py-20 lg:py-24">

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-14 lg:gap-20 items-center">


          {/* =========================
              LEFT CONTENT
          ========================== */}

          <div className="text-center lg:text-left">

            {/* Collection Label */}

            <div className="inline-flex items-center gap-4 mb-7">

              <span className="w-12 h-px bg-[#B49762]" />

              <span className="text-[#A88A55] text-[11px] md:text-xs tracking-[0.32em] uppercase font-medium">
                New Collection
              </span>

              <span className="w-12 h-px bg-[#B49762]" />

            </div>


            {/* Main Heading */}

            <h1 className="font-serif text-[56px] sm:text-[64px] md:text-[72px] lg:text-[78px] leading-[0.95] text-[#27352C]">

              Timeless

              <br />

              <span className="italic font-normal text-[#B49762]">
                Beauty
              </span>

            </h1>


            {/* Small decorative line */}

            <div className="flex items-center justify-center lg:justify-start gap-3 mt-7">

              <span className="w-8 h-px bg-[#D8C8A8]" />

              <span className="text-[#A88A55] text-xs">
                ✦
              </span>

              <span className="w-8 h-px bg-[#D8C8A8]" />

            </div>


            {/* Description */}

            <p className="mt-7 max-w-[520px] mx-auto lg:mx-0 text-[#687064] text-[15px] md:text-base leading-8">

              Discover elegant jewelry designed to make every
              moment unforgettable. Beautiful pieces crafted for
              women who believe true elegance never goes out of style.

            </p>


            {/* Buttons */}

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-9">

              <Link
                href="/shop"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#A88A55] text-white text-sm tracking-wide font-medium rounded-full shadow-lg shadow-[#A88A55]/15 hover:bg-[#927543] hover:-translate-y-0.5 transition-all duration-300"
              >
                Shop Collection

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>

              </Link>


              <Link
                href="/collections"
                className="inline-flex items-center justify-center px-8 py-4 border border-[#BDA978] text-[#A88A55] bg-[#FFFDF7]/50 text-sm tracking-wide font-medium rounded-full hover:bg-[#A88A55] hover:text-white transition-all duration-300"
              >
                Explore More
              </Link>

            </div>


            {/* =========================
                TRUST DETAILS
            ========================== */}

            <div className="flex justify-center lg:justify-start items-center gap-7 md:gap-10 mt-12">

              <div className="text-center lg:text-left">

                <p className="font-serif text-2xl text-[#27352C]">
                  10K+
                </p>

                <p className="text-[10px] tracking-wide uppercase text-[#7F876D] mt-1">
                  Happy Clients
                </p>

              </div>


              <div className="h-10 w-px bg-[#D8D5C5]" />


              <div className="text-center lg:text-left">

                <p className="font-serif text-2xl text-[#27352C]">
                  500+
                </p>

                <p className="text-[10px] tracking-wide uppercase text-[#7F876D] mt-1">
                  Designs
                </p>

              </div>


              <div className="h-10 w-px bg-[#D8D5C5]" />


              <div className="text-center lg:text-left">

                <p className="font-serif text-2xl text-[#27352C]">
                  4.9
                </p>

                <p className="text-[10px] tracking-wide uppercase text-[#7F876D] mt-1">
                  Rating
                </p>

              </div>

            </div>

          </div>


          {/* =========================
              RIGHT IMAGE
          ========================== */}

          <div className="relative">

            <div className="relative mx-auto max-w-[570px]">


              {/* Outer Champagne Frame */}

              <div className="absolute -inset-4 md:-inset-5 rounded-[42px] border border-[#C8B27E]/50" />

              <div className="absolute -inset-2 rounded-[36px] border border-[#A8AE91]/20" />


              {/* Image */}

              <div className="relative overflow-hidden rounded-[32px] bg-[#E9E6D9] shadow-[0_25px_70px_rgba(39,53,44,0.15)]">

                <img
                  src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1200&q=90"
                  alt="ZARR JEWELS premium jewelry collection"
                  className="w-full h-[460px] sm:h-[520px] md:h-[590px] object-cover transition-transform duration-700 hover:scale-[1.02]"
                />


                {/* Cream/Sage Overlay */}

                <div className="absolute inset-0 bg-gradient-to-t from-[#27352C]/25 via-transparent to-[#FFFDF7]/5 pointer-events-none" />

              </div>


              {/* =========================
                  OFFER CARD
              ========================== */}

              <div className="absolute top-5 right-[-10px] md:right-[-22px] bg-[#A8AE91] text-white px-6 py-5 rounded-[20px] shadow-xl">

                <p className="text-[9px] tracking-[0.28em] uppercase">
                  Special Offer
                </p>

                <p className="font-serif text-2xl mt-1">
                  25% OFF
                </p>

                <div className="w-8 h-px bg-white/50 mt-2" />

                <p className="text-[10px] mt-2 opacity-90">
                  New Collection
                </p>

              </div>


              {/* =========================
                  PRODUCT CARD
              ========================== */}

              <div className="absolute bottom-5 left-[-10px] md:left-[-22px] bg-[#FFFDF7]/95 backdrop-blur-sm px-6 py-5 rounded-[20px] shadow-xl border border-[#E2DDCE]">

                <p className="text-[9px] tracking-[0.25em] uppercase text-[#A88A55]">
                  ZARR JEWELS
                </p>

                <p className="font-serif text-xl text-[#27352C] mt-1">
                  Timeless Elegance
                </p>

                <p className="text-[10px] tracking-wide text-[#7F876D] mt-1">
                  Made to Shine
                </p>

              </div>


              {/* =========================
                  SMALL GOLD DETAIL
              ========================== */}

              <div className="absolute bottom-[-15px] right-10 w-12 h-12 rounded-full bg-[#B49762] flex items-center justify-center text-white text-sm shadow-lg">
                ✦
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}