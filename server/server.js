const express = require("express");
const dotenv= require("dotenv");
const cors = require("cors");
const connectDB= require("./config/db");
const taskRoutes = require("./routes/taskRoutes");

dotenv.config();

connectDB();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/tasks",taskRoutes);

app.get("/",(req, res)=> {
  res.send("Welcome to TaskFlow API");
});


app.listen(PORT, ()=> {
  console.log(`Server is running on http://localhost:${PORT}`);
});