# MotoMan - Motorparts Shop Management System

MotoMan is a full-stack web-based Motorcycle Shop Management System designed to digitize and simplify the daily operations of a motorparts shop.

The system provides centralized management of products, brands, categories, inventory, sales, expenses, and business reports through a modern web interface. It follows a client-server architecture using the MERN stack.

## Features

### Authentication

* Admin login
* JWT-based authentication
* Protected routes and API endpoints
* User role and status management
* Secure logout

### Dashboard

* Overview of shop activities
* Total products
* Sales statistics
* Low-stock information
* Brand and category statistics
* Expense information
* Recent sales overview

### Brand Management

* Add new brands
* View and manage existing brands

### Category Management

* Add product categories
* View and manage existing categories

### Product Management

* Add products
* Manage products
* Product code
* Brand and category association
* Unit information
* Purchase price
* Selling price
* Initial/current stock
* Rack number
* Stock alert quantity
* Product status
* Optional product image
* Product description

### Stock Management

* View current inventory
* Monitor product quantities
* Identify low-stock products
* Automatically update stock after sales

### Sales Management

* Create new sales
* Select products and quantities
* Calculate sale totals
* Store sales transactions
* View sales history
* Delete sales
* Automatically restore stock when a sale is deleted

### Expense Management

* Add business expenses
* View and manage expenses
* Maintain expense records for business analysis

### Reports

* Sales Report
* Profit Report
* Sales and transaction summaries
* Cost of Goods Sold (COGS) calculation
* Profit calculation
* Printable reports

## Technology Stack

### Frontend

* **React.js**  User interface
* **Vite**  Frontend build tool and development server
* **React Router** - Client-side routing
* **Axios** - HTTP/API communication
* **Tailwind CSS** - Styling and responsive UI
* **React Icons** - Interface icons

### Backend

* **Node.js** - Server-side JavaScript runtime
* **Express.js** - REST API framework
* **Mongoose** - MongoDB ODM
* **JWT (JSON Web Token)** - Authentication
* **dotenv** - Environment variable management
* **CORS** - Cross-origin resource sharing
* **Nodemon** - Development server auto-restart

### Database

* **MongoDB Atlas** - Cloud-hosted NoSQL database

### Development & Deployment

* **Git** - Version control
* **GitHub** - Source code repository
* **Vercel** - Frontend deployment
* **Render** - Backend deployment

## System Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │       + Vite         │
                    └──────────┬──────────┘
                               │
                         Axios / REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express + Node.js │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
             JWT Authentication      Mongoose
                                          │
                                          ▼
                                ┌─────────────────┐
                                │ MongoDB Atlas   │
                                └─────────────────┘
```

## Application Structure

```text
MotoMan
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── dashboard/
│   │   │   ├── brands/
│   │   │   ├── categories/
│   │   │   ├── products/
│   │   │   ├── sales/
│   │   │   ├── stock/
│   │   │   ├── expenses/
│   │   │   └── reports/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

## Core System Methodology

MotoMan uses a conventional full-stack business application architecture.

### CRUD Operations

The system implements CRUD operations for major business entities.

* **Create** - Add products, brands, categories, sales and expenses
* **Read** - Retrieve products, inventory, sales, expenses and reports
* **Update** - Modify existing records
* **Delete** - Remove applicable records

### RESTful API

The frontend communicates with the backend through REST APIs.

```text
React
  │
  │ Axios
  ▼
Express REST API
  │
  ▼
Controllers / Business Logic
  │
  ▼
Mongoose
  │
  ▼
MongoDB
```

### JWT Authentication

The authentication process follows:

```text
User Login
    ↓
Credential Verification
    ↓
JWT Token Generation
    ↓
Client Stores Authentication State
    ↓
Protected API Request
    ↓
JWT Verification Middleware
    ↓
Authorized Request
```

### Inventory Management

Stock is automatically connected with sales transactions.

When a product is sold:

```text
New Stock = Previous Stock - Sold Quantity
```

When a sale is deleted:

```text
Restored Stock = Current Stock + Deleted Sale Quantity
```

This keeps inventory synchronized with sales records.

### Profit Calculation

The system calculates profit using the purchase price and selling price of products.

```text
COGS = Purchase Price × Quantity Sold

Profit = Sales Revenue - COGS
```

This information is used by the Profit Report.

## Database Models

The system uses MongoDB with Mongoose schemas/models for its main entities.

```text
User
 │
 └── Authentication & authorization

Brand
 │
 └── Product brands

Category
 │
 └── Product categories

Product
 │
 ├── Brand
 ├── Category
 ├── Purchase Price
 ├── Selling Price
 └── Stock

Sale
 │
 ├── Products
 ├── Quantities
 ├── Revenue
 └── Transaction information

Expense
 │
 ├── Amount
 ├── Description
 └── Expense information
```

## Installation

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Git
* MongoDB Atlas account

### Clone the Repository

```bash
git clone https://github.com/0Arafsir0/Motoman.git
cd Motoman
```

## Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Start the development server:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

## Frontend Setup

Open another terminal and navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

## Environment Variables

### Backend

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=your_frontend_url
```

### Frontend

```env
VITE_API_URL=your_backend_api_url
```

Do not commit `.env` files or database credentials to GitHub.

Add them to `.gitignore`:

```text
.env
node_modules/
dist/
```

## Deployment

MotoMan can be deployed using:

```text
GitHub
   │
   ├──────────────► Vercel
   │                 │
   │                 └── React Frontend
   │
   └──────────────► Render
                     │
                     └── Node/Express Backend
                              │
                              ▼
                         MongoDB Atlas
```

For production deployment, the frontend should use the deployed backend URL through:

```env
VITE_API_URL=https://your-render-backend-url/api
```

The backend should use the deployed Vercel URL for its CORS configuration:

```env
CLIENT_URL=https://your-vercel-frontend-url
```

## Security

MotoMan uses several mechanisms to protect the application:

* JWT-based authentication
* Protected backend routes
* Environment variables for sensitive configuration
* CORS configuration
* Server-side authentication checks
* Database access through Mongoose

Sensitive credentials such as MongoDB passwords and JWT secrets should never be committed to the repository.

## Future Improvements

Possible future improvements include:

* Multiple user roles and permissions
* Customer management
* Supplier management
* Purchase management
* Invoice generation
* PDF report generation
* Advanced dashboard analytics
* Low-stock notifications
* Sales filtering and advanced search
* Backup and restore functionality
* More detailed audit logs
* Responsive mobile-focused improvements

## Project Purpose

MotoMan was developed as a practical full-stack software project demonstrating the implementation of a real-world business management system.

The project demonstrates knowledge of:

* Full-stack web development
* MERN architecture
* RESTful API development
* Database design
* CRUD operations
* Authentication and authorization
* Inventory management
* Transaction processing
* Business logic implementation
* Report generation
* Frontend routing and state management
* Cloud deployment

## License

This project is intended for educational and demonstration purposes.

---

**MotoMan - Motorparts Shop Management System**

Built with the MERN Stack.
