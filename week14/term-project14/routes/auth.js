import express from 'express';
import passport from 'passport';

const router = express.Router();

// router.get('/', async (req, res) => {
// });

// //GET /login
// the login form
// If already authenticated => redirect to /profile
router.get('/login', (req, res) => {
    // is auth => go to dashboard
    if (req.isAuthenticated()) {
    return res.redirect('/admin/dashboard');
    }

    return res.json({message: "ERROR #2"})
});

// POST /login
// call passport.authenticate 'local' for now
// if failed auth, error handling for passport
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    if (!user) {
      return res.status(401).json({ error: info?.message || 'Invalid credentials' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Login error' });
      }
      return res.json({ success: true });
    });
  })(req, res, next);
});

// GET /logout
// call req.logout() and redirect to /login.
router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
    res.redirect('/admin/login');
    });
});

// GET /status
// Returns authentication status and user info
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      isAuthenticated: true,
      user: {
        email: req.user.email,
        role: req.user.role
      }
    });
  }

  return res.json({
    isAuthenticated: false,
    user: null
  });
});

export default router;