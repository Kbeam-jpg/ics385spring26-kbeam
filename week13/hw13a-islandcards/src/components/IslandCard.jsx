export default function IslandCard({ name, nickname, segment, avgStay, img }) {
  return (
    <div className="note">
      <img src={img} alt={`${name} — ${nickname} island photo`} />
      <h3>
        {name} - {nickname}
      </h3>
      <p >{segment}</p>
      <p>
        Average stay: {avgStay} days
      </p>
    </div>
  );
}

// export default function IslandCard({ id, name, description, tip }) {
//   return (
//     <div className="note">
//       <h1>{name}</h1>
//       <p> {description}</p>
//       <p> {tip} </p>
//     </div>
//   );
// }
