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

const property = {
name: "Wailea Beach Retreat",
island: "Maui",
tagline: "Your romantic escape on the Valley Isle.",
imageURL: "/images/wailea-hero.jpg",
description: 'Luxury ocean-front villas near Wailea.',
amenities: ["Ocean View Lanai", "Infinity Pool", "Couples Spa", "Farm-to-Table Dining"],
contactEmail: "reservations@wailearetreat.com",
};

// fetch /api/properties/:id 


const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Header />
    <HeroSection name={property.name} island={property.island} tagline={property.tagline} imageURL={property.imageURL} />
    <AboutSection description={property.description}/>
    <AmenitiesSection amenities={property.amenities} />
    <CTASection email={property.contactEmail} />
    <Footer />
  </StrictMode>
);
