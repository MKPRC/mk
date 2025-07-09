import { HeroSection } from '@/widgets/hero-section';
import { MembershipSection } from '@/widgets/membership-section';
import { Footer } from '@/widgets/footer';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <MembershipSection />
      <Footer />
    </main>
  );
} 