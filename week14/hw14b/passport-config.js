/* INFO
NAME: Kendall Beam
ASSIGNMENT: Week 14 - Assignment 14b - Web App with Username/Pwd Security
GOAL: use a local strategy from passport.js to handle authen/author
FILENAME: passport-config.js
DATE: 4/21/2026

*/

import { Strategy as LocalStrategy } from 'passport-local';
import User from "./models/user.js";

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
