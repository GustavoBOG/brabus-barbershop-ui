import express from 'express';
import * as historyController from '../controllers/historyController.js';

const router = express.Router();

router.get('/:barberId', historyController.getBarberHistory);
router.get('/:barberId/daily', historyController.getDailyResumen);

export default router;
