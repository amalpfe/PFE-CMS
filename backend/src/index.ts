import express, { Request, Response } from 'express';
import cors from 'cors';
import ClinicRoutes from "./Routes/ClinicRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/clinic', ClinicRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
