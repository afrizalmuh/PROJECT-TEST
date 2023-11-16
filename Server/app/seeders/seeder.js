const axios = require('axios')
const db = require('../configs/database')
const productService = require('../services/product_service')

const consumer_key = "ck_1cbb2c1902d56b629cd9a555cc032c4b478b26ce";
const consumer_secret = "cs_7be10f0328c5b1d6a1a3077165b226af71d8b9dc";
async function fetchReportState() {
  try {
    // Encode the Consumer Key and Consumer Secret as a base64 string
    const base64Credentials = Buffer.from(
      `${consumer_key}:${consumer_secret}`
    ).toString("base64");

    const response = await axios({
      method: "GET",
      url: "https://codetesting.jubelio.store/wp-json/wc/v3/products/", // Make sure to include the full URL
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("ERROR => ", error);
  }
}

(async function main() {
  try {

    const products = await fetchReportState();
    const simplifiedProducts = products.map((product) => ({
      sku: product.sku,
      name: product.name,
      image: product.images[0]?.src || "",
      price: product.price,
      description: product.description,
    }));

    await productService.insertBulkProducts(simplifiedProducts, db);

    console.log('Data inserted into the "Products" table successfully.');
  } catch (error) {
    console.error(error);
  }
})();