import {useState} from 'react';
import Modal from './Modal';
import LoginForm from './LoginForm';

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
