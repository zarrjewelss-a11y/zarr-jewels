import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { products } from "@/lib/products";

export default function CollectionsPage() {
  const collections = [
    {
      title: "Luxury Rings",
      category: "Rings",
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800",
    },
    {
      title: "Elegant Necklaces",
      category: "Necklaces",
      image:
        "https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=800",
    },
    {
      title: "Classic Earrings",
      category: "Earrings",
      image:
        "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800",
    },
  ];

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-pink-600 to-pink-500 text-white py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold">
            Our Collections
          </h1>

          <p className="mt-5 text-lg text-pink-100">
            Discover timeless beauty crafted with elegance.
          </p>
        </div>
      </section>

      {/* Collection Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          <div className="grid md:grid-cols-3 gap-8">

            {collections.map((item) => (
              <div
                key={item.title}
                className="relative rounded-3xl overflow-hidden group shadow-lg"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-[420px] w-full object-cover group-hover:scale-110 transition duration-500"
                />

                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end items-center pb-10">

                  <h2 className="text-3xl font-bold text-white">
                    {item.title}
                  </h2>

                  <Link
                    href={`/shop?search=${item.category}`}
                    className="mt-5 bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full transition"
                  >
                    Explore
                  </Link>

                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-14">
            Featured Collection
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {products.slice(0, 4).map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-xl transition"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-72 object-cover"
                />

                <div className="p-6">

                  <span className="text-sm bg-pink-100 text-pink-600 px-3 py-1 rounded-full">
                    {product.category}
                  </span>

                  <h3 className="text-2xl font-bold mt-4">
                    {product.name}
                  </h3>

                  <p className="text-pink-600 font-bold mt-3">
                    ${product.price}
                  </p>

                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* Offer Banner */}
      <section className="py-20 bg-pink-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">

          <h2 className="text-5xl font-bold">
            Summer Sale
          </h2>

          <p className="mt-5 text-xl">
            Get up to <strong>30% OFF</strong> on selected jewelry.
          </p>

          <Link
            href="/shop"
            className="inline-block mt-8 bg-white text-pink-600 px-10 py-4 rounded-full font-semibold hover:scale-105 transition"
          >
            Shop Now
          </Link>

        </div>
      </section>

      <Footer />
    </>
  );
}