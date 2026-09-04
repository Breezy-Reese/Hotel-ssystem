const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const AppError = require("./utils/AppError");
const errorHandler = require("./middleware/errorHandler");
const apiRouter = require("./routes");

const app = express();

app.set("trust proxy", 1);

// --- Security & parsing middleware ---
app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials: true,
  }),
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(mongoSanitize());
app.use(compression());

// --- Health check ---
// --- Root route (friendly response instead of a 404 at the bare URL) ---
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Aurelia Suites API is running",
    docs: "/api/health",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "success", message: "Aurelia Suites API is running" });
});

// --- API routes ---
app.use("/api/v1", apiRouter);

// --- 404 for unmatched routes ---
app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// --- Central error handler (must be last) ---
app.use(errorHandler);

module.exports = app;
