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

import "./styles.css";

const property = {
name: "Hilo Eco-Vacation Rental",
island: "Big Island",
tagline: "A rock's throw from both Kīlauea and Coconut Island",
description: `A humble 2-bed 2-bath abode located on Hawaii's windward coast. Located in Hilo, it stands as a great launch pad for sightseeing lava fountains at Hawai‘i Volcanoes National Park (or just taking a laissez-faire day at the beach!)`,
amenities: ["Wifi", "2 Beds", "2 Full Baths", "Hotel-Quality"],
contactEmail: "fillerEmail@voidEmail.com.dontuse",
heroImages: [
    "/marc-szeglat-Aduh0KXCI1w-unsplash.jpg",
    "/abigail-lynn-9JrBiphz0e0-unsplash.jpg",
    "/chloe-leis-qUVov_XcAc0-unsplash.jpg",
    "/hari-nandakumar-VX88azaKEno-unsplash.jpg",
  ],
};

// fetch /api/properties/:id 


const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Header />
    <HeroSection name={property.name} island={property.island} tagline={property.tagline} heroImages={property.heroImages} />
    <AboutSection description={property.description} title={"Address"} image={"https://picsum.photos/300/200?random=1"}/>
    <section className="about">
      <AmenitiesSection amenities={property.amenities} />
      <CTASection email={property.contactEmail} />
    </section>
    <Footer />
  </StrictMode>
);
