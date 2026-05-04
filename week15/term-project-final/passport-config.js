/* INFO
NAME: Kendall Beam
ASSIGNMENT: Week 14 - Assignment 14b - Web App with Username/Pwd Security
GOAL: use a local strategy from passport.js to handle authen/author
FILENAME: passport-config.js
DATE: 4/21/2026
*/

import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from "./models/User.js";

export default function initializePassport(passport) {

/**
 * @override for username, finding a user
 */
passport.use(new LocalStrategy(
    {usernameField: 'email'},
    async (email, password, done) => {
        try {
            // find user by email PK
            const user = await User.findOne({email});
            // (if user === null) -> return 
            if (!user) return done(null, false, {message: 'Email not found'});

            // if found
            const match = await user.comparePassword(password);
            // if bad match -> return
            if (!match) return done(null, false, {message: 'Incorrect password'});

            // if good
            return done(null, user); //pass user object back

        } catch (err) {
            return done(err); // if error -> pass error object back
        }
    }
));

/**
 * only use google strategy if configured in .env
 */
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
passport.use(new GoogleStrategy({
    // options: 
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/admin/google/callback',
    scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // 1. Try to find user by their Google sub-ID.
            let user = await User.findOne({ googleId: profile.id });
            if (user) return done(null, user);

            // 2. Otherwise, link by email if a local account already exists.
            const email = profile.emails[0].value.toLowerCase();
            user = await User.findOne({ email });
            if (user) {
                user.googleId = profile.id;
                user.provider = 'google';
                await user.save();
                return done(null, user);
            }

            // 3. Otherwise, provision a new user.
            user = await User.create({
                email,
                displayName: profile.displayName,
                googleId: profile.id,
                provider: 'google'
            });
            return done(null, user);

        } catch (err) {
            return done(err);
        }
    }
));
}

/**
 * store user_id in session cookie for continue
 * store user.id
 */
passport.serializeUser((user, done) => done(null, user.id));

/**
 * deserialize user on every authenticated request
 * retrieve by user id
 */
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);

    } catch (err) {
        done(err);
    }
})
}
