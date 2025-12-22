import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import mongoose from "mongoose";


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "src", "public")));

 const connectDB =  async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado ao MongoDB com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:',  error);
    }
};

connectDB();

app.use("/api", paymentRoutes);


app.listen(process.env.PORT, () => console.log(`🚀 Servidor rodando em http://localhost:`, process.env.PORT));
