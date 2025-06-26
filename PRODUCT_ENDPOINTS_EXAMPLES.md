# Product Endpoints - Request/Response Examples

## Base URL
```
http://localhost:5000/api/products
```

## 1. Create Product
**POST** `/api/products`

### Request
```json
{
  "name": "Premium Cotton T-Shirt",
  "product_type": "Top",
  "category": "Clothing",
  "subcategory": "T-Shirts",
  "gender": "Unisex",
  "target_age_group": "Adult",
  "description": "High-quality 100% cotton t-shirt with modern fit and comfortable feel. Perfect for casual wear.",
  "brand": "Nike",
  "collection": "Summer Essentials 2024",
  "colors": ["White", "Black", "Navy Blue", "Red"],
  "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
  "tags": ["casual", "cotton", "comfortable", "summer", "everyday"],
  "price": 29.99,
  "stock": 150,
  "attributes": [
    {
      "name": "Material",
      "value": "100% Cotton",
      "confidence_score": 1.0
    },
    {
      "name": "Care Instructions",
      "value": "Machine wash cold",
      "confidence_score": 0.95
    }
  ],
  "images": [
    {
      "url": "https://example.com/image1.jpg",
      "alt": "Front view of whigvte cotton t-shirt",
      "isPrimary": true
    },
    {
      "url": "https://example.com/image2.jpg",
      "alt": "Back view of white cotton t-shirt",
      "isPrimary": false
    }
  ]
}
```

### Response
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Premium Cotton T-Shirt",
    "product_type": "Top",
    "category": "Clothing",
    "subcategory": "T-Shirts",
    "gender": "Unisex",
    "target_age_group": "Adult",
    "description": "High-quality 100% cotton t-shirt with modern fit and comfortable feel. Perfect for casual wear.",
    "brand": "Nike",
    "collection": "Summer Essentials 2024",
    "colors": ["White", "Black", "Navy Blue", "Red"],
    "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
    "tags": ["casual", "cotton", "comfortable", "summer", "everyday"],
    "price": 29.99,
    "stock": 150,
    "attributes": [
      {
        "name": "Material",
        "value": "100% Cotton",
        "confidence_score": 1.0,
        "_id": "60f7b3b3b3b3b3b3b3b3b3b4"
      },
      {
        "name": "Care Instructions",
        "value": "Machine wash cold",
        "confidence_score": 0.95,
        "_id": "60f7b3b3b3b3b3b3b3b3b3b5"
      }
    ],
    "images": [
      {
        "url": "https://example.com/image1.jpg",
        "alt": "Front view of white cotton t-shirt",
        "isPrimary": true,
        "_id": "60f7b3b3b3b3b3b3b3b3b3b6"
      },
      {
        "url": "https://example.com/image2.jpg",
        "alt": "Back view of white cotton t-shirt",
        "isPrimary": false,
        "_id": "60f7b3b3b3b3b3b3b3b3b3b7"
      }
    ],
    "createdAt": "2025-06-10T10:30:00.000Z",
    "updatedAt": "2025-06-10T10:30:00.000Z",
    "__v": 0
  }
}
```

---

## 2. Get All Products (with filters and pagination)
**GET** `/api/products?page=1&limit=10&category=Clothing&brand=Nike&color=White&size=M&minPrice=20&maxPrice=50&search=cotton`

### Request
Query Parameters:
- `page`: 1 (optional, default: 1)
- `limit`: 10 (optional, default: 10)
- `category`: "Clothing" (optional)
- `subcategory`: "T-Shirts" (optional)
- `gender`: "Unisex" (optional)
- `product_type`: "Top" (optional)
- `brand`: "Nike" (optional)
- `color`: "White" (optional)
- `size`: "M" (optional)
- `collection`: "Summer Essentials 2024" (optional)
- `minPrice`: 20 (optional)
- `maxPrice`: 50 (optional)
- `search`: "cotton" (optional)

### Response
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "products": [
      {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "name": "Premium Cotton T-Shirt",
        "product_type": "Top",
        "category": "Clothing",
        "subcategory": "T-Shirts",
        "gender": "Unisex",
        "target_age_group": "Adult",
        "description": "High-quality 100% cotton t-shirt...",
        "brand": "Nike",
        "collection": "Summer Essentials 2024",
        "colors": ["White", "Black", "Navy Blue", "Red"],
        "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
        "tags": ["casual", "cotton", "comfortable", "summer", "everyday"],
        "price": 29.99,
        "stock": 150,
        "attributes": [...],
        "images": [...],
        "createdAt": "2025-06-10T10:30:00.000Z",
        "updatedAt": "2025-06-10T10:30:00.000Z"
      }
    ],
    "pagination": {
      "current": 1,
      "pages": 1,
      "total": 1,
      "hasNext": false,
      "hasPrev": false
    },
    "filters": {
      "category": "Clothing",
      "subcategory": null,
      "gender": null,
      "product_type": null,
      "brand": "Nike",
      "color": "White",
      "size": "M",
      "collection": null,
      "search": "cotton",
      "priceRange": {
        "min": "20",
        "max": "50"
      }
    }
  }
}
```

---

## 3. Get Product by ID
**GET** `/api/products/60f7b3b3b3b3b3b3b3b3b3b3`

### Request
No body required.

### Response
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Premium Cotton T-Shirt",
    "product_type": "Top",
    "category": "Clothing",
    "subcategory": "T-Shirts",
    "gender": "Unisex",
    "target_age_group": "Adult",
    "description": "High-quality 100% cotton t-shirt with modern fit and comfortable feel. Perfect for casual wear.",
    "brand": "Nike",
    "collection": "Summer Essentials 2024",
    "colors": ["White", "Black", "Navy Blue", "Red"],
    "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
    "tags": ["casual", "cotton", "comfortable", "summer", "everyday"],
    "price": 29.99,
    "stock": 150,
    "attributes": [...],
    "images": [...],
    "createdAt": "2025-06-10T10:30:00.000Z",
    "updatedAt": "2025-06-10T10:30:00.000Z",
    "__v": 0
  }
}
```

---

## 4. Update Product
**PUT** `/api/products/60f7b3b3b3b3b3b3b3b3b3b3`

### Request
```json
{
  "name": "Premium Organic Cotton T-Shirt",
  "description": "High-quality 100% organic cotton t-shirt with modern fit and comfortable feel. Eco-friendly and sustainable.",
  "price": 34.99,
  "stock": 120,
  "colors": ["White", "Black", "Navy Blue", "Red", "Forest Green"],
  "tags": ["casual", "organic", "cotton", "comfortable", "summer", "everyday", "eco-friendly"]
}
```

### Response
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Premium Organic Cotton T-Shirt",
    "product_type": "Top",
    "category": "Clothing",
    "subcategory": "T-Shirts",
    "gender": "Unisex",
    "target_age_group": "Adult",
    "description": "High-quality 100% organic cotton t-shirt with modern fit and comfortable feel. Eco-friendly and sustainable.",
    "brand": "Nike",
    "collection": "Summer Essentials 2024",
    "colors": ["White", "Black", "Navy Blue", "Red", "Forest Green"],
    "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
    "tags": ["casual", "organic", "cotton", "comfortable", "summer", "everyday", "eco-friendly"],
    "price": 34.99,
    "stock": 120,
    "attributes": [...],
    "images": [...],
    "createdAt": "2025-06-10T10:30:00.000Z",
    "updatedAt": "2025-06-10T11:45:00.000Z",
    "__v": 0
  }
}
```

---

## 5. Delete Product
**DELETE** `/api/products/60f7b3b3b3b3b3b3b3b3b3b3`

### Request
No body required.

### Response
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": null
}
```

---

## 6. Get Products by Category
**GET** `/api/products/category/Clothing?page=1&limit=5`

### Request
Path parameter: `category` = "Clothing"
Query parameters: `page=1&limit=5`

### Response
```json
{
  "success": true,
  "message": "Products in Clothing category retrieved successfully",
  "data": {
    "products": [
      {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "name": "Premium Cotton T-Shirt",
        "category": "Clothing",
        "subcategory": "T-Shirts",
        "brand": "Nike",
        "price": 29.99,
        "stock": 150,
        // ... other fields
      }
    ],
    "category": "Clothing",
    "pagination": {
      "current": 1,
      "pages": 1,
      "total": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

---

## 7. Get Products by Brand
**GET** `/api/products/brand/Nike?page=1&limit=5`

### Request
Path parameter: `brand` = "Nike"
Query parameters: `page=1&limit=5`

### Response
```json
{
  "success": true,
  "message": "Products by brand retrieved successfully",
  "data": {
    "products": [
      {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "name": "Premium Cotton T-Shirt",
        "brand": "Nike",
        "category": "Clothing",
        "price": 29.99,
        // ... other fields
      }
    ],
    "brand": "Nike",
    "pagination": {
      "current": 1,
      "pages": 1,
      "total": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

---

## 8. Get Product Statistics
**GET** `/api/products/stats`

### Request
No body required.

### Response
```json
{
  "success": true,
  "message": "Product statistics retrieved successfully",
  "data": {
    "overview": {
      "totalProducts": 50,
      "totalValue": 1499.50,
      "avgPrice": 29.99,
      "totalStock": 2500,
      "categoryCounts": ["Clothing", "Clothing", "Shoes", "Accessories"],
      "genderCounts": ["Unisex", "Male", "Female", "Kids"],
      "productTypeCounts": ["Top", "Bottom", "Shoe", "Accessory"]
    },
    "categoryBreakdown": [
      {
        "category": "Clothing",
        "count": 35,
        "avgPrice": 32.50,
        "totalStock": 1750
      },
      {
        "category": "Shoes",
        "count": 10,
        "avgPrice": 89.99,
        "totalStock": 500
      },
      {
        "category": "Accessories",
        "count": 5,
        "avgPrice": 15.99,
        "totalStock": 250
      }
    ]
  }
}
```

---

## 9. Bulk Create Products
**POST** `/api/products/bulk`

### Request
```json
{
  "products": [
    {
      "name": "Classic Denim Jeans",
      "product_type": "Bottom",
      "category": "Clothing",
      "subcategory": "Jeans",
      "gender": "Unisex",
      "target_age_group": "Adult",
      "description": "Classic straight-fit denim jeans",
      "brand": "Levi's",
      "colors": ["Blue", "Black"],
      "sizes": ["28", "30", "32", "34", "36"],
      "price": 79.99,
      "stock": 100
    },
    {
      "name": "Running Sneakers",
      "product_type": "Shoe",
      "category": "Footwear",
      "subcategory": "Athletic",
      "gender": "Unisex",
      "target_age_group": "Adult",
      "description": "Lightweight running sneakers",
      "brand": "Adidas",
      "colors": ["White", "Black", "Red"],
      "sizes": ["7", "8", "9", "10", "11"],
      "price": 129.99,
      "stock": 75
    }
  ]
}
```

### Response
```json
{
  "success": true,
  "message": "Products created successfully",
  "data": {
    "products": [
      {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b8",
        "name": "Classic Denim Jeans",
        "product_type": "Bottom",
        // ... other fields
      },
      {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b9",
        "name": "Running Sneakers",
        "product_type": "Shoe",
        // ... other fields
      }
    ],
    "count": 2
  }
}
```

---

## 10. Upload Product Image
**POST** `/api/products/upload-image`

### Request
```
Content-Type: multipart/form-data

Form data:
- image: [file] (single image file)
```

### Response
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1625123456/products/product_1625123456.jpg",
    "public_id": "products/product_1625123456",
    "width": 800,
    "height": 800,
    "format": "jpg",
    "bytes": 156743
  }
}
```

---

## 11. Upload Multiple Product Images
**POST** `/api/products/upload-images`

### Request
```
Content-Type: multipart/form-data

Form data:
- images: [file] (multiple image files, max 5)
```

### Response
```json
{
  "success": true,
  "message": "Images uploaded successfully",
  "data": {
    "images": [
      {
        "url": "https://res.cloudinary.com/your-cloud/image/upload/v1625123456/products/product_1625123456_0.jpg",
        "public_id": "products/product_1625123456_0",
        "width": 800,
        "height": 800,
        "format": "jpg",
        "bytes": 156743
      },
      {
        "url": "https://res.cloudinary.com/your-cloud/image/upload/v1625123456/products/product_1625123456_1.jpg",
        "public_id": "products/product_1625123456_1",
        "width": 800,
        "height": 800,
        "format": "jpg",
        "bytes": 164821
      }
    ],
    "count": 2
  }
}
```

---

## 12. Delete Product Image
**DELETE** `/api/products/delete-image`

### Request
```json
{
  "public_id": "products/product_1625123456"
}
```

### Response
```json
{
  "success": true,
  "message": "Image deleted successfully",
  "data": {
    "public_id": "products/product_1625123456",
    "deleted": true
  }
}
```

---

## 13. Analyze Product Images
**POST** `/api/products/analyze-images`

### Request
```json
{
  "imageUrls": [
    "https://example.com/product-image1.jpg",
    "https://example.com/product-image2.jpg"
  ],
  "analyzeIndividually": false
}
```

### Response
```json
{
  "success": true,
  "message": "Product images analyzed successfully",
  "data": {
    "success": true,
    "analysis": {
      "products": [
        {
          "name": "Cotton T-Shirt",
          "product_type": "Top",
          "category": "Clothing",
          "subcategory": "T-Shirts",
          "gender": "Unisex",
          "target_age_group": "Adult",
          "description": "A comfortable cotton t-shirt with short sleeves",
          "tags": "casual,cotton,comfortable,everyday"
        }
      ],
      "brands": [
        {
          "name": "Nike"
        }
      ],
      "colors": [
        {
          "name": "White"
        },
        {
          "name": "Blue"
        }
      ],
      "sizes": [
        {
          "name": "M"
        }
      ],
      "attributes": [
        {
          "name": "Material",
          "value": "Cotton",
          "confidence_score": 0.95
        },
        {
          "name": "Sleeve Length",
          "value": "Short",
          "confidence_score": 0.90
        }
      ]
    }
  }
}
```

---

## 14. Analyze and Create Product
**POST** `/api/products/analyze-and-create`

### Request
```json
{
  "imageUrls": [
    "https://example.com/product-image1.jpg",
    "https://example.com/product-image2.jpg"
  ],
  "additionalData": {
    "price": 39.99,
    "stock": 100,
    "brand": "Custom Brand"
  }
}
```

### Response
```json
{
  "success": true,
  "message": "Product created from image analysis successfully",
  "data": {
    "product": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3ba",
      "name": "Cotton T-Shirt",
      "product_type": "Top",
      "category": "Clothing",
      "subcategory": "T-Shirts",
      "gender": "Unisex",
      "target_age_group": "Adult",
      "description": "A comfortable cotton t-shirt with short sleeves",
      "brand": "Custom Brand",
      "colors": ["White", "Blue"],
      "sizes": ["M"],
      "tags": ["casual", "cotton", "comfortable", "everyday"],
      "price": 39.99,
      "stock": 100,
      "attributes": [
        {
          "name": "Material",
          "value": "Cotton",
          "confidence_score": 0.95,
          "_id": "60f7b3b3b3b3b3b3b3b3b3bb"
        }
      ],
      "images": [
        {
          "url": "https://example.com/product-image1.jpg",
          "alt": "Product image 1",
          "isPrimary": true,
          "_id": "60f7b3b3b3b3b3b3b3b3b3bc"
        },
        {
          "url": "https://example.com/product-image2.jpg",
          "alt": "Product image 2",
          "isPrimary": false,
          "_id": "60f7b3b3b3b3b3b3b3b3b3bd"
        }
      ],
      "createdAt": "2025-06-10T12:00:00.000Z",
      "updatedAt": "2025-06-10T12:00:00.000Z",
      "__v": 0
    },
    "analysis": {
      "success": true,
      "analysis": {
        // ... AI analysis results
      }
    }
  }
}
```

---

## 15. Get Unique Brands
**GET** `/api/products/metadata/brands`

### Request
No body required.

### Response
```json
{
  "success": true,
  "message": "Brands retrieved successfully",
  "data": [
    "Adidas",
    "Levi's",
    "Nike",
    "Puma",
    "Under Armour"
  ]
}
```

---

## 16. Get Unique Collections
**GET** `/api/products/metadata/collections`

### Request
No body required.

### Response
```json
{
  "success": true,
  "message": "Collections retrieved successfully",
  "data": [
    "Fall Collection 2024",
    "Spring Essentials",
    "Summer Essentials 2024",
    "Winter Collection 2024"
  ]
}
```

---

## 17. Get Unique Colors
**GET** `/api/products/metadata/colors`

### Request
No body required.

### Response
```json
{
  "success": true,
  "message": "Colors retrieved successfully",
  "data": [
    "Black",
    "Blue",
    "Forest Green",
    "Navy Blue",
    "Red",
    "White"
  ]
}
```

---

## 18. Get Unique Sizes
**GET** `/api/products/metadata/sizes`

### Request
No body required.

### Response
```json
{
  "success": true,
  "message": "Sizes retrieved successfully",
  "data": [
    "10",
    "11",
    "28",
    "30",
    "32",
    "34",
    "36",
    "7",
    "8",
    "9",
    "L",
    "M",
    "S",
    "XL",
    "XS",
    "XXL"
  ]
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Product name is required",
      "path": "name",
      "location": "body"
    }
  ]
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Product not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Notes

1. **Authentication**: Add appropriate authentication headers if your API requires them.
2. **File Uploads**: Use `Content-Type: multipart/form-data` for image upload endpoints.
3. **Pagination**: All list endpoints support pagination with `page` and `limit` query parameters.
4. **Filtering**: Most endpoints support various filtering options via query parameters.
5. **Validation**: All create/update endpoints validate input according to the schema rules.
6. **Text Fields**: Brand, collection, colors, and sizes are now simple text fields instead of ObjectId references.
