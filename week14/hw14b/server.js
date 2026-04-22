/* INFO
NAME: Kendall Beam
ASSIGNMENT: Week 14 - Assignment 14b - Web App with Username/Pwd Security
GOAL: manage a login session w/ passport. register, login, profile, and logout routes
FILENAME: server.js (backend)
DATE: 4/21/2026

AI use: scaffolding server.js w/ instructions
*/


/**
 * imports
 */
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import initPassport from './passport-config.js';
import User from './models/user.js';

/**
 * initialize process.env variables
 */
import 'dotenv/config';
const PORT = process.env.PORT || 3000;

/**
 * initialize express
 */
const app = express();
app.use(express.urlencoded({ extended: true })); // for HTML
app.use(express.json()); // for JSON req/res


/*--middleware--*/
/**
 * session middleware
 */
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // only save session if known user
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI}),
    cookie: {secure: false} // <= set to true if using HTTPS
}));

/**
 * initialize passport
 */
initPassport(passport);
app.use(passport.initialize());
app.use(passport.session());
/*--middleware--*/

/*--routes--*/
// GET / — redirect to /profile if authenticated, else redirect to /login
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/profile');
    } else {
        res.redirect('/login');
    }
});

// GET /register
// render a simple HTML form with email and password fields.
app.get('/register', (req, res) => {
    res.send(`
        <h1>Register</h1>
        <form method="POST" action="/register">
            <input type="email" name="email" placeholder="New Email" required />
            <input type="password" name="password" placeholder="New Password" required />
            <button type="submit">Register</button>
        </form>
    `);
});

// POST /register
// create a new User document 
// --- pswd salted in schema.pre()
// redirect to /login.
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        await User.create({ email, password });
        res.redirect('/login');
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Error registering user'});
    }
});

// //GET /login
// the login form
// If already authenticated => redirect to /profile
app.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/profile');
    } else {
        // will call POST /login
        res.send(`
            <h1>Login</h1>
            <form method="POST" action="/login">
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
            <a href="/register">Register</a>
        `);
    }
});

// POST /login
// call passport.authenticate 'local' 
// successRedirect => /profile 
// failureRedirect => /login'
app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    // failureMessage: true, //i think this is where an error message would go?
}));

// GET /profile
// protected route (isAuthenticated middleware
// display logged-in user's email and role
app.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`
            <h1>Profile</h1>
            <p>Email: ${req.user.email}</p>
            <p>Role: ${req.user.role}</p>
            <a href="/logout">Logout</a>
        `);
    } else {
        res.redirect('/login');
    }
});

// GET /logout
// call req.logout() and redirect to /login.
app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/login');
    });
});
/*--routes--*/

/**
 * get to runnin
 */
async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongodb connected");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('mongodb connection error:', err.message);
        process.exit(1);
    }
}
startServer();