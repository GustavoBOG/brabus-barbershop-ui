import express from 'express';
import * as workRecordController from '../controllers/workRecordController.js';

const router = express.Router();

router.post('/', workRecordController.createWorkRecord);

export default router;
