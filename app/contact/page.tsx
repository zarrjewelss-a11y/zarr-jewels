import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-pink-600 to-pink-500 text-white py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold">
            Contact Us
          </h1>

          <p className="mt-5 text-lg text-pink-100">
            We'd love to hear from you. Get in touch with us anytime.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">

          {/* Contact Info */}
          <div>

            <h2 className="text-4xl font-bold mb-8">
              Get In Touch
            </h2>

            <div className="space-y-6">

              <div className="flex gap-4 bg-white p-6 rounded-2xl shadow">
                <Mail className="text-pink-600" size={28} />
                <div>
                  <h3 className="font-bold text-xl">Email</h3>
                  <p className="text-gray-600">
                    support@nexa.com
                  </p>
                </div>
              </div>

              <div className="flex gap-4 bg-white p-6 rounded-2xl shadow">
                <Phone className="text-pink-600" size={28} />
                <div>
                  <h3 className="font-bold text-xl">Phone</h3>
                  <p className="text-gray-600">
                    +92 300 1234567
                  </p>
                </div>
              </div>

              <div className="flex gap-4 bg-white p-6 rounded-2xl shadow">
                <MapPin className="text-pink-600" size={28} />
                <div>
                  <h3 className="font-bold text-xl">Address</h3>
                  <p className="text-gray-600">
                    Karachi, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex gap-4 bg-white p-6 rounded-2xl shadow">
                <Clock className="text-pink-600" size={28} />
                <div>
                  <h3 className="font-bold text-xl">Working Hours</h3>
                  <p className="text-gray-600">
                    Mon - Sat : 9:00 AM - 7:00 PM
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-3xl font-bold mb-8">
              Send Message
            </h2>

            <form className="space-y-6">

              <input
                type="text"
                placeholder="Your Name"
                className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />

              <input
                type="text"
                placeholder="Subject"
                className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />

              <textarea
                rows={6}
                placeholder="Your Message"
                className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />

              <button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-full font-semibold transition"
              >
                Send Message
              </button>

            </form>

          </div>

        </div>
      </section>

      {/* Map */}
      <section className="pb-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">

          <div className="bg-white rounded-3xl shadow p-10 text-center">

            <h2 className="text-3xl font-bold">
              Our Location
            </h2>

            <p className="text-gray-500 mt-3">
              Google Map can be added here later.
            </p>

            <div className="mt-8 h-80 rounded-2xl bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
              Google Map Placeholder
            </div>

          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}