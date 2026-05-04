/*
Name: Kendall Beam
# Assignment: Term Project 3 
# Description: middleware for checking if role == 'admin', for displaying admin dashboard
# Filename: isAdmin.js
# Date: 5/2/26

#
# AI usage: debugging status codes
*/

/**
 * Checks passport's isAuthentifated, redirects if role != admin
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export default function isAdmin(req, res, next) {
    if (!req.isAuthenticated()) {
        if (req.accepts('json')) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        
        return res.redirect('/admin/login');
    }

    if (req.user?.role !== 'admin') {
        if (req.accepts('json')) {
            return res.status(403).json({ error: 'Admin access required' });
        }

        return res.status(403).send('Admin access required');
    }

    return next();
}