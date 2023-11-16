const productController = require('../controllers/product_controller')

const productRoutes = [
  {
    method: 'GET',
    path: '/products',
    handler: productController.getProducts,
  },
  {
    method: 'GET',
    path: '/products/{id}',
    handler: productController.getProductById,
  },
  {
    method: 'POST',
    path: '/products',
    handler: productController.createProduct,
  },
  {
    method: 'PUT',
    path: '/products/{id}',
    handler: productController.updateProduct,
  },
  {
    method: 'DELETE',
    path: '/products/{id}',
    handler: productController.deleteProduct,
  },
];

module.exports = productRoutes;