import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import bodyParser from 'body-parser';
import { errorHandler } from './middlewares/errorHandler.js';
import { auditMiddleware } from './middlewares/auditLogger.js';
import patientRoute from './routes/patientRoute.js'
import medicalRecordRoutes from './routes/medicalRecordRoutes.js'
import vitalsRoute from './routes/vitalsRoute.js';

// import Routes
/*import routerName from './PATH';*/

//app config
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
// app.use(morgan('combined'));

//app.use(express.json());
app.use(bodyParser.json());

// Morgan logger with skip
app.use(morgan('combined', {
  skip: (req) => req.url.startsWith('/inspector') || req.url.startsWith('/message')
}));

const port = process.env.PORT || 8081
connectDB()

// Api endpoints
app.use(auditMiddleware);
app.use('/api/patients', patientRoute);
// global error handler
app.use(errorHandler);

//MedicalRecord endpoints
app.use('/api/medicalRecords', medicalRecordRoutes);
app.use('/api/vitals', vitalsRoute);

app.get('/',(req,res)=>{
  res.send('API Working')
})

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});

// ✅ Export app for testing
export default app;