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

import Dashboard from "./components/Dashboard";

import "./styles.css";

const property = {
name: "Hilo Eco-Vacation Rental",
island: "Big Island",
tagline: "A rock's throw from both Kīlauea and Coconut Island",
description: `A humble 2-bed 2-bath abode located on Hawaii's windward coast. Located in Hilo, it stands as a great launch pad for sightseeing lava fountains at Hawai‘i Volcanoes National Park (or just taking a laissez-faire day at the beach!)`,
amenities: [
  {name: "Wifi", location: "Residence", description: "Fast Wifi is included at no additional cost."}, 
  {name: "2 Beds", location: "Residence", description: "Two queen sized beds with memory foam, perfect for a good night's sleep."},
  {name: "2 Full Baths", location: "Residence", description: "One full bathroom on the ground floor, another attached to the master bedroom."},
  {name: "Parking space", location: "Residence", description: "One parking space is available at the residence."},
  // would a distance name/value be helpful?
  {name: "Local Resturants", location: "Hilo", description: "Ask us about local recomendations!"},
  {name: "Beaches", location: "Hilo", description: "Our favorites include Mokuola (Coconut Island) and Chalk's Beach."},
  {name: "Rainbow Falls", location: "Hilo", description: "The town's scenic waterfall that's only a 6 minute (2 mi / 3.4 km) drive away."},
  {name: "Hawaii Volcanoes National Park", location: "Kilauea", description: "Located less than an hour away by car, bus, or shuttle."},

],
contactEmail: "fillerEmail@voidandnull.com.dontuse",
contactImg: "https://picsum.photos/300/200?random=2",
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
    <section className="grid">
      <Dashboard />
      <div className="column">
        <AmenitiesSection amenities={property.amenities} />
        <CTASection email={property.contactEmail}/>
      </div> 
    </section>
    <Footer />
  </StrictMode>
);
