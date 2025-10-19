// server.js - Clean Express server for Week 2 assignment

const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Built-in middleware
app.use(bodyParser.json());

// Simple request logger for all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Protect all /api routes with a simple API key header middleware
app.use('/api', (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  // In a real app, don't hardcode secrets. Use env vars or a secrets manager.
  if (!apiKey || apiKey !== process.env.API_KEY && apiKey !== 'mysecretkey') {
    return res.status(401).json({ message: 'Unauthorized - missing or invalid API key' });
  }
  next();
});

// In-memory products store (sample data)
let products = [
  { id: '1', name: 'Laptop', description: 'High-performance laptop with 16GB RAM', price: 1200, category: 'electronics', inStock: true },
  { id: '2', name: 'Smartphone', description: 'Latest model with 128GB storage', price: 800, category: 'electronics', inStock: true },
  { id: '3', name: 'Coffee Maker', description: 'Programmable coffee maker with timer', price: 50, category: 'kitchen', inStock: false }
];

// Public root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Use /api/products (requires x-api-key header).');
});

// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (product) return res.json(product);
  return res.status(404).json({ message: 'Product not found' });
});

// POST /api/products - Create a new product
app.post('/api/products', (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ message: 'Missing required fields: name and price' });
  }
  const newProduct = { id: uuidv4(), name, description: description || '', price, category: category || 'uncategorized', inStock: inStock !== undefined ? inStock : true };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id - Update a product
app.put('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const { name, description, price, category, inStock } = req.body;
  product.name = name !== undefined ? name : product.name;
  product.description = description !== undefined ? description : product.description;
  product.price = price !== undefined ? price : product.price;
  product.category = category !== undefined ? category : product.category;
  product.inStock = inStock !== undefined ? inStock : product.inStock;
  res.json(product);
});

// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', (req, res) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Product not found' });
  products.splice(idx, 1);
  res.status(204).send();
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server when invoked directly (so module.exports remains usable for tests)
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
}

module.exports = app;