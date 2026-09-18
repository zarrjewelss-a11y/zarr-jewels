export default function WhyChooseUs() {
  const features = [
    {
      title: "Premium Quality",
      description:
        "Beautifully crafted jewelry made with attention to detail and premium materials.",
      icon: "✦",
    },
    {
      title: "Free Shipping",
      description:
        "Enjoy free shipping on orders above Rs. 5,000 anywhere in Pakistan.",
      icon: "◇",
    },
    {
      title: "Secure Payment",
      description:
        "Shop with confidence through secure and trusted payment methods.",
      icon: "○",
    },
    {
      title: "Luxury Packaging",
      description:
        "Every ZARR order is carefully presented in elegant gift-ready packaging.",
      icon: "✧",
    },
    {
      title: "Easy Returns",
      description:
        "A simple and hassle-free return and exchange experience for your peace of mind.",
      icon: "↩",
    },
    {
      title: "Customer Support",
      description:
        "Our support team is always ready to assist you whenever you need us.",
      icon: "♡",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#FFFDF7] py-20 lg:py-28">
      
      {/* Soft Background */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#A8AE91]/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#D8C8A8]/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">

        {/* ================= HEADER ================= */}

        <div className="text-center max-w-2xl mx-auto mb-14">

          <div className="flex items-center justify-center gap-4 mb-5">
            <span className="w-12 h-px bg-[#C8A96B]" />

            <span className="text-[#A88A55] text-xs tracking-[0.3em] uppercase">
              Why ZARR
            </span>

            <span className="w-12 h-px bg-[#C8A96B]" />
          </div>

          <h2 className="font-serif text-4xl md:text-5xl text-[#27352C]">
            Why Choose{" "}
            <span className="italic font-normal text-[#A88A55]">
              ZARR?
            </span>
          </h2>

          <p className="mt-5 text-[#7F876D] text-sm md:text-base leading-7">
            More than jewelry — an experience designed around elegance,
            quality and confidence.
          </p>

        </div>

        {/* ================= FEATURES ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">

          {features.map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-[28px] bg-[#F0EFE4] border border-[#E3E0D3] p-8 md:p-9 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
            >

              {/* Decorative Circle */}
              <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-[#A8AE91]/15 transition-transform duration-500 group-hover:scale-150" />

              {/* Icon */}
              <div className="relative mx-auto w-20 h-20 rounded-full border border-[#C8A96B]/50 bg-[#FFFDF7] flex items-center justify-center text-[#A88A55] text-3xl shadow-sm transition-all duration-500 group-hover:bg-[#A88A55] group-hover:text-white group-hover:scale-105">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="relative font-serif text-xl md:text-2xl text-[#27352C] mt-6">
                {item.title}
              </h3>

              {/* Description */}
              <p className="relative text-sm text-[#7F876D] mt-3 leading-7">
                {item.description}
              </p>

              {/* Bottom Detail */}
              <div className="relative flex items-center justify-center gap-2 mt-6">
                <span className="w-6 h-px bg-[#C8A96B]" />

                <span className="text-[#A88A55] text-xs">
                  ✦
                </span>

                <span className="w-6 h-px bg-[#C8A96B]" />
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}