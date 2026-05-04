/*
Name: Kendall Beam
Assignment: Term Project 3
Description: individual amenity cards
Filename: AmenitiesCard.jsx
Date: May 3 2026
*/

/**
 * @param {String} name <h3> title text
 * @param {String} description <p> bottom text
 * @param {String} location <p> sub header
 * @returns {JSX.Element} amenity-card
 */
export default function AmenityCard({ name, description, location}) {
  return (
    <div className="note amenity-card card">
      <p className="amenity-location">{location}</p>
      <h3>{name}</h3>
      <p>{description}</p>
    </div>
  );
}