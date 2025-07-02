import express from 'express';
import cors from 'cors';
import connectDB from './services/dbService.js';


import bookingRoutes from './routes/bookingRoutes.js'


import { PORT, FRONT_URL } from './config/env.js';



// Conectar a la base de datos
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/v1/booking', bookingRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});



/*
app.use(cors({
  origin: FRONT_URL, // Cambia esto por la URL de tu frontend desde la variable de entorno
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'x-access-token'], // Headers permitidos
}));
*/
