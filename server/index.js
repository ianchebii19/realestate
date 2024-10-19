import express from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {residenyRoute} from './routes/residencyRoute.js'
import { userRoute } from './routes/userRoute.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.listen (PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})

app.use('/api/user', userRoute)
app.use('/api/resideny', residenyRoute)