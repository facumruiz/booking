// channels/email/emailNotifier.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendBookingEmail = async ({ booking, confirmationToken }) => {
    const { fullName, email, reason, date, time } = booking;

    const confirmUrl = `${process.env.FRONT_URL}/booking/confirm/${confirmationToken}`;
    const rejectUrl = `${process.env.FRONT_URL}/booking/reject/${confirmationToken}`;

    try {
        await transporter.sendMail({
            from: '"Turnero" <miapp@example.com>',
            to: `${email}, ${process.env.ADMIN_EMAIL}`,
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

        console.log(`📧 Email enviado correctamente a ${email} y ${process.env.ADMIN_EMAIL}`);
    } catch (error) {
        console.error('❌ Error al enviar el email:', error.message);
    }
};

export { sendBookingEmail };
