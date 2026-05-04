/*
Name: Kendall Beam
# Assignment: Term Project 3 
# Description: middleware for checking if signed in
# Filename: isAuthenticated.js
# Date: 5/2/26
#
# AI usage: foresight to block application/json 
*/

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns next() or 404 error or redirect
 */
export default function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next(); // user is logged in — proceed

    if (req.accepts('json')) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    res.redirect('/admin/login'); // not logged in — redirect
};