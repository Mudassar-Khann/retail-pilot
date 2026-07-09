import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import AIPromptSearch from "@/components/home/AIPromptSearch";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import AIStylistPreview from "@/components/home/AIStylistPreview";
import VirtualCharacterConfigurator from "@/components/home/VirtualCharacterConfigurator";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <AIPromptSearch />
        <FeaturedCategories />
        <FeaturedProducts />
        <AIStylistPreview />
        <VirtualCharacterConfigurator />
      </main>
      <Footer />
    </>
  );
}
