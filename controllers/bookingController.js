// controllers/bookingController.js
import {
    createBooking as create,
    confirmBooking as confirm,
    rejectBooking as reject
} from '../core/bookingService.js';

import { sendBookingEmail } from '../channels/email/emailNotifier.js';
import { sendBookingWhatsapp } from '../channels/whatsapp/whatsappNotifier.js';

const createBooking = async (req, res) => {
    try {
        const { user, fullName, email, reason, date, time } = req.body;

        const { booking, confirmationToken } = await create({
            user, fullName, email, reason, date, time,
        });

        // Enviar notificaciones
        await sendBookingEmail({ booking, confirmationToken });
        await sendBookingWhatsapp({ booking, confirmationToken }); // << AGREGADO

        res.status(201).json({ message: 'Turno creado y pendiente de confirmación' });

    } catch (err) {
        res.status(500).json({ message: 'Error al crear el turno', error: err.message });
    }
};

const confirmBooking = async (req, res) => {
    try {
        const booking = await confirm(req.params.token);
        if (!booking) return res.status(404).json({ message: 'Token inválido' });

        res.send('<h2>✅ Turno confirmado con éxito</h2>');
    } catch (err) {
        res.status(500).json({ message: 'Error al confirmar turno', error: err.message });
    }
};

const rejectBooking = async (req, res) => {
    try {
        const booking = await reject(req.params.token);
        if (!booking) return res.status(404).json({ message: 'Token inválido' });

        res.send('<h2>❌ Turno rechazado</h2>');
    } catch (err) {
        res.status(500).json({ message: 'Error al rechazar turno', error: err.message });
    }
};

export { createBooking, confirmBooking, rejectBooking };
