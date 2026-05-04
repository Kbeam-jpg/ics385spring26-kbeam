/*
Name: Kendall Beam
Assignment: Term Project 3
Description: grid of amenity cards, filterable by selected Location <options> combobox
Filename: AmenitiesSection.jsx
Date: May 3 2026
*/

import { useState } from "react";
import AmenityCard from "./AmenityCard";

/**
 * Creates grid of <AmenityCard /> with their data
 * @param {Array} ammenities list of amenity objects
 * @returns {JSX.Element} amenity-section
 */
export default function AmenitiesSection({ amenities = []}) {
  const [selectedLocation, setSelectedLocation] = useState("All");
  
  // if All is selected => show all cards
  // if location is selected => show only matching locations
  const displayed =
    selectedLocation === "All" ? amenities : amenities.filter((a) => a.location === selectedLocation);

  // populate <select> dropdown with location data from object array
  const locations = ["All", ...new Set(amenities.map((a) => a.location))];
  
  return (
    <section className="amenity-section card">
      <div className="amenity-header">
        <h3>Amenities & Nearby Activities</h3>
        <select className="amenity-select" onChange={(e) => setSelectedLocation(e.target.value)}>
          {locations.map((s) => (
          <option key={s}>{s}</option>
        ))}
        </select>

        {/* <p className="amenity-count">
          Showing {displayed.length} of {amenities.length}
        </p> */}
      </div>

     

      <div className="amenities-grid">
        {displayed.map((amenity) => (
          <AmenityCard 
            key={amenity.name} 
            name={amenity.name} 
            description={amenity.description}
            location={amenity.location}
          />
        ))}
      </div>
    </section>
  );
}

