/*
# Name: Kendall Beam
# Assignment: HW15a
# Description: passport.js config file (strategt, serialize, deserialize) for 'google' sign in 
# Filename: passport.js
# Date: 4/30/26 
*/

import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from "../models/User.js";

export default function initializePassport(passport) {

passport.use(new GoogleStrategy({
    // options: 
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    // verify:
    async (accessToken, refreshToken, profile, done) => {
        try { // find user
            let user = await User.findOne({googleId: profile.id});
            if (!user) { // else create one
                user = await User.create({
                    googleId: profile.id,
                    email: profile.emails[0].value.toLowerCase(),
                    displayName: profile.displayName
                });
            }
            done(null, user);
        } catch (err) {// if error, then pass on the error
            done(err);
        }
    }
));

// add user object to session
passport.serializeUser((user, done) => done(null, user.id));

// grab user info from session
passport.deserializeUser(async (id, done) => {
    try {
        done(null, await User.findById(id));
    } catch (err) {
        done(err);
    }
})
}