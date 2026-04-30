export default function ensureAuthenticated(req, res, next) {
    // if good => keep going
    if (req.isAuthenticated()) return next();
    // else => close the chain
    return res.redirect('/');
};