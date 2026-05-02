import {useState} from 'react';
import Modal from './Modal';
import LoginForm from './LoginForm';

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <header>
      <h1>Hilo vacation rental</h1>

      <button type="button" onClick={() => setShowLogin(true)}>
        Login</button>

      <Modal open={showLogin} title="Login" onClose={() => setShowLogin(false)}>
        <img src="https://picsum.photos/300/200?random=1"/>
        <LoginForm onSuccess={() => setShowLogin(false)}/>
      </Modal>
    </header>
  );
}
