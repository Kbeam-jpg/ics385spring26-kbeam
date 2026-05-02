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