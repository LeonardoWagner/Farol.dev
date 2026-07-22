import { Header } from '@/components/sections/Header';
import { HeroSection } from '@/components/hero/HeroSection';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { Differentials } from '@/components/sections/Differentials';
import { Process } from '@/components/sections/Process';
import { Projects } from '@/components/sections/Projects';
import { Manifest } from '@/components/sections/Manifest';
import { Stack } from '@/components/sections/Stack';
import { Testimonials } from '@/components/sections/Testimonials';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSection />
        <About />
        <Services />
        <Differentials />
        <Process />
        <Projects />
        <Manifest />
        <Stack />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
