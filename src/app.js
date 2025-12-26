import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// import routes
import healthCheck from "./routes/healthcheck.route.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import customerRouter from "./routes/customer.route.js";

// routes
app.use("/healthcheck", healthCheck);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/customers", customerRouter);

export default app;
