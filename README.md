# Mini ERP — Backend API

A lightweight ERP (Enterprise Resource Planning) backend for small retail/inventory
businesses, built with **Node.js, Express, TypeScript, and MongoDB**. It supports
role-based user management, product & inventory tracking, customer records, sales
processing with automatic stock deduction, and dashboard analytics.

## ✨ Features

- **Authentication** — JWT-based login with role-based access control (Admin,
  Manager, Employee)
- **User Management** — Admin-only creation of Manager/Employee accounts
- **Product Management** — CRUD with image upload (Cloudinary), SKU uniqueness
  validation, soft delete
- **Customer Management** — Full CRUD for customer records
- **Sales Processing** — Multi-item sales with automatic stock deduction and
  insufficient-stock protection
- **Dashboard** — Aggregated stats: total products, customers, sales, revenue,
  and low-stock alerts
- **Centralized error handling** — Consistent JSON error responses for
  validation errors (Zod), Mongoose errors, duplicate keys, and custom API errors

## 🛠️ Tech Stack

| Layer        | Technology                    |
| ------------ | ----------------------------- |
| Runtime      | Node.js                       |
| Language     | TypeScript                    |
| Framework    | Express 5                     |
| Database     | MongoDB with Mongoose         |
| Validation   | Zod                           |
| Auth         | JSON Web Tokens (JWT), bcrypt |
| File Storage | Cloudinary                    |
| File Upload  | Multer                        |

## 📁 Project Structure

```
src/
├── app.ts                     # Express app setup (middlewares, routes)
├── server.ts                  # Entry point (DB connection + server bootstrap)
└── app/
    ├── config/                # Env, DB, and Cloudinary configuration
    ├── constants/              # Shared constants (roles, etc.)
    ├── middlewares/            # Auth, validation, error handling, uploads
    ├── modules/
    │   ├── auth/                # Login
    │   ├── user/                 # User management (admin-only)
    │   ├── product/               # Product CRUD + image upload
    │   ├── customer/               # Customer CRUD
    │   ├── sales/                   # Sales processing
    │   └── dashboard/                # Aggregated statistics
    ├── routes/                  # Central route registry
    ├── scripts/                  # One-off scripts (e.g. admin seeding)
    ├── types/                     # Shared TypeScript types
    └── utils/                      # ApiError, catchAsync, QueryBuilder, etc.
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A MongoDB connection string (e.g. from MongoDB Atlas)
- A Cloudinary account (for product image uploads)

### Installation

```bash
git clone <repository-url>
cd mini-erp-backend
npm install
```

### Environment Setup

Copy the example env file and fill in your own values:

```bash
cp .env.example .env
```

| Variable                                        | Description                                      |
| ----------------------------------------------- | ------------------------------------------------ |
| `NODE_ENV`                                      | `development` or `production`                    |
| `PORT`                                          | Port the server runs on (default `5000`)         |
| `DATABASE_URL`                                  | MongoDB connection string                        |
| `JWT_ACCESS_SECRET`                             | Secret used to sign access tokens                |
| `JWT_ACCESS_EXPIRES_IN`                         | Access token lifetime (e.g. `1d`)                |
| `JWT_REFRESH_SECRET`                            | Secret used to sign refresh tokens               |
| `JWT_REFRESH_EXPIRES_IN`                        | Refresh token lifetime (e.g. `30d`)              |
| `BCRYPT_SALT_ROUNDS`                            | Salt rounds for password hashing                 |
| `CLOUDINARY_CLOUD_NAME`                         | Cloudinary cloud name                            |
| `CLOUDINARY_API_KEY`                            | Cloudinary API key                               |
| `CLOUDINARY_API_SECRET`                         | Cloudinary API secret                            |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Default admin account created by the seed script |
| `CLIENT_URL`                                    | Allowed CORS origin for the frontend             |

> ⚠️ **Never commit your real `.env` file.** `.env.example` should only ever
> contain placeholder values.

### Seed the first Admin account

There is no public signup route — the first Admin account must be seeded:

```bash
npx ts-node src/app/scripts/seedAdmin.ts
```

### Run the server

```bash
npm run dev      # development (auto-reload)
npm run build    # compile TypeScript to dist/
npm start        # run compiled build
```

The API will be available at:

```
http://localhost:5000/api/v1
```

## 🔑 Authentication & Roles

All endpoints except `/auth/login` require a Bearer token:

```
Authorization: Bearer <accessToken>
```

| Role         | Permissions                                                       |
| ------------ | ----------------------------------------------------------------- |
| **Admin**    | Full access — manage users, products, customers, sales, dashboard |
| **Manager**  | Manage products & customers, view sales & dashboard               |
| **Employee** | Create/view sales, view products & customers, view dashboard      |

## 📡 API Endpoints

### Auth

| Method | Endpoint      | Access | Description         |
| ------ | ------------- | ------ | ------------------- |
| POST   | `/auth/login` | Public | Log in, returns JWT |

### Users

| Method | Endpoint | Access | Description                    |
| ------ | -------- | ------ | ------------------------------ |
| POST   | `/users` | Admin  | Create a Manager/Employee user |
| GET    | `/users` | Admin  | List all users                 |

### Products

| Method | Endpoint        | Access                   | Description                                        |
| ------ | --------------- | ------------------------ | -------------------------------------------------- |
| POST   | `/products`     | Admin, Manager           | Create product (multipart, `image` field required) |
| GET    | `/products`     | Admin, Manager, Employee | List products (search, filter, pagination)         |
| GET    | `/products/:id` | Admin, Manager, Employee | Get a single product                               |
| PATCH  | `/products/:id` | Admin, Manager           | Update product (image optional)                    |
| DELETE | `/products/:id` | Admin, Manager           | Soft-delete a product                              |

### Customers

| Method | Endpoint         | Access                   | Description           |
| ------ | ---------------- | ------------------------ | --------------------- |
| POST   | `/customers`     | Admin, Manager           | Create a customer     |
| GET    | `/customers`     | Admin, Manager, Employee | List customers        |
| GET    | `/customers/:id` | Admin, Manager, Employee | Get a single customer |
| PATCH  | `/customers/:id` | Admin, Manager           | Update a customer     |
| DELETE | `/customers/:id` | Admin, Manager           | Delete a customer     |

### Sales

| Method | Endpoint     | Access                   | Description                                 |
| ------ | ------------ | ------------------------ | ------------------------------------------- |
| POST   | `/sales`     | Admin, Manager, Employee | Create a sale (deducts stock automatically) |
| GET    | `/sales`     | Admin, Manager, Employee | List sales                                  |
| GET    | `/sales/:id` | Admin, Manager, Employee | Get a single sale                           |

### Dashboard

| Method | Endpoint           | Access                   | Description                                                 |
| ------ | ------------------ | ------------------------ | ----------------------------------------------------------- |
| GET    | `/dashboard/stats` | Admin, Manager, Employee | Total products, customers, sales, revenue, low-stock alerts |

## 🧯 Error Handling

All errors return a consistent JSON shape:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Human-readable error message",
  "errorDetails": []
}
```

Handled error types include Zod validation errors, Mongoose validation/cast
errors, duplicate-key (unique index) errors, and custom `ApiError` instances.

## 📄 License

ISC
