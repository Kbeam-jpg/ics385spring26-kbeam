import "./styles.css";
import IslandList from "./components/IslandList";

// hardcoded list of island data for cards
const islands = [
  {
    id: 1,
    name: "Maui",
    nickname: "Valley Isle",
    segment: "Honeymoon",
    avgStay: 6.2,
    img: "https://picsum.photos/300/200?random=1",
  },
  {
    id: 2,
    name: "O'ahu",
    nickname: "Gathering Place",
    segment: "First-time",
    avgStay: 4.8,
    img: "https://picsum.photos/300/200?random=2",
  },
  {
    id: 3,
    name: "Kaua'i",
    nickname: "Garden Isle",
    segment: "Eco-tourist",
    avgStay: 7.1,
    img: "https://picsum.photos/300/200?random=3",
  },
  {
    id: 4,
    name: "Hawai'i",
    nickname: "Big Island",
    segment: "Adventure",
    avgStay: 8.3,
    img: "https://picsum.photos/300/200?random=4",
  },
  {
    id: 5,
    name: "Lanai",
    nickname: "Manele Bay",
    segment: "Leisure",
    avgStay: 5.6,
    img: "https://picsum.photos/300/200?random=5",
  },
];

export default function App() {
  return <IslandList islands={islands} />;
}

// export default function App() {
//   return (
//     <div className="App">
//       <h1>Hello CodeSandbox</h1>
//       <h2>Start editing to see some magic happen!</h2>
//     </div>
//      {islands.map((island) => (
//        <IslandCard key={island.id} {...island} />
//      ))} */
//   );
// }
