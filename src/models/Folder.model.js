const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Folder name is required"],
      trim: true,
      maxlength: [100, "Folder name cannot exceed 100 characters"],
    },    productIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
folderSchema.index({ name: 1 });
folderSchema.index({ productIds: 1 });

// Virtual for getting product count
folderSchema.virtual("productCount").get(function () {
  return this.productIds ? this.productIds.length : 0;
});

// Method to add a product to the folder
folderSchema.methods.addProduct = function (productId) {
  if (!this.productIds.includes(productId)) {
    this.productIds.push(productId);
  }
  return this.save();
};

// Method to remove a product from the folder
folderSchema.methods.removeProduct = function (productId) {
  this.productIds = this.productIds.filter(
    (id) => id.toString() !== productId.toString()
  );
  return this.save();
};

// Static method to find folders by product
folderSchema.statics.findByProduct = function (productId) {
  return this.find({
    productIds: productId,
  });
};

// Pre-save middleware to remove duplicates
folderSchema.pre("save", function (next) {
  if (this.productIds && this.productIds.length > 0) {
    // Remove duplicate product IDs
    this.productIds = [...new Set(this.productIds.map(id => id.toString()))];
  }
  next();
});

module.exports = mongoose.model("Folder", folderSchema);