import { Router } from 'express';
import { authRateLimiter } from '../middleware/index.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const createAuthRoutes = (controller) => {
    const router = Router();

    // Signup/Register
    router.post('/register', authRateLimiter, (req, res, next) => controller.register(req, res, next));

    // Login (with optional MFA code)
    router.post('/login', authRateLimiter, (req, res, next) => controller.login(req, res, next));

    // Logout
    router.post('/logout', (req, res, next) => controller.logout(req, res, next));

    // Email verification
    router.get('/verify-email', (req, res, next) => controller.verifyEmail(req, res, next));

    // Password reset
    router.post('/request-reset', authRateLimiter, (req, res, next) => controller.requestReset(req, res, next));
    router.post('/reset-password', authRateLimiter, (req, res, next) => controller.resetPassword(req, res, next));

    // Multi-factor authentication (requires authentication)
    router.post('/mfa/setup', requireAuth, (req, res, next) => controller.setupMfa(req, res, next));
    router.post('/mfa/enable', requireAuth, (req, res, next) => controller.enableMfa(req, res, next));
    router.post('/mfa/disable', requireAuth, (req, res, next) => controller.disableMfa(req, res, next));

    return router;
};

export default createAuthRoutes;
