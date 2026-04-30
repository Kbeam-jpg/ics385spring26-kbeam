/*
# Name: Kendall Beam
# Assignment: HW15a
# Description: exportable function to call req.isAuthenticated() after passport attaches function to requests
# Filename: ensureAuth.js
# Date: 4/30/26 
*/

export default function ensureAuthenticated(req, res, next) {
    // if good => keep going
    if (req.isAuthenticated()) return next();
    // else => close the chain
    return res.redirect('/');
};