// server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import bodyParser from 'body-parser';
import { errorHandler } from './middlewares/errorHandler.js';
import { auditMiddleware } from './middlewares/auditLogger.js';
import patientRoute from './routes/patientRoute.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));
app.use(bodyParser.json());

// Routes
app.use(auditMiddleware);
app.use('/api/patients', patientRoute);
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('API Working');
});

// Only start server if not running under Jest
if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 8081;
  connectDB();
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

// ✅ Export app for testing
export default app;
