/*
# Name: Kendall Beam
# Assignment: HW15a
# Description: simple google Oauth sign in through an express server + passport + session + db
# Filename: app.js (main backend)
# Date: 4/30/26 
*/

import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import passport from 'passport';
import initializePassport from './config/passport.js'; //passport config
import ensureAuth from './middleware/ensureAuth.js';
import authRouter from './routes/auth.js'; //express router for auth route

const app = express();
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3000;


/*---middleware---*/
/**
 * express session middleware
 * all requests pass through this function
 */
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // dont save again if unchanged
    saveUninitialized: false, // dont create blank sessions
    store: MongoStore.create({ // store in MongoDB instead of in RAM
        mongoUrl: process.env.MONGO_URI,
        ttl: 7 * 24 * 60 * 60 // 7 days
    }),
    cookie: { //what gets sent to user browser
        httpOnly: true, // stop user-side cookie access
        secure: process.env.NODE_ENV === 'production', //for https, will be false if NODE_ENV is anthing other than 'production'
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }
}));
/**
 * passport session middleware
 */
initializePassport(passport); // load passport config
app.use(passport.initialize()); // add passport information to req
app.use(passport.session()); // keep auth throughout session
/*---middleware---*/

/*---routes---*/
/**
 * base route
 */
app.get('/', 
    (req, res) => res.render('home', {user: req.user }));

/**
 * profile route
 */
app.get('/profile', ensureAuth, 
    (req, res) => res.render('profile', {user: req.user}));

/**
 * auth route
 */
app.use('/auth', authRouter);

/**
 * logout route
 */
app.post('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.session.destroy(() => res.redirect('/'));
    });
});
/*---routes---*/

/**
 * get to runnin
 */
async function startServer() {
    try {
        mongoose.connect(process.env.MONGO_URI).then(
            () => console.log(`Connected to MongoDB at ${process.env.MONGO_URI}`));

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('MongoDB connection error', err, err.message);
        process.exit(1);
    }
}
startServer();