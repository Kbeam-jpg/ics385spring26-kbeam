/*
Name: Kendall Beam
Assignment: Term Project 3
Description: Footer that is sticky to bottom of screen, handles login text and login modal
Filename: Footer.jsx
Date: May 3 2026
*/

import {useState} from 'react';
import Modal from './Modal';
import LoginForm from './LoginForm';

/**
 * Handles Modal/> that houses LoginForm/>
 * @returns {JSX.Element} site-footer
 */
export default function Footer() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <footer className="site-footer">
      <p>@kbeam-jpg {new Date().getFullYear()}</p>
      <a
        href="#"
        className="footer-login"
        onClick={(e) => { e.preventDefault(); setShowLogin(true); }}
      >
        Login
      </a>

      <Modal open={showLogin} title="Login" onClose={() => setShowLogin(false)}>
        <img src="https://picsum.photos/300/200?random=1" alt="" />
        <LoginForm onSuccess={() => setShowLogin(false)} />
      </Modal>
    </footer>
  );
}
