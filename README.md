## QDOC web portal

[![Staging CI](https://github.com/qdoctech/qdoc-portal/actions/workflows/staging-ci.yml/badge.svg?branch=main)](https://github.com/qdoctech/qdoc-portal/actions/workflows/staging-ci.yml)

In the project directory, there are two folders:

1. src
2. external

### `src`

The main QDOC project

### `external`

Reference to the react UI theme (purchased)

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