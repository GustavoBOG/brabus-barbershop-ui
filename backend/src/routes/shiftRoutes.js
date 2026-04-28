import express from 'express';
import * as shiftController from '../controllers/shiftController.js';
import * as workRecordController from '../controllers/workRecordController.js';

const router = express.Router();

router.get('/active/:barberId', shiftController.getActiveShift);
router.post('/start', shiftController.startShift);
router.patch('/:id/status', shiftController.updateShiftStatus);
router.get('/:shiftId/stats', shiftController.getShiftStats);
router.get('/:shiftId/records', workRecordController.getRecordsByShift);

export default router;
