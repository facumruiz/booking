import express from 'express';
import {
    createBooking,
    confirmBooking,
    rejectBooking
} from '../controllers/bookingController.js';

const router = express.Router();

router.post('/create', createBooking);
router.get('/confirm/:token', confirmBooking);
router.get('/reject/:token', rejectBooking);

export default router;
