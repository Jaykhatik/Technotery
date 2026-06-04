# API, REST API & FastAPI Complete Guide
## A Complete Roadmap for MERN Stack & Next.js Developers

---

# Table of Contents

1. Introduction to API
2. Why APIs are Needed
3. How APIs Work
4. API Architecture
5. Types of APIs
6. HTTP Fundamentals
7. Request and Response
8. REST API
9. REST Principles
10. REST API Design
11. CRUD Operations
12. HTTP Methods
13. Status Codes
14. REST API Project Structure
15. REST API Lifecycle
16. Authentication & Authorization
17. JWT Authentication
18. Access Token & Refresh Token
19. API Security
20. API Versioning
21. API Documentation
22. FastAPI
23. FastAPI Architecture
24. FastAPI Features
25. FastAPI CRUD Example
26. Express vs FastAPI
27. MERN + FastAPI Architecture
28. Best Practices
29. Interview Questions
30. Summary

---

# Chapter 1 : What is API?

API stands for:

```text
Application Programming Interface
```

An API is a medium that allows two software applications to communicate with each other.

---

## Real World Example

Imagine you visit a restaurant.

```text
Customer
   │
   ▼
 Waiter
   │
   ▼
 Kitchen
```

### Mapping

```text
Customer = Frontend

Waiter = API

Kitchen = Backend + Database
```

The customer doesn't enter the kitchen.

The waiter takes the request and brings back the response.

An API works exactly the same way.

---

# Why APIs Are Needed

Without APIs:

```text
Frontend
   │
   X
Database
```

Problems:

- No Security
- No Validation
- No Authentication
- No Scalability

---

With APIs:

```text
Frontend
   │
   ▼
 API
   │
   ▼
 Database
```

Benefits:

- Security
- Authentication
- Validation
- Scalability
- Reusability

---

# API Architecture

```text
┌──────────────┐
│   Frontend   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│      API     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Database   │
└──────────────┘
```

---

# API Request Flow

```text
User
 │
 ▼
Frontend
 │
 ▼
API Request
 │
 ▼
Backend
 │
 ▼
Database
 │
 ▼
API Response
 │
 ▼
Frontend
 │
 ▼
User
```

---

# Types of APIs

---

## 1. REST API

Most commonly used.

```http
GET /users

POST /users

PUT /users/1

DELETE /users/1
```

---

## 2. GraphQL API

Client requests only needed data.

Example:

```graphql
{
  user {
    name
    email
  }
}
```

---

## 3. SOAP API

Uses XML.

Mostly enterprise systems.

---

## 4. gRPC

High-performance APIs.

Used heavily in microservices.

---

# HTTP Fundamentals

API communication happens through HTTP.

---

# HTTP Request Structure

```http
GET /users HTTP/1.1

Host: localhost:3000

Authorization: Bearer TOKEN
```

---

# HTTP Response Structure

```http
200 OK

Content-Type: application/json

{
  "message": "Success"
}
```

---

# Request Components

```text
URL
Method
Headers
Body
Query Parameters
```

---

## Example

```http
POST /users
```

Headers:

```http
Content-Type: application/json
```

Body:

```json
{
  "name": "John",
  "email": "john@gmail.com"
}
```

---

# REST API

REST stands for:

```text
Representational State Transfer
```

Created by:

Roy Fielding
(2000)

---

# REST Architecture

```text
Client
  │
  ▼
REST API
  │
  ▼
Server
  │
  ▼
Database
```

---

# REST Principles

---

## 1. Client Server

Frontend and backend separated.

```text
React
   │
   ▼
Node.js
```

---

## 2. Stateless

Every request is independent.

Bad:

```text
Server remembers user
```

Good:

```http
Authorization: Bearer TOKEN
```

Every request carries required information.

---

## 3. Cacheable

Responses can be cached.

```text
Redis
Browser Cache
CDN
```

---

## 4. Uniform Interface

Good:

```http
/users

/products

/orders
```

Bad:

```http
/getUsers

/fetchOrders
```

---

## 5. Layered System

```text
Frontend
   │
 CDN
   │
 API Gateway
   │
 Backend
   │
 Database
```

---

# REST API Resource Design

Good Design:

```http
/users

/users/1

/products

/orders
```

Bad Design:

```http
/getUsers

/getProducts

/createUser
```

---

# CRUD Operations

CRUD means:

```text
Create
Read
Update
Delete
```

---

# CRUD Mapping

| CRUD | HTTP |
|--------|--------|
| Create | POST |
| Read | GET |
| Update | PUT/PATCH |
| Delete | DELETE |

---

# HTTP Methods

---

## GET

Fetch Data

```http
GET /users
```

Express Example:

```js
router.get("/users", getUsers);
```

---

## POST

Create Data

```http
POST /users
```

Example:

```json
{
  "name": "John"
}
```

---

## PUT

Replace Entire Resource

```http
PUT /users/1
```

---

## PATCH

Update Partial Resource

```http
PATCH /users/1
```

---

## DELETE

Delete Resource

```http
DELETE /users/1
```

---

# HTTP Status Codes

---

## Success

```http
200 OK

201 Created

204 No Content
```

---

## Client Errors

```http
400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found
```

---

## Server Errors

```http
500 Internal Server Error

503 Service Unavailable
```

---

# MERN REST API Structure

```text
backend/

├── src/
│
├── routes/
│
├── controllers/
│
├── services/
│
├── models/
│
├── middleware/
│
├── validators/
│
└── config/
```

---

# Request Lifecycle

```text
Client
 │
 ▼
Route
 │
 ▼
Controller
 │
 ▼
Service
 │
 ▼
Database
 │
 ▼
Response
```

---

# Route Example

```js
router.get("/users", getUsers);
```

---

# Controller Example

```js
export const getUsers = async (req, res) => {
  const users = await User.find();

  res.json(users);
};
```

---

# Service Example

```js
export const getAllUsers = async () => {
  return await User.find();
};
```

---

# Model Example

```js
const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});
```

---

# Authentication

Authentication means:

```text
Who are you?
```

Examples:

- Login
- JWT
- OAuth
- Session

---

# Authorization

Authorization means:

```text
What can you access?
```

Example:

```text
Admin
Customer
Manager
```

---

# JWT Authentication Flow

```text
User Login
      │
      ▼
Server Validates
      │
      ▼
JWT Generated
      │
      ▼
Frontend Stores Token
      │
      ▼
Authorization Header
```

---

# JWT Example

Login Response:

```json
{
  "token": "JWT_TOKEN"
}
```

Request:

```http
Authorization: Bearer JWT_TOKEN
```

---

# Access Token & Refresh Token

```text
Access Token
     │
     ▼
Short Life
```

```text
Refresh Token
     │
     ▼
Long Life
```

Flow:

```text
Access Expired
      │
      ▼
Refresh Token
      │
      ▼
New Access Token
```

---

# API Security

---

## Helmet

```js
app.use(helmet());
```

---

## CORS

```js
app.use(cors());
```

---

## Rate Limiting

```js
app.use(rateLimit());
```

---

## Input Validation

Libraries:

```text
Zod
Joi
Yup
```

---

# API Versioning

```http
/api/v1/users

/api/v2/users
```

Benefits:

- Backward Compatibility
- Easier Updates

---

# API Documentation

Popular Tools:

```text
Swagger
OpenAPI
Postman
```

---

# What is FastAPI?

FastAPI is a modern Python framework for building APIs.

Built on:

```text
Starlette
Pydantic
ASGI
```

---

# Why FastAPI Is Popular

Features:

```text
Very Fast

Automatic Validation

Automatic Documentation

Type Safety

Async Support
```

---

# FastAPI Architecture

```text
Client
  │
  ▼
FastAPI
  │
  ▼
Business Logic
  │
  ▼
Database
```

---

# Installation

```bash
pip install fastapi

pip install uvicorn
```

Run Server:

```bash
uvicorn main:app --reload
```

---

# First FastAPI App

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {
        "message": "Hello FastAPI"
    }
```

---

# Swagger Documentation

Automatically generated:

```text
http://localhost:8000/docs
```

---

# FastAPI CRUD Example

## Create User

```python
@app.post("/users")
def create_user():
    pass
```

---

## Read User

```python
@app.get("/users")
def get_users():
    pass
```

---

## Update User

```python
@app.put("/users/{id}")
def update_user():
    pass
```

---

## Delete User

```python
@app.delete("/users/{id}")
def delete_user():
    pass
```

---

# Validation Example

```python
from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int
```

Automatic validation included.

---

# Express vs FastAPI

| Feature | Express | FastAPI |
|----------|----------|----------|
| Language | JavaScript | Python |
| Performance | High | Very High |
| Validation | Manual | Automatic |
| Swagger Docs | Manual | Automatic |
| Type Safety | Medium | Excellent |
| Async Support | Good | Excellent |

---

# MERN + FastAPI Architecture

```text
React / Next.js
        │
        ▼
      FastAPI
        │
        ▼
 PostgreSQL/MongoDB
```

---

# Why MERN Developers Learn FastAPI

Useful for:

```text
AI APIs

Machine Learning

Python Ecosystem

Data Analytics

Recommendation Systems
```

---

# Best Practices

---

## Use Proper HTTP Methods

```http
GET
POST
PUT
PATCH
DELETE
```

---

## Keep Controllers Thin

```text
Controller
     │
     ▼
Service
     │
     ▼
Database
```

---

## Validate Every Input

Use:

```text
Zod

Joi

Pydantic
```

---

## Return Proper Status Codes

```http
200

201

400

401

404

500
```

---

## Use Authentication

```text
JWT

OAuth

Session
```

---

# Interview Questions

### What is API?

A mechanism that allows applications to communicate.

---

### What is REST API?

An API that follows REST principles using HTTP.

---

### Difference Between PUT and PATCH?

```text
PUT = Replace Entire Resource

PATCH = Update Partial Resource
```

---

### Why FastAPI is Fast?

Uses:

```text
ASGI

Starlette

Pydantic

Async Programming
```

---

# Final Summary

```text
API
│
├── Communication Layer
│
└── Connects Applications
```

```text
REST API
│
├── Uses HTTP
├── Stateless
└── Most Popular API Style
```

```text
FastAPI
│
├── Python API Framework
├── Automatic Validation
├── Automatic Swagger Docs
└── High Performance
```

---

# Learning Roadmap for MERN Developers

```text
HTTP
  │
  ▼
API Basics
  │
  ▼
REST API
  │
  ▼
Express.js
  │
  ▼
JWT Authentication
  │
  ▼
API Security
  │
  ▼
API Versioning
  │
  ▼
GraphQL
  │
  ▼
FastAPI
  │
  ▼
Microservices APIs
  │
  ▼
API Gateway
  │
  ▼
gRPC
```

By mastering these topics, you'll be able to build everything from simple CRUD applications to large-scale enterprise systems and microservice-based architectures.