import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import GameModes from '../components/GameModes';
import HowItWorksSection from '../components/HowItWorksSection';
import Features from '../components/Features';
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <div id="home" className="min-h-screen bg-base-dark text-base-content selection:bg-primary selection:text-white">
      <Navbar />
      <Hero />
      <GameModes />
      <HowItWorksSection />
      <Features />
      <Footer />
    </div>
  );
};

export default Landing;
