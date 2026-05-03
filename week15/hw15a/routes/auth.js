/*
# Name: Kendall Beam
# Assignment: HW15a
# Description: router export for /auth routes, authenticate through passport
# Filename: auth.js
# Date: 4/30/26 
*/


import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] }));

    
router.get('/google/callback',
    passport.authenticate('google', {failureRedirect: '/'}),
    (req, res) => res.redirect('/profile'));

export default router;

