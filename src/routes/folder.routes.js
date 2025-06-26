const express = require("express");
const { body } = require("express-validator");
const FolderController = require("../controllers/folder.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

// Validation rules
const folderValidation = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Name must be between 1 and 100 characters"),
  body("productIds")
    .optional()
    .isArray()
    .withMessage("Product IDs must be an array"),
  body("productIds.*")
    .optional()
    .isMongoId()
    .withMessage("Each product ID must be a valid MongoDB ObjectId")
];

const addRemoveProductsValidation = [
  body("productIds")
    .isArray({ min: 1 })
    .withMessage("Product IDs must be a non-empty array"),
  body("productIds.*")
    .isMongoId()
    .withMessage("Each product ID must be a valid MongoDB ObjectId")
];

// CRUD Routes
router.post(
  "/",
  // authenticate,
  folderValidation,
  FolderController.createFolder
);

router.get("/", FolderController.getFolders);

router.get("/:id", FolderController.getFolder);

router.put(
  "/:id",
  // authenticate,
  folderValidation,
  FolderController.updateFolder
);

router.delete("/:id", FolderController.deleteFolder);

// Product management routes
router.post(
  "/:id/add-products",
  // authenticate,
  addRemoveProductsValidation,
  FolderController.addProductsToFolder
);

router.post(
  "/:id/remove-products",
  // authenticate,
  addRemoveProductsValidation,
  FolderController.removeProductsFromFolder
);

// Utility routes
router.get("/by-product/:productId", FolderController.getFoldersByProduct);

module.exports = router;