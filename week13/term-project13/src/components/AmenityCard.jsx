export default function AmenityCard({ name, description, location}) {
  return (
    <div className="note amenity-card">
      <p className="amenity-location">{location}</p>
      <h2>{name}</h2>
      <p>{description}</p>
    </div>
  );
}