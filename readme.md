# Mini Data Query API

## Overview
This is a lightweight backend service that simulates a simplified AI-powered data query system. It allows users to send natural language queries and receive simulated SQL translations and mock responses.

## Features
- Converts natural language queries into pseudo-SQL
- Returns mock data based on query type
- Basic API key authentication
- Lightweight in-memory database

## Installation & Setup

### Prerequisites
- Node.js installed

### Install dependencies
```sh
npm install
```

### Set up environment variables
Create a `.env` file in the project root as .env.example

### Run the server
```sh
npm run dev
```

## API Endpoints

### 1. `/query` (POST)
**Description:** Accepts a natural language query and returns a simulated SQL query along with a mock response.

**Request Headers:**
```
Content-Type: application/json
x-api-key: test-api-key
```

**Request Body:**
```json
{
  "query": "Show me total sales"
}
```

**Response:**
```json
{
  "sql": "SELECT SUM(amount) FROM sales",
  "result": { "total_sales": 2500 }
}
```

#### Other Examples:
| Query | SQL Translation | Response Example |
|----------------------|--------------------------------------------------|--------------------------------------------|
| "Show me total sales" | `SELECT SUM(amount) FROM sales` | `{ "total_sales": 2500 }` |
| "Show top products" | `SELECT product, SUM(amount) FROM sales GROUP BY product ORDER BY SUM(amount) DESC LIMIT 5` | `{ "products": [ { "product": "Laptop", "amount": 1200 }, { "product": "Phone", "amount": 800 } ] }` |
| "Show me all products" | `SELECT DISTINCT product FROM sales` | `{ "products": ["Laptop", "Phone", "Tablet"] }` |
| "Show products which have cost more than 700" | `SELECT product, amount FROM sales WHERE amount > 700` | `{ "products": [ { "product": "Laptop", "amount": 1200 }, { "product": "Phone", "amount": 800 } ] }` |
| "Show products which have cost more than 500" | `SELECT product, amount FROM sales WHERE amount > 500` | `{ "products": [ { "product": "Laptop", "amount": 1200 }, { "product": "Phone", "amount": 800 } ] }` |
| "Show products which have cost more than 300" | `SELECT product, amount FROM sales WHERE amount > 300` | `{ "products": [ { "product": "Laptop", "amount": 1200 }, { "product": "Phone", "amount": 800 }, { "product": "Tablet", "amount": 500 } ] }` |

---
### 2. `/explain` (GET)
**Description:** Returns an explanation of how natural language queries are converted into pseudo-SQL.

**Request Headers:**
```
x-api-key: test-api-key
```

**Response:**
```json
{
  "message": "This API converts natural language queries into pseudo-SQL and returns mock data.",
  "examples": [
    { "query": "Show me total sales", "sql": "SELECT SUM(amount) FROM sales", "explanation": "Calculates the total sales amount from all records." },
    { "query": "Show top products", "sql": "SELECT product, SUM(amount) FROM sales GROUP BY product ORDER BY SUM(amount) DESC LIMIT 5", "explanation": "Lists top 5 products based on total sales." },
    { "query": "Show me all products", "sql": "SELECT DISTINCT product FROM sales", "explanation": "Retrieves a list of all unique products sold." },
    { "query": "Show products which have cost more than 500", "sql": "SELECT product, amount FROM sales WHERE amount > 500", "explanation": "Retrieves products with a price greater than a specified amount." }
  ]
}
```

---
### 3. `/validate` (POST)
**Description:** Checks if a natural language query can be translated into SQL.

**Request Headers:**
```
x-api-key: test-api-key
```

**Request Body:**
```json
{
  "query": "Show me total sales"
}
```

**Response:**
```json
{
  "valid": true
}
```



