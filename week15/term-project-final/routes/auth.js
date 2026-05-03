import express from 'express';
import passport from 'passport';
import User from '../models/User.js';

const router = express.Router();

// GET /login
// the login form
// If already authenticated => redirect to admin dashboard
router.get('/login', (req, res) => {
    // is auth => go to dashboard
    if (req.isAuthenticated()) {
    return res.redirect('/admin/dashboard');
    }
    // 
    return res.json({message: "ERROR #2, see changelog"})
});

// POST /login
// call passport.authenticate 'local' for now
// if failed auth, error handling for passport
// POST /login -> authenticate and redirect to dashboard on success
router.post('/login', (req, res, next) => {
    // Input validation: email and password must be strings
    const { email, password } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }
    if (!password || typeof password !== 'string' || password.length < 1) {
      return res.status(400).json({ error: 'Password required' });
    }
    
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
        return res.redirect('/admin/dashboard');
      });
    })(req, res, next);
  }
);

// POST /register 
// -> create a local user and redirect to dashboard
router.post('/register', async (req, res, next) => {
    // Input validation: email and password must be strings
    const { email, password } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    
    try {
      const existing = await User.findOne({ email });
      if (existing) return res.status(409).json({ error: 'User exists' });
      const user = await User.create({ email, password, provider: 'local' });
      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.redirect('/admin/dashboard');
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /logout
// call req.logout() and redirect to /login.
// POST /logout: log the user out and redirect to login
router.post('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.session.destroy((destroyErr) => {
          if (destroyErr) return next(destroyErr);
          res.clearCookie('connect.sid');
          return res.redirect('/');
        });
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

/**--google */
// GET /google
// Google OAuth sign-in entry point
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// GET /google/callback
// Google OAuth callback return route
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/admin/login',
  failureMessage: true
}), (req, res) => {
  // Generated fix: use request's origin as url to return to
  const FRONTEND_URL = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
  return res.redirect(`${FRONTEND_URL}`);
});
/**--google */


// Test-only route to simulate Google OAuth callback
if (process.env.NODE_ENV === 'test') {
  router.post('/google/test-callback', async (req, res, next) => {
    try {
      const { googleId, email, displayName } = req.body;
      let user = await User.findOne({ googleId });
      if (!user) {
        user = await User.create({
          googleId,
          email,
          displayName,
          provider: 'google'
        });
      }

      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.redirect('/admin/dashboard');
      });
    } catch (err) {
      next(err);
    }
  });
}

export default router;