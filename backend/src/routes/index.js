import express from 'express';
import authRoutes from './authRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import shiftRoutes from './shiftRoutes.js';
import workRecordRoutes from './workRecordRoutes.js';
import historyRoutes from './historyRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/shifts', shiftRoutes);
router.use('/work-records', workRecordRoutes);
router.use('/history', historyRoutes);

export default router;
