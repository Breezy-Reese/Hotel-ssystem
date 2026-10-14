
const express = require("express");
const multer = require("multer");

const factory = require("../controllers/handlerFactory");
const Room = require("../models/Room");
const cloudinary = require("../config/cloudinary");
const { protect, restrictTo } = require("../middleware/auth");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const router = express.Router();

const opts = {
  searchableFields: ["roomNumber", "type"],
  defaultPopulate: "branch",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES_PER_UPLOAD = 8;
const MAX_IMAGES_PER_ROOM = 20;

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES_PER_UPLOAD,
  },
  fileFilter: (req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(
        new AppError(
          "Unsupported image format. Upload JPEG, PNG, WEBP, or AVIF images.",
          400
        )
      );
    }

    callback(null, true);
  },
});

/**
 * Upload a buffered image to Cloudinary.
 * Returns the secure URL that can be saved in MongoDB.
 */
function uploadImageToCloudinary(file, roomId) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `aurelia-suites/rooms/${roomId}`,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result || !result.secure_url) {
          return reject(
            new Error("Cloudinary did not return a secure image URL.")
          );
        }

        resolve(result.secure_url);
      }
    );

    stream.end(file.buffer);
  });
}

// All room endpoints require authentication.
router.use(protect);

/**
 * POST /api/v1/rooms/:id/images
 *
 * Multipart form-data field:
 * images
 *
 * Only Admin and Manager users can upload room images.
 */
router.post(
  "/:id/images",
  restrictTo("Admin", "Manager"),
  upload.array("images", MAX_FILES_PER_UPLOAD),
  catchAsync(async (req, res, next) => {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return next(
        new AppError(
          "Image storage is not configured. Check the backend Cloudinary environment variables.",
          503
        )
      );
    }

    const files = req.files || [];

    if (files.length === 0) {
      return next(
        new AppError(
          "Select at least one image before uploading.",
          400
        )
      );
    }

    const room = await Room.findById(req.params.id);

    if (!room) {
      return next(new AppError("No room found with that ID.", 404));
    }

    const existingImages = Array.isArray(room.images)
      ? room.images
      : [];

    if (existingImages.length + files.length > MAX_IMAGES_PER_ROOM) {
      return next(
        new AppError(
          `A room can have at most ${MAX_IMAGES_PER_ROOM} images. This room currently has ${existingImages.length}.`,
          400
        )
      );
    }

    const uploadedUrls = await Promise.all(
      files.map((file) =>
        uploadImageToCloudinary(file, room._id.toString())
      )
    );

    room.images = [...existingImages, ...uploadedUrls];

    await room.save();

    res.status(200).json({
      status: "success",
      message: "Room images uploaded successfully.",
      data: room,
    });
  })
);

// List rooms and create a room.
router
  .route("/")
  .get(factory.getAll(Room, opts))
  .post(factory.createOne(Room, { entity: "Room" }));

// Get, update, or delete an individual room.
router
  .route("/:id")
  .get(factory.getOne(Room, opts))
  .patch(factory.updateOne(Room, { entity: "Room" }))
  .delete(factory.deleteOne(Room, { entity: "Room" }));

module.exports = router;
