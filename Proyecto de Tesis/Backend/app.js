const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
//const routes = require('./routes');
//const errorHandler = require('./middleware/errorHandler'); // crear después

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

//app.use('/api', routes);

// Error global
//app.use(errorHandler);
const authRoutes = require('./routers/auth');
app.use('/api', authRoutes);

const userRoutes = require('./routers/users');
app.use('/api', userRoutes);

const ticketsRouter = require('./routers/tickets');
app.use('/api/tickets', ticketsRouter);
app.use('/api', ticketsRouter);

const adminRoutes = require('./routers/admin');
app.use('/api/admin', adminRoutes);


module.exports = app;