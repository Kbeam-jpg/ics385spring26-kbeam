import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from "../models/User.js";

passport.use(new GoogleStrategy({
    // options: 
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    // verify:
    async (accessToken, refreshToken, profile, done) => {
        try {
            // find user, else create
            let user = await User.findOne({googleId: profile.id});
            if (!user) {
                user = await User.create({
                    googleId: profile.id,
                    email: profile.emails[0].value.toLowerCase(),
                    displayname: profile.displayName
                });
            }
            done(null, user);
        // if error, then just pass i guess?
        } catch (err) {
            done(err);
        }
    }
));

// add user object to session
passport.serializeUser((user, done => done(null, user.id)));

// grab user info from session
passport.deserializeUser(async (id, done) => {
    try {
        done(null, await User.findById(id));
    } catch (err) {
        done(err);
    }
})