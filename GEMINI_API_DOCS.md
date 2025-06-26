# Product Image Analysis API Documentation

This document describes the AI-powered product image analysis endpoints that use Google's Gemini AI to analyze fashion product images.

## Prerequisites

1. Set up your Gemini API key in your `.env` file:
   ```
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

2. Ensure you have proper authentication (JWT token) for all endpoints.

## Endpoints

### 1. Analyze Product Images

**Endpoint:** `POST /api/v1/products/analyze-images`

**Description:** Analyzes product images using Gemini AI and returns detailed product information.

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "imageUrls": [
    "https://example.com/product1.jpg",
    "https://example.com/product2.png"
  ],
  "analyzeIndividually": false  // Optional: analyze images separately or together
}
```

**Request Validation:**
- `imageUrls`: Array of 1-5 valid image URLs (jpg, jpeg, png, gif, webp)
- `analyzeIndividually`: Optional boolean, defaults to false

**Response Example:**
```json
{
  "success": true,
  "message": "Product images analyzed successfully",
  "data": {
    "success": true,
    "analysis": {
      "products": [
        {
          "name": "Elegant Sleeveless Evening Gown",
          "confidence_score": 0.75
        },
        {
          "product_type": "Dress",
          "confidence_score": 0.98
        },
        {
          "category": "Clothing",
          "confidence_score": 0.99
        }
      ],
      "brands": [
        {
          "name": "Luxury Designs",
          "confidence_score": 0.55
        }
      ],
      "colors": [
        {
          "name": "Silver",
          "confidence_score": 0.96
        }
      ],
      "attributes": [
        {
          "name": "Neckline",
          "value": "Sweetheart",
          "confidence_score": 0.94
        },
        {
          "name": "Sleeve Length",
          "value": "Sleeveless",
          "confidence_score": 0.99
        }
      ]
    },
    "metadata": {
      "imageCount": 2,
      "modelUsed": "gemini-1.5-flash",
      "analysisTimestamp": "2025-06-10T12:00:00.000Z"
    }
  },
  "timestamp": "2025-06-10T12:00:00.000Z"
}
```

### 2. Analyze and Create Product

**Endpoint:** `POST /api/v1/products/analyze-and-create`

**Description:** Analyzes product images and automatically creates a new product in the database based on the analysis.

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "imageUrls": [
    "https://example.com/product1.jpg",
    "https://example.com/product2.png"
  ],
  "additionalData": {
    "price": 199.99,
    "stock": 10,
    "name": "Custom Product Name"  // Optional: override AI-generated name
  }
}
```

**Request Validation:**
- `imageUrls`: Array of 1-5 valid image URLs (jpg, jpeg, png, gif, webp)
- `additionalData`: Optional object with business-specific data
  - `price`: Optional non-negative number
  - `stock`: Optional non-negative integer

**Response Example:**
```json
{
  "success": true,
  "message": "Product created from image analysis successfully",
  "data": {
    "product": {
      "_id": "60d5ec49f1b2c72b1c8e4e4e",
      "name": "Elegant Sleeveless Evening Gown",
      "product_type": "Dress",
      "category": "Clothing",
      "subcategory": "Evening Dress",
      "gender": "Female",
      "target_age_group": "Adult",
      "description": "A floor-length sleeveless evening gown...",
      "price": 199.99,
      "stock": 10,
      "images": [
        {
          "url": "https://example.com/product1.jpg",
          "alt": "Product image 1",
          "isPrimary": true
        }
      ],
      "attributes": [...],
      "analysis_confidence": 0.8,
      "analyzed_at": "2025-06-10T12:00:00.000Z",
      "createdBy": "60d5ec49f1b2c72b1c8e4e4d",
      "createdAt": "2025-06-10T12:00:00.000Z",
      "updatedAt": "2025-06-10T12:00:00.000Z"
    },
    "analysis": {
      // Full analysis results...
    }
  },
  "timestamp": "2025-06-10T12:00:00.000Z"
}
```

## Usage Examples

### Using cURL

#### Analyze Images
```bash
curl -X POST http://localhost:3000/api/v1/products/analyze-images \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrls": [
      "https://example.com/dress.jpg"
    ],
    "analyzeIndividually": false
  }'
```

#### Analyze and Create Product
```bash
curl -X POST http://localhost:3000/api/v1/products/analyze-and-create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrls": [
      "https://example.com/dress.jpg"
    ],
    "additionalData": {
      "price": 299.99,
      "stock": 5
    }
  }'
```

### Using JavaScript/Fetch

```javascript
// Analyze images
const analyzeImages = async (imageUrls, token) => {
  const response = await fetch('/api/v1/products/analyze-images', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      imageUrls: imageUrls,
      analyzeIndividually: false
    })
  });
  
  return await response.json();
};

// Analyze and create product
const analyzeAndCreate = async (imageUrls, additionalData, token) => {
  const response = await fetch('/api/v1/products/analyze-and-create', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      imageUrls: imageUrls,
      additionalData: additionalData
    })
  });
  
  return await response.json();
};
```

## Error Responses

### Validation Errors
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    {
      "type": "field",
      "value": "invalid-url",
      "msg": "Each URL must be a valid URL",
      "path": "imageUrls.0",
      "location": "body"
    }
  ],
  "timestamp": "2025-06-10T12:00:00.000Z"
}
```

### Authentication Errors
```json
{
  "success": false,
  "message": "Access denied. No token provided.",
  "timestamp": "2025-06-10T12:00:00.000Z"
}
```

### Service Configuration Errors
```json
{
  "success": false,
  "message": "Gemini AI service is not configured. Please contact administrator.",
  "timestamp": "2025-06-10T12:00:00.000Z"
}
```

## Notes

1. **Image Requirements:**
   - Supported formats: JPG, JPEG, PNG, GIF, WEBP
   - Maximum 5 images per request
   - Images must be accessible via public URLs
   - Recommended image size: under 4MB each

2. **Rate Limits:**
   - Standard API rate limits apply
   - Gemini API has its own rate limits

3. **Confidence Scores:**
   - All analysis results include confidence scores (0.0 to 1.0)
   - Higher scores indicate more certainty in the analysis
   - Use confidence scores to determine which data to trust

4. **Analysis Modes:**
   - `analyzeIndividually: false` (default): Analyzes all images together as one product
   - `analyzeIndividually: true`: Analyzes each image separately and returns individual results

5. **Product Creation:**
   - The `analyze-and-create` endpoint automatically populates product fields based on AI analysis
   - You can override any field using the `additionalData` parameter
   - Required fields that can't be analyzed will use default values
