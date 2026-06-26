const { body } = require("express-validator");

// Production-ready validation rules for adding a home
exports.validateAddHome = [
  body("homeName")
    .trim()
    .notEmpty()
    .withMessage("Property name is required.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Property name must be between 3 and 100 characters."),

  body("price")
    .notEmpty()
    .withMessage("Price is required.")
    .isFloat({ min: 1 })
    .withMessage("Price must be a positive number greater than 0."),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required.")
    .isLength({ min: 2, max: 100 })
    .withMessage("Location must be between 2 and 100 characters."),

  body("rating")
    .notEmpty()
    .withMessage("Rating is required.")
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be a number between 0 and 5."),

  body("photoUrl")
    .trim()
    .notEmpty()
    .withMessage("Photo URL is required.")
    .custom((value) => {
      if (value.startsWith("/") || value.startsWith("http")) {
        return true;
      }
      throw new Error("Photo URL must be a valid web link (http://) or local path (/).");
    }),

  body("type")
    .trim()
    .notEmpty()
    .withMessage("Property type is required."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required.")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long."),

  body("highlights")
    .trim()
    .notEmpty()
    .withMessage("Please provide at least one highlight (comma separated).")
];
