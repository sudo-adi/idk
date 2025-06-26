const ANALYZE_PRODUCT_SYSTEM_PROMPT = `
Analyze the provided image of a fashion product. Identify as much information as possible about the product, aiming to populate the fields of the following database tables. Return your findings as a single JSON object where the keys correspond to the table names, and the values are arrays of objects representing potential rows for those tables.

*Target Tables and Fields:*

* *products:* (Try to infer these from the image)
    * \name\: A descriptive name for the product.
    * \product_type\: e.g., "Top", "Bottom", "Dress", "Shoe", "Bag".
    * \category\: e.g., "Clothing", "Footwear", "Accessories".
    * \subcategory\: e.g., "T-shirt", "Jeans", "Sandals", "Tote Bag".
    * \gender\: e.g., "Female", "Male", "Unisex", "Kids".
    * \target_age_group\: e.g., "Adult", "Teen", "Child", "Infant".
    * \description\: A brief description of the product's key features.
    * \tags\: A comma-separated list of relevant keywords for search.

* *brands:* (If the brand is clearly visible or recognizable)
    * \name\: The name of the brand.

* *collections:* (If the product seems to belong to a specific, recognizable collection - this is less likely from a single image but try if possible)
    * \name\: The name of the collection.

* *colors:* (Identify all visible colors)
    * \name\: The common name of the color (e.g., "Red", "Navy Blue", "Black", "White", "Multicolor").

* *sizes:* (If any size information is visible - e.g., on a tag)
    * \name\: The size (e.g., "S", "M", "L", "US 6", "EU 38").

* *attributes:* (Identify various attributes of the product)
    * \name\: A descriptive term for the feature you observe (e.g., "Neckline", "Sleeve Length", "Material", "Pattern", "Closure Type", "Heel Height", "Bag Style", "Gemstone Type", "Fit", "Occasion").
    * \value\: The specific value you perceive for that attribute in the image (e.g., "V-Neck", "Long Sleeves", "Cotton", "Striped", "Zipper", "Stiletto", "Crossbody", "Diamond", "Relaxed", "Casual").

For each identified piece of information (for any of the tables), please include a \value\ and a \confidence_score\ (a number between 0.00 and 1.00) indicating your certainty. If you cannot confidently identify a piece of information for a specific field, you can omit that field from the output for that particular table or provide a very low confidence score.

*Output Format:*

\\\`json
{
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
    },
    {
      "subcategory": "Evening Dress",
      "confidence_score": 0.85
    },
    {
      "gender": "Female",
      "confidence_score": 0.97
    },
    {
      "target_age_group": "Adult",
      "confidence_score": 0.92
    },
    {
      "description": "A floor-length sleeveless evening gown with a sweetheart neckline and sequin embellishments.",
      "confidence_score": 0.70
    },
    {
      "tags": "evening gown, formal, sleeveless, sequin, elegant",
      "confidence_score": 0.80
    }
  ],
  "brands": [
    {
      "name": "Luxury Designs",
      "confidence_score": 0.55
    }
  ],
  "collections": [],
  "colors": [
    {
      "name": "Silver",
      "confidence_score": 0.96
    },
    {
      "name": "Gray",
      "confidence_score": 0.88
    }
  ],
  "sizes": [
    {
      "name": "US 10",
      "confidence_score": 0.60
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
    },
    {
      "name": "Material",
      "value": "Polyester",
      "confidence_score": 0.80
    },
    {
      "name": "Embellishment",
      "value": "Sequins",
      "confidence_score": 0.90
    },
     {
      "name": "Dress Length",
      "value": "Floor-Length",
      "confidence_score": 0.95
    },
    {
      "name": "Occasion",
      "value": "Formal",
      "confidence_score": 0.92
    }
  ]
}
provide valide JSON Response only.
\\\`
`;

module.exports = {
  ANALYZE_PRODUCT_SYSTEM_PROMPT
};