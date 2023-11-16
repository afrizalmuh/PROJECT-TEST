const pgp = require('pg-promise')();
const db = require('../configs/database')

async function createTables() {
  try {
    // Define SQL queries for creating the "products" and "users" tables
    const createProductsTableQuery = `
      CREATE TABLE IF NOT EXISTS
      Products (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        SKU VARCHAR NOT NULL UNIQUE,
        image VARCHAR,
        price VARCHAR NOT NULL,
        description VARCHAR,
        createdAt TIMESTAMPTZ DEFAULT NOW(),
        updatedAt TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        user_name VARCHAR(128) NOT NULL UNIQUE,
        password VARCHAR(128) NOT NULL,
        email VARCHAR(128) NOT NULL UNIQUE,
        createdAt TIMESTAMPTZ DEFAULT NOW(),
        updatedAt TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    // Execute the queries
    await db.none(createProductsTableQuery);
    await db.none(createUsersTableQuery);

    console.log('Tables "products" and "users" created successfully.');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    pgp.end(); // Close the database connection
  }
}

// Call the function to create the tables
createTables();
