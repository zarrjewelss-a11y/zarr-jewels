import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Award, Gem, HeartHandshake, Truck } from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: <Gem size={40} className="text-pink-600" />,
      title: "Premium Quality",
      description:
        "Every jewelry piece is carefully crafted with elegance and attention to detail.",
    },
    {
      icon: <Truck size={40} className="text-pink-600" />,
      title: "Fast Delivery",
      description:
        "We deliver your favorite jewelry quickly and safely across Pakistan.",
    },
    {
      icon: <Award size={40} className="text-pink-600" />,
      title: "Trusted Brand",
      description:
        "Thousands of happy customers trust ZARR JEWELSfor premium jewelry shopping.",
    },
    {
      icon: <HeartHandshake size={40} className="text-pink-600" />,
      title: "Customer Support",
      description:
        "Our support team is always ready to help you anytime.",
    },
  ];

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-pink-600 to-pink-500 text-white py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold">About ZARR</h1>

          <p className="mt-5 text-lg text-pink-100 max-w-3xl mx-auto">
            We believe jewelry is more than an accessory. It is a symbol of
            beauty, confidence, and unforgettable memories.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">

          <img
            src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1000"
            alt="Jewelry"
            className="rounded-3xl shadow-xl"
          />

          <div>
            <h2 className="text-4xl font-bold">
              Our Story
            </h2>

            <p className="mt-6 text-gray-600 leading-8">
              ZARR JEWELS was created with one simple mission: to provide
              elegant and luxurious jewelry that makes every customer feel
              special. Every collection is designed with passion and timeless
              beauty.
            </p>

            <p className="mt-6 text-gray-600 leading-8">
              From rings and necklaces to earrings and bracelets, our goal is
              to offer premium quality at affordable prices.
            </p>
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-14">
            Why Choose Us
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {features.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-3xl shadow p-8 text-center hover:shadow-xl transition"
              >
                <div className="flex justify-center">
                  {item.icon}
                </div>

                <h3 className="text-2xl font-bold mt-5">
                  {item.title}
                </h3>

                <p className="text-gray-600 mt-4">
                  {item.description}
                </p>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-pink-600 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-5xl font-bold">
            Our Mission
          </h2>

          <p className="mt-6 text-xl leading-8">
            To deliver luxury, elegance, and happiness through every jewelry
            piece while providing the best shopping experience for our
            customers.
          </p>

        </div>
      </section>

      <Footer />
    </>
  );
}