# Quick Start Guide: AI Product Analysis

## Setup Instructions

### 1. Environment Setup
Add your Gemini API key to your `.env` file:
```env
GEMINI_API_KEY=your-actual-gemini-api-key
```

### 2. Start the Server
```bash
npm run dev
```

### 3. Get Authentication Token
First, register or login to get a JWT token:

**Register:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the returned `token` for the next steps.

### 4. Test Image Analysis

**Analyze Product Images:**
```bash
curl -X POST http://localhost:3000/api/v1/products/analyze-images \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrls": [
      "https://example.com/your-product-image.jpg"
    ]
  }'
```

**Create Product from Analysis:**
```bash
curl -X POST http://localhost:3000/api/v1/products/analyze-and-create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrls": [
      "https://example.com/your-product-image.jpg"
    ],
    "additionalData": {
      "price": 99.99,
      "stock": 5
    }
  }'
```

## Available Endpoints

1. **POST** `/api/v1/products/analyze-images` - Analyze product images
2. **POST** `/api/v1/products/analyze-and-create` - Analyze and create product
3. **POST** `/api/v1/products/upload-image` - Upload single image to Cloudinary
4. **POST** `/api/v1/products/upload-images` - Upload multiple images to Cloudinary
5. **DELETE** `/api/v1/products/delete-image` - Delete image from Cloudinary

## Testing with Real Images

For testing, you can use these publicly available fashion image URLs:
- https://images.unsplash.com/photo-1544966503-7cc5ac882d5e (dress)
- https://images.unsplash.com/photo-1549298916-b41d501d3772 (sneaker)
- https://images.unsplash.com/photo-1551028719-00167b16eac5 (handbag)

## Complete Workflow Example

1. **Upload image to Cloudinary:**
   ```bash
   curl -X POST http://localhost:3000/api/v1/products/upload-image \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -F "image=@/path/to/your/image.jpg"
   ```

2. **Use the returned URL to analyze:**
   ```bash
   curl -X POST http://localhost:3000/api/v1/products/analyze-and-create \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "imageUrls": ["CLOUDINARY_URL_FROM_STEP_1"],
       "additionalData": {"price": 199.99, "stock": 10}
     }'
   ```

## Troubleshooting

- **"Gemini AI service is not configured"**: Make sure `GEMINI_API_KEY` is set in your .env file
- **"Access denied"**: Ensure you're using a valid JWT token in the Authorization header
- **"Invalid image URLs"**: Make sure the URLs point to actual image files and are publicly accessible
- **Network errors**: Check that the image URLs are accessible from your server
