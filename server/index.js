import express from 'express';
import connectdb from './ConnectDB.js';
import router from './routes/user.route.js';
import enrollRoute from './routes/user.enroll.js';

import cors from 'cors';
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

// Enable CORS
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

// ✅ Add this root route
app.get("/", (req, res) => {
    res.send("Tutone backend is up and running!");
});

app.use("/api", router);
app.use("/api", enrollRoute);

app.listen(PORT, async () => {
    console.log("Server is running on http://localhost:", PORT);
    await connectdb();
});
