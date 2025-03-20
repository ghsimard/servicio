import { registerAs } from '@nestjs/config';
import { PORTS } from '../../../config/ports';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT || PORTS.BACKEND.toString(), 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
})); 