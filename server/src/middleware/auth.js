import { verifyToken, generateGuestSessionId } from '../utils/token.js';
import { User } from '../models/User.js';

export async function authenticate(req, res, next) {
  try {
    let token = null;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = verifyToken(token);
      if (decoded && decoded.id) {
        const user = await User.findById(decoded.id);
        if (user) {
          req.user = user;
        }
      }
    }
  } catch (err) {
    // Silently continue to next; if route requires auth, requireAuth will trigger
  }
  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication is required to access this resource.',
      code: 'UNAUTHORIZED',
    });
  }
  next();
}

export function sessionContext(req, res, next) {
  // If user is already authenticated, that takes precedence
  if (req.user) {
    return next();
  }

  // Otherwise resolve or assign guest session ID
  let guestSessionId = req.cookies?.guestSessionId || req.headers['x-guest-session-id'];
  if (!guestSessionId) {
    guestSessionId = generateGuestSessionId();
    res.cookie('guestSessionId', guestSessionId, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }

  req.guestSessionId = guestSessionId;
  res.setHeader('x-guest-session-id', guestSessionId);
  next();
}
