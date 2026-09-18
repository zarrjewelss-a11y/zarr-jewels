import Link from "next/link";

export default function InstagramGallery() {
  const images = [
    "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600",
    "https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=600",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600",
    "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600",
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <span className="text-pink-600 uppercase tracking-widest font-semibold">
            Follow Us
          </span>

          <h2 className="text-5xl font-bold mt-3">
            Instagram Gallery
          </h2>

          <p className="text-gray-500 mt-4">
            Get inspired by our latest jewelry collections.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

          {images.map((image, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl group"
            >
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-72 object-cover group-hover:scale-110 transition duration-500"
              />
            </div>
          ))}

        </div>

        <div className="text-center mt-12">
          <Link href="/">
            <button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-full transition">
              @ZARR JEWELS
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}