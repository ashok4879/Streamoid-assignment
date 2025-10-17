# Product Catalog Backend Service

A Node.js backend service for managing product catalogs for online sellers. This service allows sellers to upload their product data via CSV files, validate the data, and query products through REST APIs.

## Features

- **CSV Upload**: Upload and parse product catalogs from CSV files
- **Data Validation**: Automatic validation of product data with detailed error reporting
- **Product Storage**: Store validated products in a database
- **REST APIs**: Complete CRUD operations with search and filter capabilities
- **Pagination**: Efficient pagination support for large product catalogs
- **Advanced Search**: Filter products by brand, color, and price range

## Tech Stack

- **Language**: JavaScript (Node.js)
- **Framework**: Express.js
- **Database**: SQLite
- **Additional Libraries**:
  - `csv-parser` - CSV file parsing
  - `multer` - File upload handling
  - `sqlite3` - Database driver

## Prerequisites

- Node.js 14.x or higher
- npm or yarn

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/product-catalog-backend.git
cd product-catalog-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:
```env
PORT=8000
DATABASE_URL=./products.db
NODE_ENV=development
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start at `http://localhost:8000`

## API Documentation

### Base URL
```
http://localhost:8000
```

---

### 1. Upload Products (CSV)

Upload a CSV file containing product data for validation and storage.

**Endpoint:** `POST /upload`

**Request:**
```bash
curl -X POST -F "file=@products.csv" http://localhost:8000/upload
```

**CSV Format:**
```csv
sku,name,brand,color,size,mrp,price,quantity
TSHIRT-RED-001,Classic Cotton T-Shirt,StreamThreads,Red,M,799,499,20
JEANS-BLU-032,Slim Fit Jeans,DenimWorks,Blue,32,1999,1599,15
```

**Success Response:**
```json
{
  "stored": 17,
  "failed": [],
  "message": "Successfully processed 17 products"
}
```

**Partial Success Response:**
```json
{
  "stored": 15,
  "failed": [
    {
      "row": 3,
      "sku": "INVALID-SKU-001",
      "errors": [
        "price (2000) must be less than or equal to mrp (1500)",
        "quantity must be non-negative"
      ]
    }
  ],
  "message": "Processed 15 products, 2 failed validation"
}
```

**Validation Rules:**
- `sku` (required): Must be unique
- `name` (required): Cannot be empty
- `brand` (required): Cannot be empty
- `mrp` (required): Must be a positive number
- `price` (required): Must be ≤ MRP and positive
- `quantity`: Must be ≥ 0 (defaults to 0 if missing)
- `color`, `size`: Optional fields

---

### 2. List All Products

Retrieve all products with pagination support.

**Endpoint:** `GET /products`

**Query Parameters:**
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 10): Items per page

**Request:**
```bash
curl http://localhost:8000/products?page=1&limit=10
```

**Response:**
```json
{
  "products": [
    {
      "sku": "TSHIRT-RED-001",
      "name": "Classic Cotton T-Shirt",
      "brand": "StreamThreads",
      "color": "Red",
      "size": "M",
      "mrp": 799,
      "price": 499,
      "quantity": 20
    },
    {
      "sku": "JEANS-BLU-032",
      "name": "Slim Fit Jeans",
      "brand": "DenimWorks",
      "color": "Blue",
      "size": "32",
      "mrp": 1999,
      "price": 1599,
      "quantity": 15
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 17,
    "totalPages": 2
  }
}
```

---

### 3. Search Products

Search and filter products by various criteria.

**Endpoint:** `GET /products/search`

**Query Parameters:**
- `brand` (optional): Filter by brand name
- `color` (optional): Filter by color
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 10): Items per page

**Request Examples:**
```bash
# Search by brand
curl "http://localhost:8000/products/search?brand=StreamThreads"

# Search by color
curl "http://localhost:8000/products/search?color=Red"

# Search by price range
curl "http://localhost:8000/products/search?minPrice=500&maxPrice=2000"

# Combined filters
curl "http://localhost:8000/products/search?brand=BloomWear&maxPrice=2500"
```

**Response:**
```json
{
  "products": [
    {
      "sku": "DRESS-PNK-S",
      "name": "Floral Summer Dress",
      "brand": "BloomWear",
      "color": "Pink",
      "size": "S",
      "mrp": 2499,
      "price": 2199,
      "quantity": 10
    }
  ],
  "filters": {
    "brand": "BloomWear",
    "maxPrice": 2500
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## Database Schema

### Products Table
```sql
CREATE TABLE products (
    sku VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    color VARCHAR(100),
    size VARCHAR(50),
    mrp DECIMAL(10, 2) NOT NULL CHECK (mrp > 0),
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0 AND price <= mrp),
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0)
);
```

---

## Project Structure
```
product-catalog-backend/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   └── product.js
│   ├── routes/
│   │   └── products.js
│   ├── controllers/
│   │   └── productController.js
│   ├── services/
│   │   ├── csvParser.js
│   │   └── validator.js
│   └── middleware/
│       ├── errorHandler.js
│       └── upload.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## Testing

### Running Tests
```bash
npm test
```

---

## License

This project is licensed under the MIT License.

---

## Contact

Your Name - ashoksakuru252@gmail.com