import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/config';
import authRoutes from './routes/auth.routes';
import personaRoutes from './routes/persona.routes';
import productoRoutes from './routes/producto.routes';
import servicioRoutes from './routes/servicio.routes';
import presupuestoRoutes from './routes/presupuesto.routes';
import facturaRoutes from './routes/factura.routes';
import impuestoRoutes from './routes/impuesto.routes';

const app = express();

// Middlewares
app.use(cors(config.cors));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/presupuestos', presupuestoRoutes);
app.use('/api/facturas', facturaRoutes);
app.use('/api/impuestos', impuestoRoutes);

// Error handling
import { errorHandler } from './middleware/error';
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Servidor corriendo en el puerto ${config.port}`);
});
