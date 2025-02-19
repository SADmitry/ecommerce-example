# E-commerce Microservices Example

This project demonstrates a microservices architecture for an e-commerce system, using `Node.js`, `Redis`, `SQLite`, and `BullMQ` (Saga Pattern).

## Features

- Order Service – Handles order creation and tracking
- Payment Service – Simulates payment processing
- Orchestrator – Manages transaction consistency using the Saga pattern
- Message Queue (BullMQ) – Ensures asynchronous event handling
- REST API – Allows fetching order status

## Project Structure

```
ecommerce-microservices/
│── services/
│   ├── order-service/         # Handles order creation & status updates
│   ├── payment-service/       # Simulates payment processing
│   ├── orchestrator-service/  # Coordinates payments & order updates
│── package.json               # Monorepo configuration (npm workspaces)
│── README.md                  # Documentation
```

## Setup & Installation

1. Clone the repository
2. Install dependencies
`npm install`
3. Start Redis
`brew install redis`
`brew services start redis`
4. Run database migrations
`npm run migrate:all`
5. Start all services
`npm run start:all`

## API Endpoints

### Create an Order
```
curl -X POST http://localhost:3000/orders -H "Content-Type: application/json" -d '{
    "user_id": "123",
    "total_price": 50
}'
```
Response:
```
{
    "id": 1,
    "status": "pending"
}
```

## Proposed architectural diagram

This example implements part of an architecture proposed (`diagram.mmdc`). It's an open tool readily available through `npm` or online

## Potential changes and evolution
- Since we have independent services communicating through message broker they can have different tech stack if necessary while keeping protocol intact
- It is possible to replace Redis with Kafka or any other message broker, here we have an example easily ready for demonstration.
- For complex deployments Kubernetes / Kustomize / ArgoCD may be intruduced