const db = require('../configs/database')

const getProducts = async (page, limit) => {
  const offset = (page - 1) * limit;
  const query =
    `SELECT p.id, p.name, p.sku, p.image, p.price
    FROM products p
    GROUP BY p.id, p.name, p.sku, p.image, p.price, p.description
    ORDER BY p.id ASC LIMIT $1 OFFSET $2`;

  const values = [limit, offset];

  try {
    const rows = await db.query(query, values);
    return rows;
  } catch (error) {
    throw new Error('Error retrieving products');
  }
};

const getProductById = async (id) => {
  const query =
    `SELECT p.name, p.sku, p.image, p.price, p.description
  FROM products p
  WHERE p.id = $1
  GROUP BY p.id, p.name, p.sku, p.image, p.price, p.description`;

  const values = [id];
  const rows = await db.query(query, values);

  if (rows.length === 0) {
    throw new Error('Product not found');
  }

  return rows[0];
};

const insertBulkProducts = async (products, db) => {
  try {
    const query = 'INSERT INTO products (sku, name, image, price, description) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (sku) DO NOTHING';

    for (const product of products) {
      const values = [product.sku, product.name, product.image, product.price, product.description];
      await db.none(query, values);
    }

    console.log('Products inserted into the database.');
  } catch (error) {
    console.error('Error inserting products:', error);
  }
};

const createProduct = async (productData) => {
  const { name, sku, image, price, description } = productData;
  const query =
    'INSERT INTO products (name, sku, image, price, description) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  const values = [name, sku, image, price, description];
  const rows = await db.query(query, values);

  return rows[0];
};

const updateProduct = async (id, productData) => {
  const { name, sku, image, price } = productData;
  const query =
    'UPDATE products SET name = $1, sku = $2, image = $3, price = $4, updatedat = NOW() WHERE id = $5 RETURNING *';
  const values = [name, sku, image, price, id];
  const rows = await db.query(query, values);

  if (rows.length === 0) {
    throw new Error('Product not found');
  }

  return rows[0];
};

const deleteProduct = async (id) => {
  const query = 'DELETE FROM products WHERE id = $1';
  const values = [id];
  await db.query(query, values);
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  insertBulkProducts
}