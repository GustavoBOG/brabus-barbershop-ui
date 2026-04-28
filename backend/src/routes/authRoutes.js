import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/profile/:userId', authController.getProfile);

export default router;
