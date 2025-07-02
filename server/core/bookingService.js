// core/bookingService.js
import Booking from '../models/bookingModel.js';
import crypto from 'crypto';

const createBooking = async ({ user, fullName, email, reason, date, time }) => {
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

    return { booking: newBooking, confirmationToken };
};

const confirmBooking = async (token) => {
    const booking = await Booking.findOne({ confirmationToken: token });
    if (!booking) return null;

    booking.status = 'confirmed';
    booking.confirmationToken = undefined;
    await booking.save();

    return booking;
};

const rejectBooking = async (token) => {
    const booking = await Booking.findOne({ confirmationToken: token });
    if (!booking) return null;

    booking.status = 'rejected';
    booking.confirmationToken = undefined;
    await booking.save();

    return booking;
};

export { createBooking, confirmBooking, rejectBooking };
