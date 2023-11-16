const productService = require('../services/product_service')
const productValidator = require('../helpers/validator')

const getProducts = async (request, h) => {
  const { page, per_page } = request.query;

  const pages = page || 1
  const limits = per_page || 8

  try {
    const products = await productService.getProducts(pages, limits);
    return h.response({
      code: 200,
      message: 'Products retrieved successfully',
      data: products,
    }).code(200);
  } catch (error) {
    return h.response({
      code: 500,
      message: 'Failed to retrieve products',
      error: 'Database error',
    }).code(500);
  }
};

const getProductById = async (request, h) => {
  try {
    const { id } = request.params;
    const product = await productService.getProductById(id);
    return h.response({
      code: 200,
      message: `Products retrieved successfully by id = ${id}`,
      data: product,
    }).code(200);
  } catch (error) {
    console.error('Error retrieving product', error);
    if (error.message === 'Product not found') {
      return h.response({
        code: 404,
        message: 'Product not found',
      }).code(404);
    }
    return h.response({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred.',
    }).code(500);
  }
};

const createProduct = async (request, h) => {
  try {
    const productData = request.payload;
    const validationError = productValidator.validateCreateProduct(request.payload);
    if (validationError !== null) {
      return h.response({
        code: 400,
        message: 'Validation error',
        error: validationError,
      }).code(400);
    }
    const createdProduct = await productService.createProduct(productData);
    return h.response({
      code: 200,
      message: 'Product created successfully',
      data: createdProduct,
    }).code(200);
  } catch (error) {
    console.error('Error creating product', error);
    return h.response({
      code: 500,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred.',
    }).code(500);
  }
};

const updateProduct = async (request, h) => {
  try {
    const { id } = request.params;
    const productData = request.payload;
    const validationError = productValidator.validateUpdateProduct(request.payload);
    if (validationError !== null) {
      return h.response({
        code: 400,
        error: 'Validation Error',
        message: validationError,
      }).code(400);
    }
    const updatedProduct = await productService.updateProduct(id, productData);
    return h.response({
      code: 200,
      message: 'Product updated successfully',
      data: updatedProduct,
    }).code(200);
  } catch (error) {
    console.error('Error updating product', error);
    if (error.message === 'Product not found') {
      return h.response({
        code: 404,
        error: 'Product Not Found',
        message: 'The requested product was not found.',
      }).code(404);
    }
    return h.response({
      code: 500,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred.',
    }).code(500);
  }
};

const deleteProduct = async (request, h) => {
  try {
    const { id } = request.params;
    await productService.deleteProduct(id);
    return h.response({
      code: 200,
      message: 'Product successfully deleted',
      productId: id,
    }).code(200);
  } catch (error) {
    console.error('Error deleting product', error);
    if (error.message === 'Product not found') {
      return h.response({
        code: 404,
        error: 'Product Not Found',
        message: 'The requested product was not found.',
      }).code(404);
    }
    return h.response({
      code: 500,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred.',
    }).code(500);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}