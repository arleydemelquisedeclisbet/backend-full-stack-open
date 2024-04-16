import mongoose from 'mongoose';
import { error as loggerError, info } from '../utils/logger';

mongoose.set('strictQuery', false);

try {
    await mongoose.connect(process.env.MONGODB_URI);
    info('Conectado a MongoDB');
} catch (error) {
    loggerError('No se pudo conectar a la base de datos: ', error);
    process.exit(1);
}

export default mongoose