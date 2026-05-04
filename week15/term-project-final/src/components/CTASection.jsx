/*
Name: Kendall Beam
Assignment: Term Project 3
Description: houses book now button, email button, and booking modal popup
Filename: CTASection.jsx
Date: May 3 2026
*/

import {useState} from "react";
import Modal from "./Modal";

/**
 * handles useState of booking modal open/close
 * @param {String} email mailto: reference
 * @returns {JSX.Element} cta-section
 */
export default function CTASection({email}) {
  const [isOpen, setIsOpen] = useState(false); //default => modal closed
  return (
    <section className="cta-section card">
      <div className="cta-upper">
        <h3>Interested?</h3>
        <p>Book now, or reach out via email.</p>
      </div>

      <div className="cta-lower">
        <button className="cta-btn" type="button" onClick={() => setIsOpen(true)}>Book Now</button>
        <a className="cta-email" href={`mailto:${email}`}>Email</a>
      </div>

      <Modal open={isOpen} title="Book your stay with us!" onClose={()=> setIsOpen(false)}>
      <p>w.i.p. booking form / calendar embed?</p>
      </Modal>
    </section>
  );
}
