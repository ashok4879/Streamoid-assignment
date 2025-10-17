
```markdown
# Product CSV Upload API

A backend service for uploading, validating, and managing product catalogs via CSV files. Built for sellers who need to manage their inventory before listing on marketplaces.

## What it does

- Upload product CSV files
- Validates data (checks pricing, required fields, etc.)
- Stores valid products in database
- Provides search and filtering

## Tech Stack

- Node.js + Express
- Sequelize ORM
- SQLite (can switch to Postgres easily)
- csv-parser for CSV handling
- multer for file uploads

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

```bash
# Clone the repo
git clone 
cd product-csv-api

# Install dependencies
npm install

# Run the server
npm start

# Or run in development mode with auto-reload
npm run dev
```

Server runs on `http://localhost:3000` by default.

### Database Setup

The SQLite database (`database.sqlite`) will be created automatically on first run. If you want to use Postgres instead, update the database config in `config/database.js`.

## API Endpoints

### 1. Upload CSV

**POST** `/upload`

Upload a CSV file with product data.

```bash
curl -X POST -F "file=@products.csv" http://localhost:3000/upload
```

**Response:**
```json
{
  "stored": 18,
  "failed": [
    {
      "sku": "INVALID-001",
      "errors": ["price > mrp"]
    }
  ]
}
```

**Validation Rules:**
- Required fields: sku, name, brand, mrp, price
- price must be ≤ mrp
- quantity must be ≥ 0 (defaults to 0 if missing)

### 2. List All Products

**GET** `/products?page=1&limit=10`

Returns paginated list of products.

```bash
curl http://localhost:3000/products?page=1&limit=10
```

**Response:**
```json
[
  {
    "sku": "TSHIRT-RED-001",
    "name": "Classic Cotton T-Shirt",
    "brand": "StreamThreads",
    "color": "Red",
    "size": "M",
    "mrp": 799,
    "price": 499,
    "quantity": 20
  }
]
```

### 3. Search/Filter Products

**GET** `/products/search`

Filter products by brand, color, or price range.

**Examples:**

```bash
# Filter by brand
curl http://localhost:3000/products/search?brand=StreamThreads

# Filter by color
curl http://localhost:3000/products/search?color=Red

# Filter by price range
curl http://localhost:3000/products/search?minPrice=500&maxPrice=2000

# Combine filters
curl http://localhost:3000/products/search?brand=BloomWear&maxPrice=2500
```

## Project Structure

```
.
├── config/
│   └── database.js          # DB configuration
├── models/
│   └── product.js           # Product model/schema
├── controllers/
│   └── productController.js # API logic
├── routes/
│   └── productRoutes.js     # Route definitions
├── uploads/                 # Temp folder for CSV uploads
└── server.js                # Express app + entry point
```

## CSV Format

Your CSV should have these columns (header row required):

```csv
sku,name,brand,color,size,mrp,price,quantity
TSHIRT-RED-001,Classic Cotton T-Shirt,StreamThreads,Red,M,799,499,20
```

**Required columns:** sku, name, brand, mrp, price  
**Optional columns:** color, size, quantity

## Testing

I've included a sample `products.csv` file for testing. You can also use the one from the assignment doc.

```bash
curl -X POST -F "file=@products.csv" http://localhost:3000/upload
```
## Testing Using Postman

### Step 1: Upload CSV

1. Open Postman → Click **New** → **Request**.
2. Method: **POST**
3. URL: `http://localhost:3000/upload`
4. Go to **Body** → select **form-data**
5. Add a key: `file` → Type: **File** → Select `products.csv`
6. Click **Send**

---

### Step 2: List Products

1. Method: **GET**
2. URL: `http://localhost:3000/products?page=1&limit=10`
3. Click **Send**

---

### Step 3: Search / Filter Products

1. Method: **GET**
2. URL: `http://localhost:3000/products/search?brand=StreamThreads&color=Red&minPrice=500&maxPrice=2000`
3. Click **Send**

---

### Notes

- Combine query parameters (`brand`, `color`, `minPrice`, `maxPrice`) as needed.
- Save requests in a Postman collection for easy reuse.
- Verify uploaded products using the **List Products** endpoint.

## Known Issues / TODO

- [ ] Add unit tests (validation logic, search filters)
- [ ] Better error messages for CSV parsing failures
- [ ] Bulk upsert instead of individual inserts (performance)
- [ ] Add authentication for production use
- [ ] Docker setup

## Notes

- Empty rows in CSV are automatically skipped
- Duplicate SKUs will update existing products (upsert behavior)
- Temp CSV files are deleted after processing
- All text fields are trimmed automatically

## Development

If you want to clear the database and start fresh:

```bash
rm database.sqlite
npm start  
```

---

Built as part of Streamoid backend assignment. Let me know if you have questions!
```

---

## Installation & Running

1. **Create the project directory:**
   ```bash
   mkdir product-csv-api
   cd product-csv-api
   ```

2. **Copy all files above into their respective locations**

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Test the upload:**
   ```bash
   curl -X POST -F "file=@products.csv" http://localhost:3000/upload
   ```
