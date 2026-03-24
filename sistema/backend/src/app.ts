import express from "express";
import questionsRouter from "./routes/questions";
import examsRouter from "./routes/exams";

const app = express();
app.use(express.json());

app.use("/api/questions", questionsRouter);
app.use("/api/exams", examsRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

export default app;
