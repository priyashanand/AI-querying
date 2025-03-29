"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
require('dotenv').config();
const API_KEY = process.env.API_KEY;
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(body_parser_1.default.json());
app.use((req, res, next) => {
    const key = req.headers['x-api-key'];
    if (!key || key !== API_KEY) {
        res.status(403).json({ error: "Unauthorized" });
        return;
    }
    next();
});
const mockDB = {
    sales: [
        { id: 1, product: "Laptop", amount: 1200, date: "2024-03-10" },
        { id: 2, product: "Phone", amount: 800, date: "2024-03-12" },
        { id: 3, product: "Tablet", amount: 500, date: "2024-03-15" },
        { id: 4, product: "Smartwatch", amount: 300, date: "2024-03-18" },
        { id: 5, product: "Headphones", amount: 150, date: "2024-03-20" },
        { id: 6, product: "Monitor", amount: 400, date: "2024-03-22" },
        { id: 7, product: "Keyboard", amount: 100, date: "2024-03-25" },
        { id: 8, product: "Mouse", amount: 50, date: "2024-03-27" },
        { id: 9, product: "Printer", amount: 250, date: "2024-03-29" },
        { id: 10, product: "External Hard Drive", amount: 200, date: "2024-03-30" },
        { id: 11, product: "Gaming Chair", amount: 350, date: "2024-04-01" },
        { id: 12, product: "Router", amount: 180, date: "2024-04-03" },
        { id: 13, product: "Graphics Card", amount: 700, date: "2024-04-05" }
    ],
};
const convertToSQL = (query) => {
    if (query.toLowerCase().includes("total sales")) {
        return "SELECT SUM(amount) FROM sales";
    }
    if (query.toLowerCase().includes("top products")) {
        return "SELECT product, SUM(amount) FROM sales GROUP BY product ORDER BY SUM(amount) DESC LIMIT 5";
    }
    if (query.toLowerCase().includes("all products")) {
        return "SELECT DISTINCT product FROM sales";
    }
    const match = query.toLowerCase().match(/products which have cost more than (\d+)/);
    if (match) {
        const amount = parseInt(match[1], 10);
        return `SELECT product, amount FROM sales WHERE amount > ${amount}`;
    }
    return 'unable to understand the query plz refer docs';
};
app.post('/query', (req, res) => {
    const { query } = req.body;
    if (!query) {
        res.status(400).json({ error: "Query is required" });
        return;
    }
    const sql = convertToSQL(query);
    if (!sql) {
        res.status(400).json({ error: "Query not understood" });
        return;
    }
    let result;
    if (sql.includes("SUM(amount)")) {
        result = { total_sales: mockDB.sales.reduce((sum, sale) => sum + sale.amount, 0) };
    }
    else if (sql.includes("DISTINCT product")) {
        result = { products: [...new Set(mockDB.sales.map(sale => sale.product))] };
    }
    else if (sql.includes("amount >")) {
        const matchAmount = sql.match(/amount > (\d+)/);
        const amount = matchAmount ? parseInt(matchAmount[1], 10) : 0;
        result = { products: mockDB.sales.filter(sale => sale.amount > amount).map(sale => ({ product: sale.product, amount: sale.amount })) };
    }
    else {
        result = { message: "Mock data for complex query" };
    }
    res.json({ sql, result });
});
app.get('/', (req, res) => {
    res.send('<h1>this is the backend</h1>');
});
app.get('/explain', (req, res) => {
    res.json({
        message: "This API converts natural language queries into pseudo-SQL and returns mock data.",
        examples: [
            { query: "Show me total sales", sql: "SELECT SUM(amount) FROM sales", explanation: "Calculates the total sales amount from all records." },
            { query: "Show top products", sql: "SELECT product, SUM(amount) FROM sales GROUP BY product ORDER BY SUM(amount) DESC LIMIT 5", explanation: "Lists top 5 products based on total sales." },
            { query: "Show me all products", sql: "SELECT DISTINCT product FROM sales", explanation: "Retrieves a list of all unique products sold." },
            { query: "Show products which have cost more than 500", sql: "SELECT product, amount FROM sales WHERE amount > 500", explanation: "Retrieves products with a price greater than a specified amount." }
        ]
    });
});
app.post('/validate', (req, res) => {
    const { query } = req.body;
    if (!query) {
        res.status(400).json({ error: "Query is required" });
        return;
    }
    const isValid = !!convertToSQL(query);
    res.json({ valid: isValid });
});
app.listen({ port }, () => {
    console.log(`The server is running on port ${port}: http://localhost:${port}`);
});
