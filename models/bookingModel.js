import mongoose from 'mongoose';

const { Schema } = mongoose;

const bookingSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fullName: {
        type: String,
        required: [true, 'El nombre completo es obligatorio'],
        minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
        maxlength: [100, 'El nombre no puede exceder los 100 caracteres'],
    },
    reason: {
        type: String,
        required: [true, 'El motivo del turno es obligatorio'],
        maxlength: [200, 'El motivo no puede exceder los 200 caracteres'],
    },
    date: {
        type: Date,
        required: [true, 'La fecha del turno es obligatoria'],
    },
    time: {
        type: String,
        required: [true, 'La hora del turno es obligatoria'],
        match: [/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:MM)'],
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending',
    },
    notes: {
        type: String,
        maxlength: [300, 'Las notas no pueden exceder los 300 caracteres'],
    }
}, {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
