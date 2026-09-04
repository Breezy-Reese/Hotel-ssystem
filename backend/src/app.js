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

// ============================================================
// SECURITY & CORS
// ============================================================

app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // (for example, direct server-to-server requests)
      if (!origin) {
        return callback(null, true);
      }

      // Allow origins configured in Render environment variables
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow local frontend development on port 3000
      if (
        origin === "http://localhost:3000" ||
        origin === "http://127.0.0.1:3000"
      ) {
        return callback(null, true);
      }

      // Allow main Vercel deployment
      if (origin === "https://hotel-ssystem.vercel.app") {
        return callback(null, true);
      }

      // Allow Vercel preview deployments
      if (
        /^https:\/\/hotel-ssystem-[a-z0-9]+-breezy-reeses-projects\.vercel\.app$/.test(
          origin
        )
      ) {
        return callback(null, true);
      }

      // Reject unknown origins
      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,
  })
);

// ============================================================
// LOGGING
// ============================================================

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ============================================================
// RATE LIMITING
// ============================================================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later.",
});

app.use("/api", limiter);

// ============================================================
// REQUEST PARSING
// ============================================================

app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.use(mongoSanitize());

app.use(compression());

// ============================================================
// ROOT ROUTE
// ============================================================

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Aurelia Suites API is running",
    docs: "/api/health",
  });
});

// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Aurelia Suites API is running",
  });
});

// ============================================================
// API ROUTES
// ============================================================

app.use("/api/v1", apiRouter);

// ============================================================
// 404 HANDLER
// ============================================================

app.all("*", (req, res, next) => {
  next(
    new AppError(
      `Cannot find ${req.originalUrl} on this server`,
      404
    )
  );
});

// ============================================================
// CENTRAL ERROR HANDLER
// ============================================================

app.use(errorHandler);

module.exports = app;