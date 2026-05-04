/*
Name: Kendall Beam
Assignment: Term Project 3
Description: Banner that cycles through different images
Filename: HeroSection.jsx
Date: May 3 2026

AI Use:
-- debugging useEffect chain
*/

import { useEffect, useState} from "react";

const ROTATE_TIMER = 30000;//ms
const FADE_TIMER = 2000;//ms

/**
 * banner that fades in new images, title text centered lower third
 * @param {String} name <h2> title
 * @param {String} island used in img alt text
 * @param {String} tagline <p> description
 * @param {Array} heroImages array of img src= /> Strings 
 * @returns {JSX.Element} hero section
 */
export default function HeroSection({ name, island, tagline, heroImages = []}) {
  const [currentIndex, setCurrentIndex] = useState(0); //for hero img rotation
  const [previousIndex, setPreviousIndex] = useState(null); // for hero img fade (default null on load)

  // Hero Image Rotation
  useEffect(() => {
    if (heroImages.length <= 1) return; // catch 1 or 0 element arrays

    const rotateId = setInterval(() => {
      setCurrentIndex((prev) => {
        setPreviousIndex(prev);
        return (prev + 1) % heroImages.length;
      });
    }, ROTATE_TIMER);

    return () => clearInterval(rotateId);
  }, [heroImages]);

  // Hero Image Fade transition
  useEffect(() => {
    if (previousIndex === null) return; //do nothing until first rotate

    const cleanupId = setTimeout(() => {
      setPreviousIndex(null);
    }, FADE_TIMER);

    return () => clearTimeout(cleanupId);
  }, [previousIndex]);

  const currentImage = heroImages[currentIndex] || "https://picsum.photos/300/200?random=1";

  return (
    <section className="hero" aria-label={name + " hero image"}>

      {/* div for current image, previous image */}
      <div className="hero-media">
        {previousIndex !== null && (
          <img
            className="hero-image hero-image--previous"
            src={heroImages[previousIndex]}
            alt=""
            aria-hidden="true"
          />
        )}
        <img
          key={currentIndex}
          className="hero-image hero-image--current"
          src={currentImage}
          alt={name + " on " + island}
        />
      </div>

      <div className="hero-overlay">
        <div className="hero-copy">
          <h2>{name}</h2>
          <p>{tagline}</p>
        </div>
      </div>
    </section>
  );
}
