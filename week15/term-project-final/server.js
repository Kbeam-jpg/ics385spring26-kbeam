/*
# Name: Kendall Beam
# Assignment: Term Project 3 wk14
# Description: express.js server for routes / api / admin
# Filename: server.js (main backend)
# Date: 4/26/26 
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
import User from './models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

// SPA fallback
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// routers
import propertiesRouter from './routes/properties.js'; 
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';

/**
 * initialize process.env variables
 */
import 'dotenv/config';
const PORT = process.env.PORT || 3000;

/**
 * initialize express
 */
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*--middleware--*/
/**
 * session middleware
 */
app.use(session({
    secret: process.env.SESSION_SECRET || 'test-session-secret',
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // only save session if known user
    // Use in-memory store for tests to avoid external Mongo dependency
    store: process.env.NODE_ENV === 'test'
        ? new session.MemoryStore()
        : MongoStore.create({ mongoUrl: process.env.MONGO_URI}),
    cookie: {secure: false} // <= set to true if switching to HTTPS
}));
/**
 * initialize passport
 */
initPassport(passport);
app.use(passport.initialize());
app.use(passport.session());
/*--middleware--*/



/*--routes--*/
// make / route a test to check functionality for React? admin dashboard?
app.get('/', (req, res) => {
    res.status(200).json({message: 'Api is good'});
});

// api routes
app.use('/admin', adminRouter);
app.use('/admin', authRouter);
app.use('/api/properties', propertiesRouter);//({
/*
GET properties/?op=&rating= or /?gte= or /?lte=
    // Grabs all property doc info, returns JSON array or render
    -- if text/html => res.status(200).render('properties', { properties })
    -- if application/json => res.status(200).json(properties)
        -- filter: ?op=&rating= or ?gte= or ?lte=

GET properties/:id
    // find based on id, return single property
    => res.status(200).json(property);

POST properties/:id/reviews
    // if id exists, push json body (review obj) to property.reviews[]
    => res.status(201).json(property);
*///})

// /**
//  * serve static files from dist folder (built React app)
//  */
// app.use(express.static(path.join(__dirname, 'dist')));

// /**
//  * SPA fallback - serve index.html for all unmatched routes
//  * This allows React Router to handle client-side navigation
//  */
// app.use((req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

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

// Export the app for testing. Only start the server when not running tests.
export default app;

if (process.env.NODE_ENV !== 'test') {
    startServer();
}