export const fetchFoodInfo = async (barcode) => {
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const result = await response.json();
  
      if (result && result.status === 1) {
        return result.product; // Return product data if found
      } else {
        throw new Error("Product not found in database.");
      }
    } catch (err) {
      throw new Error("Error fetching product info.");
    }
  };
  