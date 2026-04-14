/**
 * React Entry Point
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Header from "./components/Header";
import Footer from "./components/Footer";
import AboutSection from "./components/AboutSection";
import AmenitiesSection from "./components/AmenitiesSection";
import HeroSection from "./components/HeroSection";
import CTASection from "./components/CTASection";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Header />
    <HeroSection />
    <AboutSection />
    <AmenitiesSection />
    <CTASection />
    <Footer />
  </StrictMode>
);
