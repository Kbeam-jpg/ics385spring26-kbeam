/*
Name: Kendall Beam
Assignment: Term Project 3
Description: about section tile
Filename: AboutSection.jsx
Date: May 3 2026
*/

/**
 * A centered image left, a title and description on the right
 * @param {String} description <p> text to display
 * @param {String} title <h3> text to display
 * @param {String} image <img> src= location
 * @returns {JSX.Element} 
 */
export default function AboutSection({ description, title, image}) {
  return (
    <section className="about card">
      <img className="about-img" src={image} alt={"placeholder"} />
      <div className="about-text">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </section>
  );
}
