const express = require("express");
const { body } = require("express-validator");
const ProductController = require("../controllers/product.controller");
const { } = require("../middleware/auth.middleware");
const { upload, handleMulterError } = require("../middleware/upload.middleware");

const router = express.Router();

// Validation rules
const productValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage("Name must be between 2 and 150 characters"),
  body("product_type")
    .isIn([
      // Tops
      "Top", "T-Shirt", "Shirt", "Blouse", "Tank Top", "Camisole", "Crop Top", "Tube Top", "Halter Top", "Off-Shoulder Top", "Bodysuit", "Corset", "Bustier",
      
      // Bottoms  
      "Bottom", "Pants", "Jeans", "Trousers", "Leggings", "Shorts", "Skirt", "Mini Skirt", "Midi Skirt", "Maxi Skirt", "A-Line Skirt", "Pencil Skirt", "Pleated Skirt",
      
      // Dresses & One-Pieces
      "Dress", "Maxi Dress", "Mini Dress", "Midi Dress", "Cocktail Dress", "Evening Gown", "Sundress", "Wrap Dress", "Shift Dress", "A-Line Dress", "Bodycon Dress", "Jumpsuit", "Romper", "Playsuit",
      
      // Outerwear
      "Jacket", "Blazer", "Coat", "Trench Coat", "Overcoat", "Parka", "Bomber Jacket", "Denim Jacket", "Leather Jacket", "Cardigan", "Sweater", "Hoodie", "Sweatshirt", "Poncho", "Cape", "Vest", "Waistcoat",
      
      // Footwear
      "Shoe", "Sneakers", "Athletic Shoes", "Running Shoes", "Basketball Shoes", "Tennis Shoes", "Boots", "Ankle Boots", "Knee-High Boots", "Combat Boots", "Chelsea Boots", "Riding Boots", "Heels", "Stilettos", "Wedges", "Platform Shoes", "Flats", "Ballet Flats", "Loafers", "Oxfords", "Moccasins", "Sandals", "Flip Flops", "Slides", "Clogs", "Espadrilles", "Mary Janes", "Pumps", "Mules", "Slip-Ons",
      
      // Bags & Accessories
      "Bag", "Handbag", "Purse", "Clutch", "Tote Bag", "Shoulder Bag", "Crossbody Bag", "Backpack", "Messenger Bag", "Satchel", "Hobo Bag", "Bucket Bag", "Fanny Pack", "Belt Bag", "Evening Bag", "Travel Bag", "Duffle Bag", "Laptop Bag",
      
      // Accessories
      "Accessory", "Belt", "Scarf", "Shawl", "Hat", "Cap", "Beanie", "Fedora", "Beret", "Headband", "Hair Clip", "Hair Tie", "Sunglasses", "Eyeglasses", "Watch", "Bracelet", "Necklace", "Earrings", "Ring", "Brooch", "Pin", "Cufflinks", "Tie", "Bow Tie", "Pocket Square", "Gloves", "Mittens", "Socks", "Stockings", "Tights", "Pantyhose",
      
      // Undergarments & Intimates
      "Bra", "Sports Bra", "Bralette", "Underwear", "Panties", "Briefs", "Boxers", "Boxer Briefs", "Thong", "Lingerie", "Teddy", "Babydoll", "Chemise", "Slip", "Camisole", "Undershirt", "Shapewear", "Corset", "Garter", "Stockings", "Hosiery",
      
      // Activewear & Sportswear
      "Activewear", "Sports Bra", "Athletic Top", "Tank Top", "Workout Shirt", "Yoga Pants", "Athletic Shorts", "Track Pants", "Sweatpants", "Joggers", "Compression Wear", "Swimwear", "Bikini", "One-Piece Swimsuit", "Swim Shorts", "Rashguard", "Wetsuit",
      
      // Sleepwear & Loungewear
      "Sleepwear", "Pajamas", "Nightgown", "Robe", "Bathrobe", "Loungewear", "Sleep Shirt", "Sleep Shorts", "Onesie", "Nightshirt",
      
      // Formal & Special Occasion
      "Formal Wear", "Tuxedo", "Suit", "Blazer", "Dress Shirt", "Formal Dress", "Evening Gown", "Cocktail Dress", "Wedding Dress", "Bridesmaid Dress", "Prom Dress",
      
      // Traditional & Cultural
      "Traditional Wear", "Ethnic Wear", "Kimono", "Sari", "Lehenga", "Salwar Kameez", "Kurta", "Kaftan", "Dashiki", "Poncho", "Serape",
      
      // Maternity & Baby
      "Maternity Wear", "Maternity Top", "Maternity Bottom", "Maternity Dress", "Nursing Bra", "Baby Wear", "Onesie", "Baby Romper", "Baby Dress", "Baby Shoes",
      
      // Other
      "Other"
    ])
    .withMessage("Invalid product type"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required"),
  body("subcategory")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Subcategory must be between 1 and 50 characters"),
  body("gender")
    .isIn(["Female", "Male", "Unisex", "Kids"])
    .withMessage("Invalid gender"),
  body("target_age_group")
    .isIn(["Adult", "Teen", "Child", "Infant"])
    .withMessage("Invalid target age group"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),
  body("brand")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Brand name cannot exceed 50 characters"),
  body("collection")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Collection name cannot exceed 100 characters"),
  body("colors")
    .optional()
    .isArray({ max: 10 })
    .withMessage("Colors must be an array with maximum 10 items"),
  body("sizes")
    .optional()
    .isArray({ max: 15 })
    .withMessage("Sizes must be an array with maximum 15 items"),
  body("tags")
    .optional()
    .isArray({ max: 20 })
    .withMessage("Tags must be an array with maximum 20 items"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
];

// Image analysis validation
const imageAnalysisValidation = [
  body("imageUrls")
    .isArray({ min: 1, max: 5 })
    .withMessage("imageUrls must be an array with 1-5 URLs"),
  body("imageUrls.*")
    .isURL()
    .withMessage("Each URL must be a valid URL")
    .matches(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i)
    .withMessage("URLs must point to image files (jpg, jpeg, png, gif, webp)"),
  body("analyzeIndividually")
    .optional()
    .isBoolean()
    .withMessage("analyzeIndividually must be a boolean"),
];

const analyzeAndCreateValidation = [
  body("imageUrls")
    .isArray({ min: 1, max: 5 })
    .withMessage("imageUrls must be an array with 1-5 URLs"),
  body("imageUrls.*")
    .isURL()
    .withMessage("Each URL must be a valid URL")
    .matches(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i)
    .withMessage("URLs must point to image files (jpg, jpeg, png, gif, webp)"),
  body("additionalData")
    .optional()
    .isObject()
    .withMessage("additionalData must be an object"),
  body("additionalData.price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),
  body("additionalData.stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
];

// Routes
router.post(
  "/",
  
  productValidation,
  ProductController.createProduct
);

// Image upload route
router.post(
  "/upload-image",
  upload.single("image"),
  handleMulterError,
  ProductController.uploadProductImage
);

// Bulk image upload route (up to 5 images)
router.post(
  "/upload-images",
  upload.array("images", 5),
  handleMulterError,
  ProductController.uploadProductImages
);

router.get("/", ProductController.getProducts);
router.get("/category/:category", ProductController.getProductsByCategory);
router.get("/brand/:brand", ProductController.getProductsByBrand);
router.get("/stats", ProductController.getProductStats);

// Utility routes for getting unique values
router.get("/metadata/brands", ProductController.getBrands);
router.get("/metadata/collections", ProductController.getCollections);
router.get("/metadata/colors", ProductController.getColors);
router.get("/metadata/sizes", ProductController.getSizes);

// Bulk operations
router.post("/bulk", ProductController.bulkCreateProducts);

router.get("/:id", ProductController.getProduct);
router.put(
  "/:id",
  
  productValidation,
  ProductController.updateProduct
);
router.delete("/:id",  ProductController.deleteProduct);

// Image delete route
router.delete(
  "/delete-image",
  
  ProductController.deleteProductImage
);

// AI Analysis routes
router.post(
  "/analyze-images",
  // 
  imageAnalysisValidation,
  ProductController.analyzeProductImages
);

router.post(
  "/analyze-and-create",
  // 
  analyzeAndCreateValidation,
  ProductController.analyzeAndCreateProduct
);

module.exports = router;
