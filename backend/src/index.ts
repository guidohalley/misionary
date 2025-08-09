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
import monedaRoutes from './routes/moneda.routes';
import historialPrecioRoutes from './routes/historialPrecio.routes';
import empresaRoutes from './routes/empresa.routes';
import { gastoRoutes } from './routes/gasto.routes';
import healthRoutes from './routes/health.routes';

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
app.use('/api/monedas', monedaRoutes);
app.use('/api/historial-precios', historialPrecioRoutes);
app.use('/api/empresas', empresaRoutes);
app.use('/api/gastos-operativos', gastoRoutes);
app.use('/api/health', healthRoutes);

// Error handling
import { errorHandler } from './middleware/error';
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Servidor corriendo en el puerto ${config.port}`);
});
