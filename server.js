import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import bodyParser from 'body-parser';

// import Routes
/*import routerName from './PATH';*/

//app config
const app = express()
app.use(cors());

//app.use(express.json());
app.use(bodyParser.json());

const port = process.env.PORT || 8081
connectDB()

// Api endpoints
/*app.use('/api/___',routerName);*/

app.get('/',(req,res)=>{
  res.send('API Working')
})

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
