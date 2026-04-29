// middleware/isAuthenticated.js
// Apply this middleware to any route that should only be accessible when logged in.
export default function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next(); // user is logged in — proceed

    if (req.accepts('json')) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    res.redirect('/admin/login'); // not logged in — redirect
};