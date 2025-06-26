// Test file for Gemini AI Product Analysis
// This is for demonstration and manual testing

const GeminiService = require('../src/services/gemini.service');

// Example test function
async function testProductAnalysis() {
  try {
    // Example image URLs (replace with actual product image URLs)
    const testImageUrls = [
      'https://example.com/dress.jpg',
      'https://example.com/shoe.png'
    ];

    console.log('🔍 Testing Gemini Product Analysis...');
    console.log('Image URLs:', testImageUrls);

    const geminiService = new GeminiService();
    
    // Test individual analysis
    console.log('\n📊 Testing combined analysis...');
    const combinedResult = await geminiService.analyzeProductImages(testImageUrls);
    console.log('Combined Analysis Result:', JSON.stringify(combinedResult, null, 2));

    // Test separate analysis
    console.log('\n📋 Testing individual analysis...');
    const individualResult = await geminiService.analyzeProductImagesSeparately(testImageUrls);
    console.log('Individual Analysis Result:', JSON.stringify(individualResult, null, 2));

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Example API request format for testing with curl or Postman
const exampleRequest = {
  endpoint: 'POST /api/v1/products/analyze-images',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  },
  body: {
    imageUrls: [
      'https://example.com/fashion-item.jpg'
    ],
    analyzeIndividually: false
  }
};

const exampleCreateRequest = {
  endpoint: 'POST /api/v1/products/analyze-and-create',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  },
  body: {
    imageUrls: [
      'https://example.com/fashion-item.jpg'
    ],
    additionalData: {
      price: 99.99,
      stock: 10,
      name: 'Custom Product Name'
    }
  }
};

console.log('📝 Example API Requests:');
console.log('\n1. Analyze Images:');
console.log(JSON.stringify(exampleRequest, null, 2));
console.log('\n2. Analyze and Create Product:');
console.log(JSON.stringify(exampleCreateRequest, null, 2));

// Uncomment the line below to run the test (requires GEMINI_API_KEY in .env)
// testProductAnalysis();

module.exports = {
  testProductAnalysis,
  exampleRequest,
  exampleCreateRequest
};
