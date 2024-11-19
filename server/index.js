import express from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {residencyRoute} from './routes/residencyRoute.js'
import { userRoute } from './routes/userRoute.js';

dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // Allow your frontend
  }));
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.listen (PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})

app.use('/api/user', userRoute)
app.use('/api/residency', residencyRoute)



/*

*/