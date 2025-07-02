// controllers/bookingController.js
import Booking from '../models/bookingModel.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Configurar transporte de nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Crear un nuevo turno
const createBooking = async (req, res) => {

    try {
        const { user, fullName, email, reason, date, time } = req.body;

        // Crear token único para confirmar/rechazar turno
        const confirmationToken = crypto.randomBytes(32).toString('hex');

        const newBooking = new Booking({
            user,
            fullName,
            email,
            reason,
            date,
            time,
            confirmationToken,
        });

        await newBooking.save();

        // URL de confirmación y rechazo
        const confirmUrl = `${process.env.FRONT_URL}/booking/confirm/${confirmationToken}`;
        const rejectUrl = `${process.env.FRONT_URL}/booking/reject/${confirmationToken}`;

        // Enviar correo al dueño (admin)
        await transporter.sendMail({
            from: '"Turnero" <miapp@example.com>',
            to: `${email}, ${process.env.ADMIN_EMAIL}`,// mail del dueño
            subject: 'Nuevo turno pendiente de confirmación',
            html: `
                <h3>Nuevo turno solicitado</h3>
                <p><strong>Nombre:</strong> ${fullName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Motivo:</strong> ${reason}</p>
                <p><strong>Fecha:</strong> ${date}</p>
                <p><strong>Hora:</strong> ${time}</p>
                <p>
                    <a href="${confirmUrl}">✅ Confirmar turno</a><br>
                    <a href="${rejectUrl}">❌ Rechazar turno</a>
                </p>
            `,
        });

        res.status(201).json({ message: 'Turno creado y pendiente de confirmación' });

    } catch (err) {
        res.status(500).json({ message: 'Error al crear el turno', error: err.message });
    }
};



// Confirmar turno
const confirmBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({ confirmationToken: req.params.token });
        if (!booking) return res.status(404).json({ message: 'Token inválido' });

        booking.status = 'confirmed';
        booking.confirmationToken = undefined;
        await booking.save();

        res.send('<h2>✅ Turno confirmado con éxito</h2>');
    } catch (err) {
        res.status(500).json({ message: 'Error al confirmar turno', error: err.message });
    }
};

// Rechazar turno
const rejectBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({ confirmationToken: req.params.token });
        if (!booking) return res.status(404).json({ message: 'Token inválido' });

        booking.status = 'rejected';
        booking.confirmationToken = undefined;
        await booking.save();

        res.send('<h2>❌ Turno rechazado</h2>');
    } catch (err) {
        res.status(500).json({ message: 'Error al rechazar turno', error: err.message });
    }
};

export { createBooking, confirmBooking, rejectBooking };
