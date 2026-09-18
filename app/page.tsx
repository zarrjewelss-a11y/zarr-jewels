import Testimonials from "@/components/Testimonials";
import Header from "@/components/Header";
import Newsletter from "@/components/Newsletter";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";
import InstagramGallery from "@/components/InstagramGallery";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <WhyChooseUs />
      <Newsletter />
      <Testimonials />
      <InstagramGallery />
      <Footer />
    </>
  );
}