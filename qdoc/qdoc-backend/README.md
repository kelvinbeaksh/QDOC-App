# QDOC Backend

[![Staging CI](https://github.com/qdoctech/qdoc/actions/workflows/staging-ci.yml/badge.svg?branch=main)](https://github.com/qdoctech/qdoc/actions/workflows/staging-ci.yml)

## Overview

QDOC Backend is a RESTful API service that powers the healthcare management system. It provides endpoints for clinic management, queue management, telemedicine, and user authentication. Built with Node.js, Express, and TypeScript, it integrates with Firebase for authentication and database operations.

## Project Structure

```
qdoc-backend/
├── src/
│   ├── config/           # Application configuration
│   ├── controllers/      # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   ├── middleware/      # Custom middleware
│   ├── utils/          # Utility functions
│   └── types/          # TypeScript type definitions
├── scripts/             # Build and deployment scripts
├── config/             # Configuration files
└── __tests__/          # Test files
```

## API Endpoints

### Authentication
- `/auth/signin` - User login
- `/auth/signup` - User registration
- `/auth/verify-email` - Email verification

### Clinic Management
- `/clinics` - Clinic CRUD operations
- `/clinics/:id` - Specific clinic details
- `/clinics/:id/queues` - Clinic queue management
- `/clinics/:id/appointments` - Clinic appointment management

### Queue Management
- `/queues` - Queue CRUD operations
- `/queues/:id` - Specific queue details
- `/queues/:id/tickets` - Queue ticket management

### Patient Management
- `/patients` - Patient CRUD operations
- `/patients/:id` - Specific patient details
- `/patients/:id/appointments` - Patient appointments

### Doctor Management
- `/doctors` - Doctor CRUD operations
- `/doctors/:id` - Specific doctor details
- `/doctors/:id/schedule` - Doctor scheduling

### Admin Management
- `/admins` - Admin CRUD operations
- `/admins/:id` - Specific admin details
- `/admins/roles` - Role management

### Telemedicine
- `/video` - Video consultation endpoints
- `/zoom-test` - Zoom integration testing

## Key Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Email verification
- Password reset functionality

### Clinic Management
- Clinic registration and management
- Staff management
- Resource scheduling
- Appointment management

### Queue System
- Real-time queue monitoring
- Ticket generation and management
- Queue status tracking
- Priority queue handling

### Telemedicine
- Video consultation scheduling
- Secure video conferencing
- Appointment management
- Patient-doctor matching

### Patient Management
- Patient registration
- Medical history tracking
- Appointment scheduling
- Queue management

## Development Setup

### Prerequisites
- Node.js v15.12.0 or higher
- Docker and Docker Compose
- PostgreSQL
- Redis
- Firebase CLI

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment:
   ```bash
   cp .envrc.template .envrc
   direnv allow
   ```

4. Install Husky for git hooks:
   ```bash
   npx husky install
   ```

### Database Setup

1. Start Docker containers:
   ```bash
   docker-compose up -d
   ```

2. Initialize database:
   ```bash
   npm run db:setup
   ```

3. Run database migrations:
   ```bash
   npm run db:migrate
   ```

4. Seed database:
   ```bash
   npm run db:seed
   ```

### Running the Application

Start the development server:
```bash
npm run dev
```

### Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

### Building for Production

```bash
npm run build
```

## Environment Variables

Copy `.envrc.template` to `.envrc` and update with your configuration:
```bash
cp .envrc.template .envrc
```

## API Documentation

API documentation is available in `QDOC.postman_collection.json`. Import this file into Postman to explore all available endpoints.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

[Your License Information Here]
