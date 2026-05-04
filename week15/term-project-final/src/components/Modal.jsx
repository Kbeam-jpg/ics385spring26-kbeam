/*
Name: Kendall Beam
Assignment: Term Project 3
Description: a reusable template modal
Filename: Modal.jsx
Date: May 3 2026
*/
/**
 * Blank modal that accepts a JSX element to display
 * @param {Boolean} open - i.e. isOpen = useState(true|false)
 * @param {String} title - title that is displayed at the top of the modal
 * @param {JSX.Element} children - JSX elements for form
 * @param {Function} onClose - i.e. () => setIsOpen(false)
 * @returns {JSX.Element} modal template
 */
export default function Modal({ open, title, children, onClose }) {
    if (!open) return null;

    return (
        <div className="modal-backdrop" onClick={onClose} role="presentation">
            <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="modal-close" onClick={onClose}>x</button>
                <h3 className="modal-title">{title}</h3>
                <div className="modal-content">{children}</div>
            </div>
        </div>
    );
}