import express from 'express';
import * as staffController from '../controllers/staffController.js';

const router = express.Router();

// Obtener todos los barberos con stats (Rango de fechas opcional ?from=...&to=...)
router.get('/', staffController.getAllStaff);

// Detalle de un barbero
router.get('/:id', staffController.getBarberById);

// Actualizar perfil (commission_rate, is_active, etc.)
router.patch('/:id', staffController.updateBarber);

// Gestión de horarios
router.get('/:barberId/schedules', staffController.getSchedules);
router.post('/:barberId/schedules', staffController.manageSchedules);

export default router;
