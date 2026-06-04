# Microservices Architecture

## What is Microservices Architecture?

Microservices Architecture is a software design pattern where an application is divided into multiple small, independent services.

Each service:

- Has its own responsibility
- Has its own business logic
- Can have its own database
- Can be developed independently
- Can be deployed independently
- Can be scaled independently

Instead of building one large application (Monolith), we build multiple small applications that work together.

---

# Simple Real-Life Example

Imagine a large company.

Instead of one employee doing everything:

- Sales Team handles sales
- HR Team handles hiring
- Finance Team handles payments
- Support Team handles customers

Each team works independently but together they run the company.

Microservices work exactly the same way.

---

# Basic Structure

```text
Application

├── User Service
├── Product Service
├── Order Service
├── Payment Service
├── Notification Service
└── Inventory Service
```

Every service is independent.

---

# Microservices Architecture Diagram

```text
                    ┌──────────────┐
                    │    Client    │
                    └──────┬───────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   API Gateway   │
                  └──────┬──────────┘
                         │
      ┌──────────────────┼──────────────────┐
      ▼                  ▼                  ▼

┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ User Service│   │Order Service│   │Payment Svc │
└──────┬──────┘   └──────┬──────┘   └──────┬──────┘
       │                 │                 │
       ▼                 ▼                 ▼

 User DB          Order DB          Payment DB
```

Each service owns its own database.

---

# Core Concepts

## 1. Independent Services

Each service performs one business function.

Example:

```text
User Service
```

Responsible for:

- Register User
- Login User
- JWT
- Authentication

---

```text
Product Service
```

Responsible for:

- Product CRUD
- Categories
- Reviews

---

```text
Order Service
```

Responsible for:

- Create Orders
- Update Orders
- Track Orders

---

## 2. Independent Deployment

Services can be deployed separately.

Example:

```text
User Service v2
```

can be deployed without redeploying:

```text
Product Service
Order Service
Payment Service
```

This is one of the biggest advantages.

---

## 3. Independent Databases

Every service owns its database.

```text
User Service
    │
    ▼
 User Database

Product Service
    │
    ▼
 Product Database

Order Service
    │
    ▼
 Order Database
```

This prevents tight coupling.

---

## 4. Service Communication

Services communicate over the network.

Example:

```http
POST /orders
```

Order Service may call:

```http
GET /users/:id
```

from User Service.

---

# Communication Types

## Synchronous Communication

Uses:

- REST API
- GraphQL
- gRPC

Example:

```text
Order Service
      │
      ▼
User Service
```

Waits for a response.

---

## Asynchronous Communication

Uses:

- RabbitMQ
- Kafka
- Redis Pub/Sub
- AWS SQS

Example:

```text
Order Created
       │
       ▼
     Kafka
       │
       ▼
Notification Service
```

No waiting required.

---

# Request Flow

```text
Client
   │
   ▼
API Gateway
   │
   ▼
Order Service
   │
   ▼
User Service
   │
   ▼
Database
```

Services communicate through APIs.

---

# API Gateway

## What is API Gateway?

Single entry point for all requests.

```text
Client
   │
   ▼
API Gateway
   │
   ├── User Service
   ├── Product Service
   ├── Order Service
   └── Payment Service
```

Benefits:

- Authentication
- Rate Limiting
- Logging
- Routing
- Monitoring

---

# Service Discovery

## Problem

Suppose:

```text
User Service
```

changes its server.

How will Order Service know?

---

## Solution

Service Discovery

Examples:

- Consul
- Eureka
- Kubernetes DNS

```text
Order Service
      │
      ▼
Service Registry
      │
      ▼
User Service
```

---

# Database Per Service Pattern

Recommended architecture.

```text
User Service
     │
     ▼
MongoDB Users

Product Service
     │
     ▼
MongoDB Products

Order Service
     │
     ▼
MongoDB Orders
```

Each service controls its own data.

---

# Event-Driven Architecture

Very common in Microservices.

---

## Example

Customer places order.

```text
Order Created
```

Event generated.

```text
Kafka Topic
```

Consumers:

```text
Payment Service
Notification Service
Inventory Service
Analytics Service
```

All receive the event.

---

# Advantages

## Independent Deployment

```text
Deploy User Service
```

without affecting others.

---

## Independent Scaling

Suppose:

```text
Product Service
```

receives:

```text
100,000 Requests
```

while:

```text
Payment Service
```

receives:

```text
1,000 Requests
```

Only Product Service needs scaling.

---

## Fault Isolation

If:

```text
Notification Service
```

fails,

other services continue working.

---

## Technology Freedom

User Service:

```text
Node.js
```

Order Service:

```text
Java
```

Analytics Service:

```text
Python
```

Different technologies can coexist.

---

## Team Independence

Large organizations can assign:

```text
Team A → User Service

Team B → Product Service

Team C → Order Service
```

Each team works independently.

---

# Disadvantages

## High Complexity

Managing:

- Multiple Services
- Multiple Databases
- Multiple Deployments

becomes difficult.

---

## Network Latency

Calls happen over network.

```text
Order Service
      │
      ▼
User Service
```

Slower than function calls.

---

## Distributed Transactions

Harder than Monolith.

Example:

```text
Order Created
Payment Failed
Inventory Updated
```

Rollback becomes difficult.

---

## Monitoring Complexity

Need tools like:

- Prometheus
- Grafana
- Jaeger
- OpenTelemetry

---

## Infrastructure Cost

More servers.

More databases.

More DevOps.

Higher cost.

---

# Microservices in MERN Stack

## Project Structure

```text
microservices/

├── api-gateway/

├── user-service/

├── product-service/

├── order-service/

├── payment-service/

├── inventory-service/

└── notification-service/
```

Every service is a separate Node.js application.

---

# User Service

```text
user-service/

├── src/
│
├── routes/
├── controllers/
├── services/
├── models/
└── app.js
```

Handles:

- Register
- Login
- JWT
- User Profile

---

# Product Service

Handles:

- Products
- Categories
- Reviews

---

# Order Service

Handles:

- Orders
- Order Tracking
- Order Status

---

# Payment Service

Handles:

- Stripe
- Razorpay
- PayPal

---

# Notification Service

Handles:

- Email
- SMS
- Push Notifications

---

# Microservices in Next.js

Next.js usually acts as:

```text
Frontend Layer
```

while backend services remain independent.

Architecture:

```text
Next.js Frontend
        │
        ▼
API Gateway
        │
        ▼
Microservices
```

---

# Example Architecture

```text
Next.js

│

├── Login Page
├── Dashboard
├── Product Page
└── Order Page

        │

        ▼

API Gateway

        │

 ┌──────┼──────┐
 ▼      ▼      ▼

User  Product Order
Svc    Svc     Svc
```

---

# Docker in Microservices

Almost every Microservice architecture uses Docker.

Example:

```text
Docker

├── User Service Container
├── Product Service Container
├── Order Service Container
└── Payment Service Container
```

Benefits:

- Easy Deployment
- Consistent Environment
- Scalability

---

# Kubernetes in Microservices

Kubernetes manages:

- Deployment
- Scaling
- Load Balancing
- Self Healing

Example:

```text
Kubernetes Cluster

├── User Pods
├── Product Pods
├── Order Pods
└── Payment Pods
```

---

# Scaling Diagram

```text
                 Load Balancer
                       │

     ┌─────────────────┼─────────────────┐
     ▼                 ▼                 ▼

 Product 1       Product 2       Product 3
```

Only Product Service scales.

---

# Best Practices

## One Service = One Responsibility

Good:

```text
User Service
```

Bad:

```text
User + Product + Payment Service
```

---

## Database Per Service

Good:

```text
User DB
Product DB
Order DB
```

Bad:

```text
One Shared Database
```

---

## API Versioning

```http
/api/v1/users

/api/v2/users
```

---

## Use Event-Driven Communication

Prefer:

```text
Kafka
RabbitMQ
```

for loosely coupled systems.

---

## Containerize Everything

Use:

```text
Docker
```

for every service.

---

# When Should You Use Microservices?

Choose Microservices when:

✅ Large Product

✅ Large Team

✅ Millions of Users

✅ Independent Scaling Needed

✅ Multiple Development Teams

✅ Frequent Deployments

✅ Complex Business Domains

---

# When Should You Avoid Microservices?

Avoid if:

❌ Learning Project

❌ Portfolio Project

❌ Startup MVP

❌ Small Team

❌ Simple CRUD Application

❌ Limited Budget

---

# Industry Examples

Companies using Microservices:

- :contentReference[oaicite:0]{index=0}
- :contentReference[oaicite:1]{index=1}
- :contentReference[oaicite:2]{index=2}
- :contentReference[oaicite:3]{index=3}
- :contentReference[oaicite:4]{index=4}

---

# Monolith vs Microservices

| Feature | Monolith | Microservices |
|----------|----------|--------------|
| Codebase | Single | Multiple |
| Deployment | One | Independent |
| Scaling | Whole App | Individual Service |
| Database | Shared | Separate |
| Complexity | Low | High |
| Cost | Low | High |
| Maintenance | Easy Initially | Easy at Large Scale |
| Team Size | Small | Large |

---

# Recommended Learning Path for MERN & Next.js Developers

```text
Step 1
↓
Learn Monolithic Architecture

Step 2
↓
Build 5-10 Real Projects

Step 3
↓
Learn Modular Monolith

Step 4
↓
Learn Docker

Step 5
↓
Learn Redis

Step 6
↓
Learn RabbitMQ / Kafka

Step 7
↓
Learn API Gateway

Step 8
↓
Learn Microservices

Step 9
↓
Learn Kubernetes

Step 10
↓
Production-Level Distributed Systems
```

---

# Final Rule for MERN & Next.js Developers

```text
Start with a Modular Monolith.

Move to Microservices only when:
- Team size grows
- Traffic increases
- Independent scaling is required
- Business complexity increases
```

Most successful applications begin as a Monolith and evolve into Microservices only when there is a real business need.