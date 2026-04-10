export default function IslandCard({ id, name, description, tip }) {
  return (
    <div className="note">
      <h1>{name}</h1>
      <p> {description}</p>
      <p> {tip} </p>
    </div>
  );
}
