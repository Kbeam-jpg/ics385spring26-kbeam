/*
Name: Kendall Beam
Assignment: Term Project 3
Description: Houses the core App for the React front end
Filename: index.jsx (react entry point)
Date: May 3 2026

Notes:
-- currently throws a fast refresh error do to function App() existing in the same page
-- function App() handles the useEffect / useState
    for checking authentication / fetching property data
-- assigns grid and column classes to the grid sections here

AI attribution:
-- implementing abort controllers (though they give browser errors, still gets the data)
-- the fetchProperty() function, in adapting it to an updated Property schema quickly
*/

import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import Header from "./components/Header";
import Footer from "./components/Footer";
import AboutSection from "./components/AboutSection";
import AmenitiesSection from "./components/AmenitiesSection";
import HeroSection from "./components/HeroSection";
import CTASection from "./components/CTASection";

import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";

import "./styles.css";

// Fetch property data from backend (fallbacks applied if API doesn't provide fields)

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [property, setProperty] = useState(null);
  const [propLoading, setPropLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function checkAuth() {
      try {
        const response = await fetch('/admin/status', {
          credentials: 'include',
          signal: controller.signal
        });
        const data = await response.json();
        setIsAuthenticated(data.user.role === 'admin' || false);
      } catch (err) {
        if (err.name !== 'AbortError') {
          // console.error('Auth check failed:', err);
        }
      } finally {
        setAuthLoading(false);
      }
    }

    checkAuth();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    // **Generated Code**
    async function fetchProperty() {
      try {
        const res = await fetch('/api/properties', { signal: controller.signal });
        if (!res.ok) throw new Error('Failed to fetch properties');
        const data = await res.json();
        const raw = Array.isArray(data) && data.length > 0 ? data[0] : null;
        if (raw) {
          // Normalize fields for existing components
          const normalized = {
            ...raw,
            amenities: Array.isArray(raw.amenities)
              ? (typeof raw.amenities[0] === 'string'
                  ? raw.amenities.map((name) => ({ name, location: 'Residence', description: '' }))
                  : raw.amenities)
              : [],
            heroImages: raw.heroImages && raw.heroImages.length > 0 ? raw.heroImages : (raw.imageURL ? [raw.imageURL] : []),
            tagline: raw.tagline || '',
            contactEmail: raw.contactEmail || ''
          };
          setProperty(normalized);
        } else {
          console.warn('No properties returned from API');
        }
      } catch (err) {
        if (err.name !== 'AbortError') console.error('Property fetch failed:', err);
      } finally {
        setPropLoading(false);
      }
    }

    fetchProperty();

    return () => controller.abort();
  }, []);

  if (authLoading || propLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isAuthenticated && <AdminDashboard onAuthError={() => window.location.reload()} />}
      <Header />
      <HeroSection name={property?.name} island={property?.island} tagline={property?.tagline} heroImages={property?.heroImages} />
      <AboutSection description={property?.description} title={"200 W. Kāwili St."} image={property?.imageURL || "https://picsum.photos/300/200?random=1"}/>
      <section className="grid card">
        <div className="column">
          <Dashboard />
        </div>
        <div className="column">
          <AmenitiesSection amenities={property?.amenities || []} />
        </div> 
      </section>
      <CTASection email={property?.contactEmail} />
      <Footer />
  </>
  );
}

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
