import express from 'express';
import * as serviceController from '../controllers/serviceController.js';

const router = express.Router();

router.get('/', serviceController.getServices);
router.post('/', serviceController.createService);
router.patch('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

export default router;
