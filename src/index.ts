import express, { type Request, type Response } from "express";

// import middlewares
import morgan from "morgan";

import UsersRoutes from "./routes/usersRoutes.ts";
import itemRoutes from "./routes/itemsRoutes.ts";

const app = express();
const port = 3000;

// body parser middleware
app.use(express.json());

// logger middleware
app.use(morgan("dev"));
// app.use(morgan("combined"));

// Endpoints
app.get("/", (req: Request, res: Response) => {
  res.send("Quiz #2 - API service");
});

app.get("/me", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Quiz #2 - API service",
  });
});

app.use("/api/v676", UsersRoutes);
app.use("/api/v676/cart", itemRoutes);

app.get("/student", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Student Information",
    data: {
      studentId: "680610676",
      firstname: "Ice",
      lastname: "Wichiansarn",
      section: "001",
    },
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

// Export app for vercel deployment
export default app;
