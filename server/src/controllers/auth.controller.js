import { User } from '../models/User.js';
import { generateToken } from '../utils/token.js';
import { AppError } from '../middleware/errorHandler.js';

function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError('An account with this email address already exists.', 409, 'EMAIL_EXISTS');
    }

    const user = await User.create({
      name,
      email,
      passwordHash: password,
    });

    const token = generateToken(user);
    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Account successfully registered.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    const token = generateToken(user);
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  res.clearCookie('token');
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
}

export async function getMe(req, res) {
  res.status(200).json({
    success: true,
    user: req.user
      ? {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          avatar: req.user.avatar,
        }
      : null,
    guestSessionId: req.guestSessionId || null,
  });
}
