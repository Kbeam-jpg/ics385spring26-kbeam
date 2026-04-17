/* AI Usage: 
  - for what @params types are used
  - why ... is used on new Set()
  - fixing comment for avgStay calc
*/
import { useState } from "react";
import IslandCard from "./IslandCard";

/**
 * Renders:
 * - <select> filter 
 * - avg stay stat
 * - grid of island cards
 *
 * @param {Object} props - Component props object.
 * @param {Array} props.islands - Array of island objects to display.
 * @returns {JSX.Element} Filter controls plus rendered island cards.
 * */
export default function IslandList({ islands }) {
  // set Segment to "All" as default
  const [segment, setSegment] = useState("All");

  // <IslandCard> data
  // If "All" is selected => use islands array unchanged
  // Otherwise => keep islands w/ `segment` match for current dropdown value
  const displayed =
    segment === "All" ? islands : islands.filter((i) => i.segment === segment);

  // <select> dropdown data
  // - "All" to have default option
  // - Set => remove duplicates
  // - Spread back into an array because JSX map rendering needs array iteration.
  const segments = ["All", ...new Set(islands.map((i) => i.segment))];

  // Compute the average stay for whatever is currently displayed.
  // - Guard with `displayed.length` so we do not divide by zero.
  // - Sum all avgStay values, divide by number of displayed islands.
  // - toFixed(1) formats the result to 1 decimal place for cleaner UI output.
  // - If nothing is displayed, fall back to 0.
  const avgStay = displayed.length
    ? (
        displayed.reduce((sum, i) => sum + i.avgStay, 0) / displayed.length
      ).toFixed(1)
    : 0;

  return (
    <>
      {/* dropdown updates `segment` state on option change */}
      <select onChange={(e) => setSegment(e.target.value)}>
        {segments.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      {/* Avg stay stat */}
      <p>Average stay: {avgStay} days</p>

      {/* Container for island cards */}
      <main>
      <div className="grid">
        {displayed.map((island) => (
          <IslandCard key={island.id} {...island} />
        ))}
      </div>
      </main>
    </>
  );
}
