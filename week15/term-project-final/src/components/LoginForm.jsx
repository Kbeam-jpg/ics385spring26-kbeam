/*
Name: Kendall Beam
Assignment: Term Project 3
Description: login form component for both google sign in and email + password
Filename: LoginForm.jsx
Date: May 3 2026

AI Use:
-- **Generated** with very specific instructions for quickness
*/

import { useState } from 'react';
/**
 * 
 * @param {Function} onSuccess prop, what to do when done, e.g.  () => setShowLogin(false) 
 * @returns {JSX.Element} centered image, google sign in button, email and password fields w/ submit
 */
export default function LoginForm( { onSuccess }) {
    const [formData, setFormData] = useState({email: '', password: ''});
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // update variables as form fields change
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(''); //clear error when typing
    }

    // makes post request to /admin/login, if good => reload page
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // make request to login
            const response = await fetch('/admin/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'
                    //  ...(csrfToken ? {'X-CSRF-Token': csrfToken} : {})
                },
                body: JSON.stringify(formData),
                credentials: 'include', // send session cookies
            });

            const data = await response.json();

            if (response.ok) {
                onSuccess?.();
                window.location.reload();
            } else {
                setError(data.error || 'Login failed');
            }

        } catch (err) {
            console.error(err);
            setError('Error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <div className="google-signin-wrapper">
                <a href="/admin/google" className="google-signin" >Sign in with Google</a>
            </div>
            <form onSubmit={handleSubmit}>
                <input 
                    type='email'
                    name="email"
                    placeholder='email@example.com'
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete='email'
                    required
                />
                <input
                    type='password'
                    name="password"
                    placeholder='password1234'
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete='current-password'
                    required
                />
                <button type='submit' disabled={isLoading}>
                    {isLoading ? 'Logging in' : 'Login'}
                </button>
            </form>
            {/* <a href=''> place to register? </a> */}
        </div>
    )
}