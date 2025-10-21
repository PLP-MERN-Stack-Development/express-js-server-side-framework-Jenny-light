# Express.js RESTful API Assignment

# Express Products API

A comprehensive RESTful API built with Express.js for managing products. This project demonstrates best practices in API development including middleware implementation, error handling, authentication, and advanced features like pagination and search.

![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)
![Express](https://img.shields.io/badge/Express-v4.18+-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Examples](#examples)
- [Error Handling](#error-handling)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- ✅ **RESTful API Design** - Full CRUD operations following REST principles
- 🔒 **Authentication** - API key-based authentication for protected routes
- ✔️ **Input Validation** - Comprehensive validation with detailed error messages
- 🎯 **Error Handling** - Custom error classes with global error handler
- 📊 **Pagination** - Efficient data pagination for list endpoints
- 🔍 **Search Functionality** - Search products by name
- 🏷️ **Filtering** - Filter products by category
- 📈 **Statistics** - Get product statistics and analytics
- 📝 **Request Logging** - Custom middleware for logging all requests
- 🚀 **Production Ready** - Clean, well-organized, and commented code

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0 or higher)
- **npm** (v6.0 or higher)

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/express-products-api.git
cd express-products-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment** (Optional)

Create a `.env` file in the root directory:

```env
PORT=3000
API_KEY=your-secret-api-key
NODE_ENV=development
```

4. **Start the server**

```bash
# Production mode
npm start

# Development mode (with nodemon)
npm run dev
```

The server will start on `http://localhost:3000`

## 🚀 Usage

Once the server is running, you can access the API at `http://localhost:3000`

### Quick Test

Visit `http://localhost:3000/` in your browser to see the welcome message and available endpoints.

## 🛣️ API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Welcome message and API info |
| `GET` | `/api/products` | Get all products (supports pagination & filtering) |
| `GET` | `/api/products/:id` | Get a specific product by ID |
| `GET` | `/api/products/search?q=query` | Search products by name |
| `GET` | `/api/products/stats` | Get product statistics |

### Protected Endpoints (Require API Key)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/products` | Create a new product |
| `PUT` | `/api/products/:id` | Update an existing product |
| `DELETE` | `/api/products/:id` | Delete a product |

## 🔐 Authentication

Protected endpoints require an API key to be passed in the request headers:

```bash
x-api-key: your-secret-api-key
```

**Default API Key:** `your-secret-api-key` (Change this in production!)

## 📚 Examples

### Get All Products

```bash
curl http://localhost:3000/api/products
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "High-performance laptop for professionals",
      "price": 1299.99,
      "category": "Electronics",
      "inStock": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

### Get Products with Pagination

```bash
curl "http://localhost:3000/api/products?page=1&limit=2"
```

### Filter Products by Category

```bash
curl "http://localhost:3000/api/products?category=Electronics"
```

### Get Product by ID

```bash
curl http://localhost:3000/api/products/1
```

### Create a New Product

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-api-key" \
  -d '{
    "name": "Smartphone",
    "description": "Latest model smartphone",
    "price": 899.99,
    "category": "Electronics",
    "inStock": true
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 6,
    "name": "Smartphone",
    "description": "Latest model smartphone",
    "price": 899.99,
    "category": "Electronics",
    "inStock": true
  }
}
```

### Update a Product

```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-api-key" \
  -d '{
    "name": "Gaming Laptop",
    "description": "High-end gaming laptop",
    "price": 1499.99,
    "category": "Electronics",
    "inStock": true
  }'
```

### Delete a Product

```bash
curl -X DELETE http://localhost:3000/api/products/1 \
  -H "x-api-key: your-secret-api-key"
```

### Search Products

```bash
curl "http://localhost:3000/api/products/search?q=laptop"
```

### Get Product Statistics

```bash
curl http://localhost:3000/api/products/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProducts": 5,
    "inStockCount": 4,
    "outOfStockCount": 1,
    "categoryBreakdown": {
      "Electronics": 3,
      "Furniture": 2
    },
    "averagePrice": "375.19",
    "totalValue": "1875.95"
  }
}
```

## ⚠️ Error Handling

The API uses standard HTTP status codes and returns errors in a consistent format:

### Error Response Format

```json
{
  "success": false,
  "error": "Error message here",
  "details": ["Additional error details if applicable"]
}
```

### Common Status Codes

| Status Code | Description |
|-------------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request (Validation Error) |
| `401` | Unauthorized (Invalid/Missing API Key) |
| `404` | Not Found |
| `500` | Internal Server Error |

### Example Error Responses

**Product Not Found (404):**
```json
{
  "success": false,
  "error": "Product with ID 999 not found"
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "Name is required and must be a non-empty string",
    "Price is required and must be a non-negative number"
  ]
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "error": "Unauthorized: Invalid or missing API key"
}
```

## 📁 Project Structure

```
express-products-api/
├── server.js          # Main application file
├── package.json       # Dependencies and scripts
├── package-lock.json  # Locked versions of dependencies
├── .gitignore         # Git ignore file
└── README.md          # This file
```

### Product Data Model

```javascript
{
  id: number,          // Unique identifier (auto-generated)
  name: string,        // Product name (required)
  description: string, // Product description (optional)
  price: number,       // Price (required, must be >= 0)
  category: string,    // Product category (required)
  inStock: boolean     // Availability status (default: true)
}
```

## 🧪 Testing with Postman

1. Import the API endpoints into Postman
2. Set the base URL to `http://localhost:3000`
3. For protected routes, add header: `x-api-key: your-secret-api-key`
4. Test each endpoint with the examples provided above

## 🔄 Sample Data

The API comes with 5 pre-loaded products:

1. **Laptop** - Electronics, $1,299.99
2. **Wireless Mouse** - Electronics, $29.99
3. **Office Chair** - Furniture, $349.99 (Out of Stock)
4. **Desk Lamp** - Furniture, $45.99
5. **Mechanical Keyboard** - Electronics, $149.99

## 🚧 Roadmap

Future enhancements planned:

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] JWT authentication
- [ ] Rate limiting
- [ ] Unit and integration tests
- [ ] API documentation with Swagger
- [ ] Image upload for products
- [ ] User management system
- [ ] Order management
- [ ] Payment integration

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Jennifer Omoregier**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Built with [Express.js](https://expressjs.com/)
- Inspired by RESTful API best practices
- Thanks to the Node.js community

## 📞 Support

For questions or support, please open an issue in the GitHub repository or contact me at your.email@example.com

---

⭐ If you find this project helpful, please consider giving it a star on GitHub!
