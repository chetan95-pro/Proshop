import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';
import { NotFound, ErrorHandler } from './middleware/errorMiddleware.js';

import ProductRoutes from './routes/productRoutes.js';
import UserRoutes from './routes/userRoutes.js';
import OrderRoutes from './routes/orderRoutes.js';

const app = express();

dotenv.config();

connectDB();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running ....')
});

app.use('/api/products', ProductRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/orders', OrderRoutes);

app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))

app.use(NotFound);

app.use(ErrorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.green.bgBlack.bold));
