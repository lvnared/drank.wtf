import { Hero } from './Hero';
import { HowItWorks } from './HowItWorks';
import { LiveFeed } from './LiveFeed';
import { WhyDrank } from './WhyDrank';
import { ProvablyFairCTA } from './ProvablyFairCTA';
import { Footer } from './Footer';
import { useScrollReveal } from './useScrollReveal';

export default function LandingPage() {
    useScrollReveal();

    return (
        <>
            <Hero />
            <HowItWorks />
            <LiveFeed />
            <WhyDrank />
            <ProvablyFairCTA />
            <Footer />
        </>
    );
}
