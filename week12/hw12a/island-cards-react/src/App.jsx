import "./styles.css";
import IslandCard from "./components/IslandCard";

const islands = [
  {
    id: 1,
    name: "Maui",
    description: "Known as the Valley Isle, famous for Road to Hana and Haleakala.",
    tip: "Visit Haleakala crater at sunrise — arrive 30 min early.",
  },
  {
    id: 2,
    name: "Oahu",
    description: "Home to Honolulu, Waikiki Beach, and Pearl Harbor.",
    tip: "Take the bus — it covers the entire island and is very affordable.",
  },
  {
    id: 3,
    name: "Kauai",
    description: "The Garden Isle, renowned for Na Pali Coast and Waimea Canyon.",
    tip: "Rent a kayak to reach Honopu Beach — no other access is permitted.",
  },
];

export default function App() {
  return (
    <div>
      {islands.map((island) => (
        <IslandCard key={island.id} {...island} />
      ))}
    </div>
  );
}

// export default function App() {
//   return (
//     <div className="App">
//       <h1>Hello CodeSandbox</h1>
//       <h2>Start editing to see some magic happen!</h2>
//     </div>
//   );
// }
