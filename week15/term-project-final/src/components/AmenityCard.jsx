export default function AmenityCard({ name, description, location}) {
  return (
    <div className="note amenity-card card">
      <p className="amenity-location">{location}</p>
      <h3>{name}</h3>
      <p>{description}</p>
    </div>
  );
}