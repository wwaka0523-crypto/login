import express from 'express';
import cors  from 'cors';
import path from 'path';
import { fileURLToPath} from 'url';
import 'dotenv/config';

import authRoutes from './auth.js';
import { connectDB } from './db.js'; 
 

const app = express();
const PORT = process.env.PORT || 5000;

//Get a correct directory.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Serve static frontend files
app.use(express.static(path.join(__dirname, 'frontend')));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/api/auth', authRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
}

);
