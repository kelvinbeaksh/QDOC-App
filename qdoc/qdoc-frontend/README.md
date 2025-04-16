# QDOC Frontend

[![Staging CI](https://github.com/qdoctech/qdoc-portal/actions/workflows/staging-ci.yml/badge.svg?branch=main)](https://github.com/qdoctech/qdoc-portal/actions/workflows/staging-ci.yml)

## Overview

QDOC is a modern healthcare management system that provides queue management, appointment scheduling, and telemedicine capabilities for clinics and healthcare providers. This repository contains the frontend application built with React and TypeScript.

## Project Structure

```
qdoc-frontend/
├── src/
│   ├── assets/              # Static assets (images, fonts, etc.)
│   ├── components/          # Reusable React components
│   ├── config/             # Application configuration
│   ├── contexts/           # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── layout/             # Layout components and templates
│   ├── pages/              # Page components
│   ├── routes/             # Route definitions
│   ├── services/           # API services and utilities
│   ├── store/              # Redux store configuration
│   ├── styles/             # Global styles and theme
│   └── types/              # TypeScript type definitions
└── public/                # Public assets and index.html
```

## Key Features

### User Management
- Multiple user roles: ADMIN, DOCTOR, CLINIC_STAFF, PATIENT
- Role-based access control
- Secure authentication with Firebase

### Clinic Management
- Clinic registration and management
- Queue management system
- Appointment scheduling
- Patient management

### Queue Management
- Real-time queue monitoring
- Ticket creation and management
- Queue status tracking
- Patient queue status updates

### Telemedicine
- Video consultation capabilities
- Secure video conferencing
- Appointment scheduling for telemedicine
- Patient-doctor communication

## User Flow

1. **Authentication**
   - Users sign in using their email and password
   - Role-based redirection after login
   - Remember me functionality

2. **Clinic Staff Flow**
   - View and manage clinic queues
   - Manage patient appointments
   - Create and manage tickets
   - Monitor queue status

3. **Doctor Flow**
   - View and manage patient appointments
   - Conduct video consultations
   - Access patient information
   - Manage clinic queue

4. **Patient Flow**
   - View available clinics
   - Join clinic queues
   - Schedule appointments
   - Access telemedicine services

## Development Setup

### Prerequisites
- Node.js v15.12.0 or higher
- Docker and Docker Compose
- Firebase CLI
- direnv (optional)

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

5. Start development server:
   ```bash
   npm start
   ```

### Firebase Setup

1. Install Firebase CLI:
   ```bash
   curl -sL https://firebase.tools | bash
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Start Firebase emulator:
   ```bash
   firebase emulators:start --only auth
   ```

## Testing

Run tests using:
```bash
npm test
```

## Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Docker Setup

```bash
docker-compose up --build -d
```

## Environment Variables

Copy `.envrc.template` to `.envrc` and update with your configuration:
```bash
cp .envrc.template .envrc
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

[Your License Information Here]

## Run the QDOC app

From the root directory:

```
npm install
```

```
npx husky install
```

copy contents of envrc.template to your own .envrc and retrieve relevant secrets from qdoc.kdbx

```
cp .envrc.template .envrc
```

If you do not have `direnv` installed

```
source .envrc
```

Otherwise with `direnv` installed

```
direnv allow
```

Setup mock server

```
cd mock_server
npm install
```

Return back to root directory of the project

Run the mock backend server

```
docker-compose up --build -d
```

Lastly, start up react dev server with

```
npm start
```

## View firebase emulator

go to http://localhost:4579

Use the emulator to create a mock account to login the local instance of qdoc

## Setting up firebase-cli:

### Installation

`curl -sL https://firebase.tools | bash`

### Login

`firebase login`

- login using the account in keypass found in qdoc repo

#### Starting firebase auth emulator

`firebase emulators:start --only auth`
Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Connecting to local backend

Backend repo (qdoc) changes
- go to server.ts and change:
```
// change from:
const port = process.env.API_PORT || 3000;

// to:
const port = 3001;
```
- start up the backend server (follow backend repo readme instructions) and finally run `npm run dev`
- ensure that you see the printout `app running on port 3001`

Frontend repo (qdoc-portal) changes
- go to .envrc and change the variable `REACT_APP_API_BASE_URL` to point to 3001 instead of port 4567
```
// from:
export REACT_APP_API_BASE_URL=http://localhost:4567/api/v1

// to:
export REACT_APP_API_BASE_URL=http://localhost:3001/api/v1
```
- ensure that you source/direnv allow the changes
- restart the frontapp app by running `npm start`