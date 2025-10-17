// server.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import bodyParser from "body-parser";
import appointmentRouter from './routes/appointmentRoute.js';
import scheduleRouter from './routes/scheduleRoute.js';
import doctorRoute from './routes/doctorsRoute.js';
import chatRouter from './routes/chatbotRoutes.js';
import { errorHandler } from "./middlewares/errorHandler.js";
import { auditMiddleware } from "./middlewares/auditLogger.js";
import patientRoute from "./routes/patientRoute.js";

import medicalRecordRoutes from './routes/medicalRecordRoutes.js'
import vitalsRoute from './routes/vitalsRoute.js';
import staffRoutes from './routes/staffRoute.js';


// import Routes
/*import routerName from './PATH';*/

//app config
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));
app.use(bodyParser.json());

// Routes
// Morgan logger with skip
app.use(morgan('combined', {
  skip: (req) => req.url.startsWith('/inspector') || req.url.startsWith('/message')
}));

const port = process.env.PORT || 8081
// connectDB()

// Api endpoints
app.use(auditMiddleware);
app.use("/api/patients", patientRoute);
app.use(errorHandler);

//manageAppoitment Route
app.use("/api/appointment", appointmentRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/api/doctor", doctorRoute);
app.use("/api/chatbot", chatRouter);
//MedicalRecord endpoints
app.use('/api/medicalRecords', medicalRecordRoutes);
app.use('/api/vitals', vitalsRoute);
//Staff endpoints
app.use('/api/staff', staffRoutes);

app.get('/', (req, res) => {
  res.send('API Working')
})

// Start server
// Only start server if not running under Jest
if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT || 8081;
  connectDB();
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

// ✅ Export app for testing
export default app;
