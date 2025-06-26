const mongoose = require("mongoose");

// Attribute Schema - keeping as subdocument since it has multiple fields
const attributeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [false, "Attribute name is required"],
    trim: true,
    maxlength: [50, "Attribute name cannot exceed 50 characters"],
  },
  value: {
    type: String,
    required: [false, "Attribute value is required"],
    trim: true,
    maxlength: [100, "Attribute value cannot exceed 100 characters"],
  },
  confidence_score: {
    type: Number,
    min: [0, "Confidence score cannot be less than 0"],
    max: [1, "Confidence score cannot be greater than 1"],
    default: 1.0,
  },
});

// Main Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [150, "Product name cannot exceed 150 characters"],
    },
    product_type: {
      type: String,
      required: [true, "Product type is required"],
      enum: [
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
      ],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
    },
    subcategory: {
      type: String,
      required: [true, "Product subcategory is required"],
      trim: true,
      maxlength: [50, "Subcategory cannot exceed 50 characters"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Female", "Male", "Unisex", "Kids"],
    },
    target_age_group: {
      type: String,
      required: [true, "Target age group is required"],
      enum: ["Adult", "Teen", "Child", "Infant",],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    tags: {
      type: [String],
      validate: {
        validator: function (tags) {
          return tags.length <= 20; // Maximum 20 tags
        },
        message: "Cannot have more than 20 tags",
      },
    },

    // References converted to text fields
    brand: {
      type: String,
      trim: true,
      maxlength: [50, "Brand name cannot exceed 50 characters"],
    },
    collection: {
      type: String,
      trim: true,
      maxlength: [100, "Collection name cannot exceed 100 characters"],
    },
    colors: {
      type: [String],
      validate: {
        validator: function (colors) {
          return colors.length <= 10; // Maximum 10 colors
        },
        message: "Cannot have more than 10 colors",
      },
    },
    sizes: {
      type: [String],
      validate: {
        validator: function (sizes) {
          return sizes.length <= 15; // Maximum 15 sizes
        },
        message: "Cannot have more than 15 sizes",
      },
    },
    attributes: [attributeSchema],

    // Additional fields for e-commerce functionality
    price: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
    stock: {
      type: Number,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          maxlength: [200, "Alt text cannot exceed 200 characters"],
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for search optimization
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ gender: 1, target_age_group: 1 });
productSchema.index({ brand: 1 });

// Virtual for getting primary image
productSchema.virtual("primaryImage").get(function () {
  const primary = this.images.find((img) => img.isPrimary);
  return primary || this.images[0];
});

// Pre-save middleware to ensure only one primary image
productSchema.pre("save", function (next) {
  if (this.images && this.images.length > 0) {
    const primaryImages = this.images.filter((img) => img.isPrimary);
    if (primaryImages.length > 1) {
      // Reset all to false, then set first one as primary
      this.images.forEach((img) => (img.isPrimary = false));
      this.images[0].isPrimary = true;
    } else if (primaryImages.length === 0) {
      // Set first image as primary if none is set
      this.images[0].isPrimary = true;
    }
  }
  next();
});

// Export Product model
const Product = mongoose.model("Product", productSchema);

module.exports = {
  Product,
};
