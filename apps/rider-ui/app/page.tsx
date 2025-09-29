import Benefits from "@/components/homepage/Benefits";
import Footer from "@/components/homepage/Footer";
import Hero from "@/components/homepage/Hero";
import HowItWorks from "@/components/homepage/HowItWorks";
import Impact from "@/components/homepage/Impact";
import Testimonials from "@/components/homepage/Testimonials";
// import { Button } from "@repo/ui/components/button";

const Home = () => {
  return (
    <div>
      <main className="min-h-screen bg-white">
        <Hero />
        <Benefits />
        <Impact />
        <HowItWorks />
        <Testimonials />
        <Footer />
      </main>
      {/* <Button>Click Me</Button> */}
    </div>
  );
};

export default Home;
