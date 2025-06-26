const { Product } = require("../models/Product.model");
const ApiResponse = require("../utils/response");
const { validationResult } = require("express-validator");
const cloudinary = require("../config/cloudinary");
const GeminiService = require("../services/gemini.service");

class ProductController {
  // Create a new product
  static async createProduct(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ApiResponse.validationError(res, errors.array());
      }

      const product = await Product.create(req.body);

      return ApiResponse.success(
        res,
        product,
        "Product created successfully",
        201
      );
    } catch (error) {
      next(error);
    }
  }

  // Get all products with filtering, pagination, and search
  static async getProducts(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const filter = {};

      // Add search functionality
      if (req.query.search) {
        filter.$text = { $search: req.query.search };
      }

      // Add category filter
      if (req.query.category) {
        filter.category = req.query.category;
      }

      // Add subcategory filter
      if (req.query.subcategory) {
        filter.subcategory = req.query.subcategory;
      }

      // Add gender filter
      if (req.query.gender) {
        filter.gender = req.query.gender;
      }

      // Add product type filter
      if (req.query.product_type) {
        filter.product_type = req.query.product_type;
      }

      // Add brand filter
      if (req.query.brand) {
        filter.brand = req.query.brand;
      }

      // Add color filter
      if (req.query.color) {
        filter.colors = { $in: [req.query.color] };
      }

      // Add size filter
      if (req.query.size) {
        filter.sizes = { $in: [req.query.size] };
      }

      // Add collection filter
      if (req.query.collection) {
        filter.collection = req.query.collection;
      }

      // Add price range filter
      if (req.query.minPrice || req.query.maxPrice) {
        filter.price = {};
        if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
        if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
      }

      const products = await Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Product.countDocuments(filter);

      const result = {
        products,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
        filters: {
          category: req.query.category,
          subcategory: req.query.subcategory,
          gender: req.query.gender,
          product_type: req.query.product_type,
          brand: req.query.brand,
          color: req.query.color,
          size: req.query.size,
          collection: req.query.collection,
          search: req.query.search,
          priceRange: {
            min: req.query.minPrice,
            max: req.query.maxPrice
          }
        }
      };

      return ApiResponse.success(
        res,
        result,
        "Products retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  // Get a single product by ID
  static async getProduct(req, res, next) {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return ApiResponse.error(res, "Product not found", 404);
      }

      return ApiResponse.success(
        res,
        product,
        "Product retrieved successfully"
      );
    } catch (error) {
      if (error.name === "CastError") {
        return ApiResponse.error(res, "Invalid product ID", 400);
      }
      next(error);
    }
  }

  // Update a product by ID
  static async updateProduct(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ApiResponse.validationError(res, errors.array());
      }

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!product) {
        return ApiResponse.error(res, "Product not found", 404);
      }

      return ApiResponse.success(res, product, "Product updated successfully");
    } catch (error) {
      if (error.name === "CastError") {
        return ApiResponse.error(res, "Invalid product ID", 400);
      }
      next(error);
    }
  }

  // Delete a product by ID (hard delete)
  static async deleteProduct(req, res, next) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);

      if (!product) {
        return ApiResponse.error(res, "Product not found", 404);
      }

      // Optional: Delete associated images from Cloudinary
      if (product.images && product.images.length > 0) {
        const deletePromises = product.images
          .filter(img => img.public_id)
          .map(img => cloudinary.uploader.destroy(img.public_id));
        
        try {
          await Promise.all(deletePromises);
        } catch (cloudinaryError) {
          console.warn("Failed to delete some images from Cloudinary:", cloudinaryError);
        }
      }

      return ApiResponse.success(res, null, "Product deleted successfully");
    } catch (error) {
      if (error.name === "CastError") {
        return ApiResponse.error(res, "Invalid product ID", 400);
      }
      next(error);
    }
  }

  // Get products by category
  static async getProductsByCategory(req, res, next) {
    try {
      const { category } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const products = await Product.find({ category })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Product.countDocuments({ category });

      const result = {
        products,
        category,
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
        `Products in ${category} category retrieved successfully`
      );
    } catch (error) {
      next(error);
    }
  }

  // Get products by brand
  static async getProductsByBrand(req, res, next) {
    try {
      const { brand } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const products = await Product.find({ brand: brand })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Product.countDocuments({ brand: brand });

      const result = {
        products,
        brand,
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
        "Products by brand retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  // Bulk create products
  static async bulkCreateProducts(req, res, next) {
    try {
      const { products } = req.body;

      if (!Array.isArray(products) || products.length === 0) {
        return ApiResponse.error(res, "Products array is required and cannot be empty", 400);
      }

      if (products.length > 50) {
        return ApiResponse.error(res, "Maximum 50 products allowed per bulk operation", 400);
      }

      const createdProducts = await Product.insertMany(products, { ordered: false });

      return ApiResponse.success(
        res,
        { 
          products: createdProducts, 
          count: createdProducts.length 
        },
        "Products created successfully",
        201
      );
    } catch (error) {
      if (error.name === "BulkWriteError") {
        const successfulInserts = error.result.insertedCount;
        const errors = error.writeErrors.map(err => ({
          index: err.index,
          error: err.errmsg
        }));
        
        return ApiResponse.error(
          res,
          `Bulk insert completed with ${successfulInserts} successful inserts and ${errors.length} errors`,
          400,
          { successfulInserts, errors }
        );
      }
      next(error);
    }
  }

  // Get product statistics
  static async getProductStats(req, res, next) {
    try {
      const stats = await Product.aggregate([
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            totalValue: { $sum: "$price" },
            avgPrice: { $avg: "$price" },
            totalStock: { $sum: "$stock" },
            categoryCounts: {
              $push: "$category"
            },
            genderCounts: {
              $push: "$gender"
            },
            productTypeCounts: {
              $push: "$product_type"
            }
          }
        },
        {
          $project: {
            _id: 0,
            totalProducts: 1,
            totalValue: { $round: ["$totalValue", 2] },
            avgPrice: { $round: ["$avgPrice", 2] },
            totalStock: 1,
            categoryCounts: 1,
            genderCounts: 1,
            productTypeCounts: 1
          }
        }
      ]);

      // Get category breakdown
      const categoryStats = await Product.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            avgPrice: { $avg: "$price" },
            totalStock: { $sum: "$stock" }
          }
        },
        {
          $project: {
            category: "$_id",
            count: 1,
            avgPrice: { $round: ["$avgPrice", 2] },
            totalStock: 1,
            _id: 0
          }
        }
      ]);

      const result = {
        overview: stats[0] || {
          totalProducts: 0,
          totalValue: 0,
          avgPrice: 0,
          totalStock: 0
        },
        categoryBreakdown: categoryStats
      };

      return ApiResponse.success(
        res,
        result,
        "Product statistics retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  static async uploadProductImage(req, res, next) {
    try {
      if (!req.file) {
        return ApiResponse.error(res, "No image file provided", 400);
      }

      // Upload image to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "products", // Organize images in a products folder
            public_id: `product_${Date.now()}`, // Unique filename
            transformation: [
              { width: 800, height: 800, crop: "limit" }, // Resize to max 800x800
              { quality: "auto" }, // Auto optimize quality
              { format: "auto" } // Auto format (webp for modern browsers)
            ]
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(req.file.buffer);
      });

      const imageData = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        bytes: uploadResult.bytes
      };

      return ApiResponse.success(
        res,
        imageData,
        "Image uploaded successfully",
        201
      );
    } catch (error) {
      if (error.message.includes("Invalid image file")) {
        return ApiResponse.error(res, "Invalid image file", 400);
      }
      next(error);
    }
  }

  static async uploadProductImages(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        return ApiResponse.error(res, "No image files provided", 400);
      }

      if (req.files.length > 5) {
        return ApiResponse.error(res, "Maximum 5 images allowed", 400);
      }

      // Upload all images to Cloudinary in parallel
      const uploadPromises = req.files.map((file, index) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: "image",
              folder: "products",
              public_id: `product_${Date.now()}_${index}`,
              transformation: [
                { width: 800, height: 800, crop: "limit" },
                { quality: "auto" },
                { format: "auto" }
              ]
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve({
                  url: result.secure_url,
                  public_id: result.public_id,
                  width: result.width,
                  height: result.height,
                  format: result.format,
                  bytes: result.bytes
                });
              }
            }
          ).end(file.buffer);
        });
      });

      const uploadResults = await Promise.all(uploadPromises);

      return ApiResponse.success(
        res,
        { images: uploadResults, count: uploadResults.length },
        "Images uploaded successfully",
        201
      );
    } catch (error) {
      next(error);
    }
  }

  static async deleteProductImage(req, res, next) {
    try {
      const { public_id } = req.body;

      if (!public_id) {
        return ApiResponse.error(res, "Image public_id is required", 400);
      }

      // Delete image from Cloudinary
      const result = await cloudinary.uploader.destroy(public_id);

      if (result.result === "ok") {
        return ApiResponse.success(
          res,
          { public_id, deleted: true },
          "Image deleted successfully"
        );
      } else {
        return ApiResponse.error(res, "Failed to delete image", 400);
      }
    } catch (error) {
      next(error);
    }
  }

  static async analyzeProductImages(req, res, next) {
    try {
      const { imageUrls, analyzeIndividually = false } = req.body;

      if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
        return ApiResponse.error(res, "imageUrls array is required and must not be empty", 400);
      }

      if (imageUrls.length > 5) {
        return ApiResponse.error(res, "Maximum 5 images allowed per analysis", 400);
      }

      // Validate URLs
      const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i;
      const invalidUrls = imageUrls.filter(url => !urlPattern.test(url));
      
      if (invalidUrls.length > 0) {
        return ApiResponse.error(
          res, 
          `Invalid image URLs detected: ${invalidUrls.join(', ')}. URLs must be valid HTTP/HTTPS links to image files.`, 
          400
        );
      }

      const geminiService = new GeminiService();
      
      let analysisResult;
      if (analyzeIndividually) {
        analysisResult = await geminiService.analyzeProductImagesSeparately(imageUrls);
      } else {
        analysisResult = await geminiService.analyzeProductImages(imageUrls);
      }

      return ApiResponse.success(
        res,
        analysisResult,
        "Product images analyzed successfully"
      );

    } catch (error) {
      if (error.message.includes("GEMINI_API_KEY")) {
        return ApiResponse.error(res, "Gemini AI service is not configured. Please contact administrator.", 500);
      }
      next(error);
    }
  }

  static async analyzeAndCreateProduct(req, res, next) {
    try {
      const { imageUrls, additionalData = {} } = req.body;

      if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
        return ApiResponse.error(res, "imageUrls array is required and must not be empty", 400);
      }

      // Analyze images first
      const geminiService = new GeminiService();
      const analysisResult = await geminiService.analyzeProductImages(imageUrls);

      if (!analysisResult.success) {
        return ApiResponse.error(res, "Failed to analyze product images", 500);
      }

      // Extract product data from analysis
      const productAnalysis = analysisResult.analysis.products || [];
      const attributesAnalysis = analysisResult.analysis.attributes || [];

      // Build product data from analysis
      const productData = {
        // Basic fields from analysis
        name: productAnalysis.find(p => p.name)?.name || additionalData.name || "Analyzed Product",
        product_type: productAnalysis.find(p => p.product_type)?.product_type || additionalData.product_type,
        category: productAnalysis.find(p => p.category)?.category || additionalData.category,
        subcategory: productAnalysis.find(p => p.subcategory)?.subcategory || additionalData.subcategory,
        gender: productAnalysis.find(p => p.gender)?.gender || additionalData.gender,
        target_age_group: productAnalysis.find(p => p.target_age_group)?.target_age_group || additionalData.target_age_group,
        description: productAnalysis.find(p => p.description)?.description || additionalData.description,
        tags: productAnalysis.find(p => p.tags)?.tags?.split(',').map(tag => tag.trim()) || additionalData.tags || [],
        
        // AI analysis attributes
        attributes: attributesAnalysis,
        
        // Images from the URLs
        images: imageUrls.map((url, index) => ({
          url: url,
          alt: `Product image ${index + 1}`,
          isPrimary: index === 0
        })),
        
        // Business data
        price: additionalData.price || 0,
        stock: additionalData.stock || 0,
        
        // Override with any additional data provided
        ...additionalData
      };

      // Create the product
      const product = await Product.create(productData);

      return ApiResponse.success(
        res,
        {
          product,
          analysis: analysisResult
        },
        "Product created from image analysis successfully",
        201
      );

    } catch (error) {
      if (error.message.includes("GEMINI_API_KEY")) {
        return ApiResponse.error(res, "Gemini AI service is not configured. Please contact administrator.", 500);
      }
      next(error);
    }
  }

  // Get all unique brands (from product data)
  static async getBrands(req, res, next) {
    try {
      const brands = await Product.distinct("brand", { brand: { $exists: true, $ne: "" } });
      return ApiResponse.success(res, brands.sort(), "Brands retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  // Get all unique collections (from product data)
  static async getCollections(req, res, next) {
    try {
      const collections = await Product.distinct("collection", { collection: { $exists: true, $ne: "" } });
      return ApiResponse.success(res, collections.sort(), "Collections retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  // Get all unique colors (from product data)
  static async getColors(req, res, next) {
    try {
      const colors = await Product.distinct("colors");
      const flatColors = colors.flat().filter(color => color && color.trim() !== "");
      const uniqueColors = [...new Set(flatColors)].sort();
      return ApiResponse.success(res, uniqueColors, "Colors retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  // Get all unique sizes (from product data)
  static async getSizes(req, res, next) {
    try {
      const sizes = await Product.distinct("sizes");
      const flatSizes = sizes.flat().filter(size => size && size.trim() !== "");
      const uniqueSizes = [...new Set(flatSizes)].sort();
      return ApiResponse.success(res, uniqueSizes, "Sizes retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

}

module.exports = ProductController;
