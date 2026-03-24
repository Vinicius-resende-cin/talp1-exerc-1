import express from "express";
import questionsRouter from "./routes/questions";

const app = express();
app.use(express.json());

app.use("/api/questions", questionsRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

export default app;
