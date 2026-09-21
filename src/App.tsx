import { useState } from 'react';
import SponsoredBanner from '@/components/SponsoredBanner';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ChannelSearch from '@/components/ChannelSearch';
import Calculator from '@/components/Calculator';
import WorthCalculator from '@/components/WorthCalculator';
import CarMatcher from '@/components/CarMatcher';
import Leaderboard from '@/components/Leaderboard';
import Footer from '@/components/Footer';

export default function App() {
  const [targetMarketWorth, setTargetMarketWorth] = useState(0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      <SponsoredBanner />
      <Header />
      <main>
        <Hero />
        <ChannelSearch />
        <Calculator />
        <WorthCalculator onWorthCalculated={setTargetMarketWorth} />
        <CarMatcher targetMarketWorth={targetMarketWorth} />
        <Leaderboard />
      </main>
      <Footer />
    </div>
  );
}
