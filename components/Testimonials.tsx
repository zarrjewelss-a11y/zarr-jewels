export default function Testimonials() {
  const reviews = [
    {
      name: "Ayesha K.",
      review:
        "Absolutely beautiful jewelry! The quality exceeded my expectations and the piece looked even more elegant in person.",
      rating: "★★★★★",
    },
    {
      name: "Sara A.",
      review:
        "I ordered a necklace and it arrived in gorgeous packaging. The whole experience felt premium and special.",
      rating: "★★★★★",
    },
    {
      name: "Fatima N.",
      review:
        "Amazing customer service and beautiful designs. ZARR has definitely become one of my favorite jewelry brands.",
      rating: "★★★★★",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#F0EFE4] py-20 lg:py-28">

      {/* Soft Background */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#A8AE91]/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#D8C8A8]/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">

        {/* ================= HEADER ================= */}

        <div className="text-center max-w-2xl mx-auto mb-14">

          <div className="flex items-center justify-center gap-4 mb-5">
            <span className="w-12 h-px bg-[#C8A96B]" />

            <span className="text-[#A88A55] text-xs tracking-[0.3em] uppercase">
              Testimonials
            </span>

            <span className="w-12 h-px bg-[#C8A96B]" />
          </div>

          <h2 className="font-serif text-4xl md:text-5xl text-[#27352C]">
            What Our{" "}
            <span className="italic font-normal text-[#A88A55]">
              Customers Say
            </span>
          </h2>

          <p className="mt-5 text-[#7F876D] text-sm md:text-base leading-7">
            Discover why customers choose ZARR for timeless elegance,
            beautiful designs and a premium shopping experience.
          </p>

        </div>

        {/* ================= REVIEWS ================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">

          {reviews.map((review) => (
            <div
              key={review.name}
              className="group relative overflow-hidden rounded-[28px] bg-[#FFFDF7] border border-[#E3E0D3] p-8 md:p-9 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
            >

              {/* Decorative Circle */}
              <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-[#A8AE91]/10 transition-transform duration-500 group-hover:scale-150" />

              {/* Quote */}
              <div className="relative">

                <span className="font-serif text-5xl text-[#C8A96B] leading-none">
                  “
                </span>

                {/* Rating */}
                <div className="mt-2 text-[#A88A55] text-sm tracking-[0.2em]">
                  {review.rating}
                </div>

                {/* Review */}
                <p className="mt-5 text-[#6F7565] text-sm md:text-base leading-7">
                  {review.review}
                </p>

                {/* Divider */}
                <div className="flex items-center gap-3 mt-7">
                  <span className="w-8 h-px bg-[#C8A96B]" />

                  <span className="text-[#A88A55] text-xs">
                    ✦
                  </span>

                  <span className="w-8 h-px bg-[#C8A96B]" />
                </div>

                {/* Customer */}
                <div className="mt-5">
                  <h3 className="font-serif text-xl text-[#27352C]">
                    {review.name}
                  </h3>

                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#A88A55] mt-1">
                    Verified Customer
                  </p>
                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}