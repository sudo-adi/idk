# Folder CRUD API Documentation

This document describes the Folder management endpoints for organizing products into collections.

## Folder Model Structure

```javascript
{
  "_id": "ObjectId",
  "name": "String (required, max 100 chars)",
  "productIds": ["ObjectId[]"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Endpoints

### 1. Create Folder

**Endpoint:** `POST /api/v1/folders`

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "name": "Summer Collection",
  "productIds": [
    "60d5ec49f1b2c72b1c8e4e4e",
    "60d5ec49f1b2c72b1c8e4e4f"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Folder created successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b1c8e4e50",
    "name": "Summer Collection",
    "productIds": [
      "60d5ec49f1b2c72b1c8e4e4e",
      "60d5ec49f1b2c72b1c8e4e4f"
    ],
    "createdAt": "2025-06-10T12:00:00.000Z",
    "updatedAt": "2025-06-10T12:00:00.000Z"
  }
}
```

### 2. Get All Folders

**Endpoint:** `GET /api/v1/folders`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search folders by name

**Response:**
```json
{
  "success": true,
  "message": "Folders retrieved successfully",
  "data": {
    "folders": [
      {
        "_id": "60d5ec49f1b2c72b1c8e4e50",
        "name": "Summer Collection",
        "productIds": [
          {
            "_id": "60d5ec49f1b2c72b1c8e4e4e",
            "name": "Summer Dress",
            "price": 99.99,
            "images": [...]
          }
        ],
        "productCount": 2,
        "createdAt": "2025-06-10T12:00:00.000Z"
      }
    ],
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

### 3. Get Single Folder

**Endpoint:** `GET /api/v1/folders/:id`

**Response:**
```json
{
  "success": true,
  "message": "Folder retrieved successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b1c8e4e50",
    "name": "Summer Collection",
    "productIds": [
      {
        "_id": "60d5ec49f1b2c72b1c8e4e4e",
        "name": "Summer Dress",
        "price": 99.99,
        "images": [...],
        "description": "Beautiful summer dress",
        "category": "Clothing"
      }
    ],
    "productCount": 1,
    "createdAt": "2025-06-10T12:00:00.000Z"
  }
}
```

### 4. Update Folder

**Endpoint:** `PUT /api/v1/folders/:id`

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "name": "Updated Summer Collection",
  "productIds": [
    "60d5ec49f1b2c72b1c8e4e4e"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Folder updated successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b1c8e4e50",
    "name": "Updated Summer Collection",
    "productIds": [...],
    "updatedAt": "2025-06-10T12:30:00.000Z"
  }
}
```

### 5. Delete Folder

**Endpoint:** `DELETE /api/v1/folders/:id`

**Authentication:** Required (Bearer Token)

**Response:**
```json
{
  "success": true,
  "message": "Folder deleted successfully",
  "data": null
}
```

### 6. Add Products to Folder

**Endpoint:** `POST /api/v1/folders/:id/add-products`

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "productIds": [
    "60d5ec49f1b2c72b1c8e4e51",
    "60d5ec49f1b2c72b1c8e4e52"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Products added to folder successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b1c8e4e50",
    "name": "Summer Collection",
    "productIds": [...],
    "productCount": 4
  }
}
```

### 7. Remove Products from Folder

**Endpoint:** `POST /api/v1/folders/:id/remove-products`

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "productIds": [
    "60d5ec49f1b2c72b1c8e4e51"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Products removed from folder successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b1c8e4e50",
    "name": "Summer Collection",
    "productIds": [...],
    "productCount": 3
  }
}
```

### 8. Get Folders by Product

**Endpoint:** `GET /api/v1/folders/by-product/:productId`

**Response:**
```json
{
  "success": true,
  "message": "Folders containing product retrieved successfully",
  "data": {
    "productId": "60d5ec49f1b2c72b1c8e4e4e",
    "folders": [
      {
        "_id": "60d5ec49f1b2c72b1c8e4e50",
        "name": "Summer Collection",
        "productIds": [...],
        "productCount": 3
      }
    ]
  }
}
```

## Usage Examples

### Using cURL

#### Create a Folder
```bash
curl -X POST http://localhost:3000/api/v1/folders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Winter Collection",
    "productIds": ["60d5ec49f1b2c72b1c8e4e4e"]
  }'
```

#### Get All Folders with Search
```bash
curl -X GET "http://localhost:3000/api/v1/folders?search=summer&page=1&limit=5" \
  -H "Content-Type: application/json"
```

#### Add Products to Folder
```bash
curl -X POST http://localhost:3000/api/v1/folders/60d5ec49f1b2c72b1c8e4e50/add-products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productIds": ["60d5ec49f1b2c72b1c8e4e51", "60d5ec49f1b2c72b1c8e4e52"]
  }'
```

### Using JavaScript/Fetch

```javascript
// Create folder
const createFolder = async (name, productIds, token) => {
  const response = await fetch('/api/v1/folders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, productIds })
  });
  return await response.json();
};

// Get folders with search
const getFolders = async (search = '', page = 1) => {
  const response = await fetch(`/api/v1/folders?search=${search}&page=${page}`);
  return await response.json();
};

// Add products to folder
const addProductsToFolder = async (folderId, productIds, token) => {
  const response = await fetch(`/api/v1/folders/${folderId}/add-products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ productIds })
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
      "value": "",
      "msg": "Name must be between 1 and 100 characters",
      "path": "name",
      "location": "body"
    }
  ]
}
```

### Not Found
```json
{
  "success": false,
  "message": "Folder not found"
}
```

### Invalid Product IDs
```json
{
  "success": false,
  "message": "One or more product IDs are invalid"
}
```

## Notes

1. **Product Validation:** All product IDs are validated to ensure they exist and are active
2. **Duplicate Prevention:** The model automatically prevents duplicate product IDs in a folder
3. **Authentication:** Create, update, delete, and product management operations require authentication
4. **Pagination:** The get all folders endpoint supports pagination
5. **Search:** You can search folders by name using case-insensitive regex
6. **Population:** Product details are automatically populated in responses where relevant
