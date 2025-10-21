// server.js - Clean Express server for Week 2 assignment

// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// ============================================
// TASK 3: MIDDLEWARE IMPLEMENTATION
// ============================================

// Custom Logger Middleware
const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

// JSON Body Parser Middleware
app.use(express.json());

// Apply Logger Middleware
app.use(loggerMiddleware);

// Authentication Middleware
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== 'your-secret-api-key') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or missing API key'
    });
  }
  
  next();
};

// Validation Middleware for Product Creation/Update
const validateProduct = (req, res, next) => {
  const { name, price, category, inStock } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }

  if (price === undefined || typeof price !== 'number' || price < 0) {
    errors.push('Price is required and must be a non-negative number');
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.push('Category is required and must be a non-empty string');
  }

  if (inStock !== undefined && typeof inStock !== 'boolean') {
    errors.push('inStock must be a boolean value');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

// ============================================
// TASK 4: ERROR HANDLING
// ============================================

// Custom Error Classes
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
  }
}

// Async Error Wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// ============================================
// IN-MEMORY DATA STORE
// ============================================

let products = [
  {
    id: 1,
    name: 'Laptop',
    description: 'High-performance laptop for professionals',
    price: 1299.99,
    category: 'Electronics',
    inStock: true
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse',
    price: 29.99,
    category: 'Electronics',
    inStock: true
  },
  {
    id: 3,
    name: 'Office Chair',
    description: 'Comfortable ergonomic office chair',
    price: 349.99,
    category: 'Furniture',
    inStock: false
  },
  {
    id: 4,
    name: 'Desk Lamp',
    description: 'LED desk lamp with adjustable brightness',
    price: 45.99,
    category: 'Furniture',
    inStock: true
  },
  {
    id: 5,
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical gaming keyboard',
    price: 149.99,
    category: 'Electronics',
    inStock: true
  }
];

let nextId = 6;

// ============================================
// TASK 1: BASIC EXPRESS SERVER
// ============================================

// Hello World Route at Root Endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Hello World',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      search: '/api/products/search',
      stats: '/api/products/stats'
    }
  });
});

// ============================================
// TASK 2: RESTful API ROUTES
// ============================================

// GET /api/products - List all products with filtering and pagination
app.get('/api/products', asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;
  
  let filteredProducts = [...products];
  
  // Filter by category if provided
  if (category) {
    filteredProducts = filteredProducts.filter(
      p => p.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: paginatedProducts,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / limitNum)
    }
  });
}));

// GET /api/products/:id - Get a specific product by ID
app.get('/api/products/:id', asyncHandler(async (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    throw new NotFoundError(`Product with ID ${productId} not found`);
  }
  
  res.json({
    success: true,
    data: product
  });
}));

// POST /api/products - Create a new product (requires authentication and validation)
app.post('/api/products', authMiddleware, validateProduct, asyncHandler(async (req, res) => {
  const { name, description = '', price, category, inStock = true } = req.body;
  
  const newProduct = {
    id: nextId++,
    name: name.trim(),
    description: description.trim(),
    price,
    category: category.trim(),
    inStock
  };
  
  products.push(newProduct);
  
  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: newProduct
  });
}));

// PUT /api/products/:id - Update an existing product (requires authentication and validation)
app.put('/api/products/:id', authMiddleware, validateProduct, asyncHandler(async (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    throw new NotFoundError(`Product with ID ${productId} not found`);
  }
  
  const { name, description, price, category, inStock } = req.body;
  
  products[productIndex] = {
    ...products[productIndex],
    name: name.trim(),
    description: description ? description.trim() : products[productIndex].description,
    price,
    category: category.trim(),
    inStock: inStock !== undefined ? inStock : products[productIndex].inStock
  };
  
  res.json({
    success: true,
    message: 'Product updated successfully',
    data: products[productIndex]
  });
}));

// DELETE /api/products/:id - Delete a product (requires authentication)
app.delete('/api/products/:id', authMiddleware, asyncHandler(async (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    throw new NotFoundError(`Product with ID ${productId} not found`);
  }
  
  const deletedProduct = products.splice(productIndex, 1)[0];
  
  res.json({
    success: true,
    message: 'Product deleted successfully',
    data: deletedProduct
  });
}));

// ============================================
// TASK 5: ADVANCED FEATURES
// ============================================

// Search products by name
app.get('/api/products/search', asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    throw new ValidationError('Search query parameter "q" is required');
  }
  
  const searchResults = products.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase())
  );
  
  res.json({
    success: true,
    query: q,
    count: searchResults.length,
    data: searchResults
  });
}));

// Get product statistics
app.get('/api/products/stats', asyncHandler(async (req, res) => {
  const stats = {
    totalProducts: products.length,
    inStockCount: products.filter(p => p.inStock).length,
    outOfStockCount: products.filter(p => !p.inStock).length,
    categoryBreakdown: {},
    averagePrice: 0,
    totalValue: 0
  };
  
  // Calculate category breakdown
  products.forEach(p => {
    if (!stats.categoryBreakdown[p.category]) {
      stats.categoryBreakdown[p.category] = 0;
    }
    stats.categoryBreakdown[p.category]++;
  });
  
  // Calculate price statistics
  if (products.length > 0) {
    const totalPrice = products.reduce((sum, p) => sum + p.price, 0);
    stats.averagePrice = (totalPrice / products.length).toFixed(2);
    stats.totalValue = totalPrice.toFixed(2);
  }
  
  res.json({
    success: true,
    data: stats
  });
}));

// ============================================
// GLOBAL ERROR HANDLING MIDDLEWARE
// ============================================

// 404 Handler for undefined routes
app.use((req, res, next) => {
  throw new NotFoundError(`Route ${req.originalUrl} not found`);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET    /`);
  console.log(`  GET    /api/products`);
  console.log(`  GET    /api/products/:id`);
  console.log(`  POST   /api/products`);
  console.log(`  PUT    /api/products/:id`);
  console.log(`  DELETE /api/products/:id`);
  console.log(`  GET    /api/products/search?q=query`);
  console.log(`  GET    /api/products/stats`);
  console.log(`\nNote: POST, PUT, DELETE require API key: x-api-key: your-secret-api-key`);
});