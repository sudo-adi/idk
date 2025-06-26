const Folder = require("../models/Folder.model");
const { Product } = require("../models/Product.model");
const ApiResponse = require("../utils/response");
const { validationResult } = require("express-validator");

class FolderController {
  // Create a new folder
  static async createFolder(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ApiResponse.validationError(res, errors.array());
      }

      const { name, productIds = [] } = req.body;

      // Validate that all productIds exist
      if (productIds.length > 0) {
        const existingProducts = await Product.find({
          _id: { $in: productIds },
          // isActive: true
        });
        
        if (existingProducts.length !== productIds.length) {
          return ApiResponse.error(res, "One or more product IDs are invalid", 400);
        }
      }

      const folder = await Folder.create({
        name,
        productIds
      });

      return ApiResponse.success(
        res,
        folder,
        "Folder created successfully",
        201
      );
    } catch (error) {
      next(error);
    }
  }

  // Get all folders with pagination
  static async getFolders(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const filter = {};

      // Add search functionality
      if (req.query.search) {
        filter.name = { $regex: req.query.search, $options: 'i' };
      }

      const folders = await Folder.find(filter)
        .populate('productIds', 'name price images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Folder.countDocuments(filter);

      const result = {
        folders,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };

      return ApiResponse.success(
        res,
        result,
        "Folders retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  // Get a single folder by ID
  static async getFolder(req, res, next) {
    try {
      const folder = await Folder.findById(req.params.id)
        .populate('productIds', 'name price images description category');

      if (!folder) {
        return ApiResponse.error(res, "Folder not found", 404);
      }

      return ApiResponse.success(
        res,
        folder,
        "Folder retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  // Update a folder
  static async updateFolder(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ApiResponse.validationError(res, errors.array());
      }

      const { name, productIds } = req.body;
      const updateData = {};

      if (name) updateData.name = name;

      // If productIds are provided, validate them
      if (productIds && Array.isArray(productIds)) {
        if (productIds.length > 0) {
          const existingProducts = await Product.find({
            _id: { $in: productIds },
            // isActive: true
          });
          
          if (existingProducts.length !== productIds.length) {
            return ApiResponse.error(res, "One or more product IDs are invalid", 400);
          }
        }
        updateData.productIds = productIds;
      }

      const folder = await Folder.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate('productIds', 'name price images');

      if (!folder) {
        return ApiResponse.error(res, "Folder not found", 404);
      }

      return ApiResponse.success(res, folder, "Folder updated successfully");
    } catch (error) {
      next(error);
    }
  }

  // Delete a folder
  static async deleteFolder(req, res, next) {
    try {
      const folder = await Folder.findByIdAndDelete(req.params.id);

      if (!folder) {
        return ApiResponse.error(res, "Folder not found", 404);
      }

      return ApiResponse.success(res, null, "Folder deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  // Add products to a folder
  static async addProductsToFolder(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ApiResponse.validationError(res, errors.array());
      }

      const { productIds } = req.body;
      const folderId = req.params.id;

      // Validate that all productIds exist
      const existingProducts = await Product.find({
        _id: { $in: productIds },
        // isActive: true
      });
      
      if (existingProducts.length !== productIds.length) {
        return ApiResponse.error(res, "One or more product IDs are invalid", 400);
      }

      const folder = await Folder.findById(folderId);
      if (!folder) {
        return ApiResponse.error(res, "Folder not found", 404);
      }

      // Add products using the model method
      for (const productId of productIds) {
        await folder.addProduct(productId);
      }

      // Get updated folder with populated products
      const updatedFolder = await Folder.findById(folderId)
        .populate('productIds', 'name price images');

      return ApiResponse.success(
        res,
        updatedFolder,
        "Products added to folder successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  // Remove products from a folder
  static async removeProductsFromFolder(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ApiResponse.validationError(res, errors.array());
      }

      const { productIds } = req.body;
      const folderId = req.params.id;

      const folder = await Folder.findById(folderId);
      if (!folder) {
        return ApiResponse.error(res, "Folder not found", 404);
      }

      // Remove products using the model method
      for (const productId of productIds) {
        await folder.removeProduct(productId);
      }

      // Get updated folder with populated products
      const updatedFolder = await Folder.findById(folderId)
        .populate('productIds', 'name price images');

      return ApiResponse.success(
        res,
        updatedFolder,
        "Products removed from folder successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  // Get folders containing a specific product
  static async getFoldersByProduct(req, res, next) {
    try {
      const productId = req.params.productId;

      // Validate that the product exists
      const product = await Product.findById(productId);
      if (!product) {
        return ApiResponse.error(res, "Product not found", 404);
      }

      const folders = await Folder.findByProduct(productId)
        .populate('productIds', 'name price images');

      return ApiResponse.success(
        res,
        { folders, productId },
        "Folders containing product retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FolderController;