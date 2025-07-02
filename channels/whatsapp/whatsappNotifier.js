// channels/whatsapp/whatsappNotifier.js
import twilio from 'twilio';

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const sendBookingWhatsapp = async ({ booking, confirmationToken }) => {
    const { fullName, reason, date, time } = booking;

    const confirmUrl = `${process.env.FRONT_URL}/booking/confirm/${confirmationToken}`;
    const rejectUrl = `${process.env.FRONT_URL}/booking/reject/${confirmationToken}`;

    const message = `
📅 New Booking Request

👤 Name: ${fullName}
📝 Reason: ${reason}
📆 Date: ${date}
⏰ Time: ${time}

✅ Confirm: ${confirmUrl}
❌ Reject: ${rejectUrl}
`;

    try {
        await client.messages.create({
            body: message,
            from: process.env.TWILIO_WHATSAPP_FROM,
            to: process.env.ADMIN_WHATSAPP_TO,
        });
        console.log('📲 WhatsApp message sent!');
    } catch (error) {
        console.error('❌ Error sending WhatsApp message:', error.message);
    }
};

export { sendBookingWhatsapp };
