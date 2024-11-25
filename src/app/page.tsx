import Features from "@/components/Features";
import Footer from "@/components/Footer";
import GlobalSection from "@/components/GlobalSection";
import Hero from "@/components/Hero";
import LearningSection from "@/components/LearningSection";
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/Testimonials";


export default function Home() {
  return (
    <div>
    <Navbar/>
    <Hero/>
    <Features/>
    <GlobalSection/>
    <LearningSection/>
    <Testimonials/>
    <Footer/>
    </div>
    
  );
}
