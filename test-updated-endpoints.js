const axios = require('axios');

// Test script for updated product endpoints
const BASE_URL = 'http://localhost:5000/api';

async function testEndpoints() {
    try {
        console.log('Testing updated product endpoints...\n');

        // Test 1: Create a product with new text field structure
        console.log('1. Testing product creation with text fields...');
        const newProduct = {
            name: "Test Product",
            product_type: "Top",
            category: "Clothing",
            subcategory: "T-Shirts",
            gender: "Unisex",
            target_age_group: "Adult",
            description: "A test product with text-based fields for brand, collection, colors, and sizes",
            brand: "Test Brand",
            collection: "Test Collection",
            colors: ["Red", "Blue", "Green"],
            sizes: ["S", "M", "L", "XL"],
            tags: ["test", "sample", "demo"],
            price: 29.99,
            stock: 100,
            attributes: [
                {
                    name: "Material",
                    value: "Cotton",
                    confidence_score: 0.95
                }
            ]
        };

        try {
            const createResponse = await axios.post(`${BASE_URL}/products`, newProduct);
            console.log('✅ Product created successfully');
            console.log(`   Product ID: ${createResponse.data.data._id}`);
            
            // Store the product ID for testing
            const productId = createResponse.data.data._id;

            // Test 2: Get the created product
            console.log('\n2. Testing product retrieval...');
            const getResponse = await axios.get(`${BASE_URL}/products/${productId}`);
            console.log('✅ Product retrieved successfully');
            console.log(`   Brand: ${getResponse.data.data.brand}`);
            console.log(`   Colors: ${getResponse.data.data.colors.join(', ')}`);
            console.log(`   Sizes: ${getResponse.data.data.sizes.join(', ')}`);

            // Test 3: Test filtering by brand
            console.log('\n3. Testing brand filtering...');
            const brandFilterResponse = await axios.get(`${BASE_URL}/products?brand=Test Brand`);
            console.log('✅ Brand filtering works');
            console.log(`   Found ${brandFilterResponse.data.data.products.length} products`);

            // Test 4: Test filtering by color
            console.log('\n4. Testing color filtering...');
            const colorFilterResponse = await axios.get(`${BASE_URL}/products?color=Red`);
            console.log('✅ Color filtering works');
            console.log(`   Found ${colorFilterResponse.data.data.products.length} products`);

            // Test 5: Test utility endpoints
            console.log('\n5. Testing utility endpoints...');
            
            const brandsResponse = await axios.get(`${BASE_URL}/products/metadata/brands`);
            console.log('✅ Brands metadata endpoint works');
            console.log(`   Brands: ${brandsResponse.data.data.join(', ')}`);

            const colorsResponse = await axios.get(`${BASE_URL}/products/metadata/colors`);
            console.log('✅ Colors metadata endpoint works');
            console.log(`   Colors: ${colorsResponse.data.data.join(', ')}`);

            const sizesResponse = await axios.get(`${BASE_URL}/products/metadata/sizes`);
            console.log('✅ Sizes metadata endpoint works');
            console.log(`   Sizes: ${sizesResponse.data.data.join(', ')}`);

            const collectionsResponse = await axios.get(`${BASE_URL}/products/metadata/collections`);
            console.log('✅ Collections metadata endpoint works');
            console.log(`   Collections: ${collectionsResponse.data.data.join(', ')}`);

            // Test 6: Test products by brand endpoint
            console.log('\n6. Testing products by brand endpoint...');
            const productsByBrandResponse = await axios.get(`${BASE_URL}/products/brand/Test Brand`);
            console.log('✅ Products by brand endpoint works');
            console.log(`   Found ${productsByBrandResponse.data.data.products.length} products`);

            // Clean up - delete the test product
            console.log('\n7. Cleaning up...');
            await axios.delete(`${BASE_URL}/products/${productId}`);
            console.log('✅ Test product deleted');

        } catch (error) {
            console.error('❌ Error in product operations:', error.response?.data || error.message);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
if (require.main === module) {
    testEndpoints().then(() => {
        console.log('\n🎉 All tests completed!');
        process.exit(0);
    }).catch(error => {
        console.error('\n💥 Test suite failed:', error);
        process.exit(1);
    });
}

module.exports = testEndpoints;
