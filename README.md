# Building a Telegram Bot with Node.js and TypeScript

## Introduction

### Environment Variables

The following environment variables are required:

```
BOT_TOKEN=[Telegram Bot Token]
SERVER_URL=[Public URL of the server]
PORT=[Port of the server]
```

### Scripts

The following scripts are available:

```
npm run build
npm run start
npm run dev # Starts the server in development mode
  "concurrently \"npx tsc --watch\" \"nodemon -q dist/index.js\" \"ngrok http 5000\""
  - [concurrently](https://www.npmjs.com/package/concurrently) will run both commands concurrently
  - [tsc](https://www.npmjs.com/package/tsc) will watch for changes and recompile the TypeScript
  - [nodemon](https://www.npmjs.com/package/nodemon) will watch for changes and restart the server

  - we need to run:
    - `npx tsc --watch` to watch for changes and recompile the TypeScript
    - `nodemon -q dist/index.js` to watch for changes and restart the server
    - `ngrok http 5000`






```
