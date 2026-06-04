import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
dotenv.config()

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

