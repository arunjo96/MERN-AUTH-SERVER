import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./src/config/Db.js";
import http from "http";
import errorHandler from "./src/middleware/errorHandler.js";
import authRouter from "./src/routes/authRoutes.js";


connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 7000;

const server = http.createServer(app);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "MERN Auth API is running",
  });
});


app.use("/api/auth", authRouter);


app.use(errorHandler);


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});