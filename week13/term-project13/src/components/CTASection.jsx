import {useState} from "react";
import Modal from "./Modal";

export default function CTASection({email}) {
  const [isOpen, setIsOpen] = useState(false); //default => modal closed
  return (
    <section className="ctasection">
      <div className="cta-upper">
        <h3>Interested?</h3>
        <p>Start with the button below, or reach out via email.</p>
      </div>

      <div className="cta-lower">
        <button className="CTA-btn" type="button" onClick={() => setIsOpen(true)}>Book Now</button>
        <a className="cta-email" href={`mailto:${email}`}>Email</a>
      </div>

      <Modal open={isOpen} title="Book your stay with us!" onClose={()=> setIsOpen(false)}>
      <p>w.i.p. booking form / calendar embed?</p>
      </Modal>
    </section>
  );
}
