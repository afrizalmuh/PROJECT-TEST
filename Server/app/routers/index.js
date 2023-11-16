const productService = require('../services/product_service')

module.exports = (db) => [
  {
    method: "GET",
    path: "/products",

    handler: async (request, h) => {
      try {
        const products = await productService.getProducts(request, h, db);
        return products;
      } catch (error) {
        console.error(error);
        return h.response("Error fetching products").code(500);
      }
    },
  },
]