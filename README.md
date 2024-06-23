# Installation
  npm install
# Usage
  ```
    npm run build
    npm start
    or npm run dev for development env
  ```
# Testing
  npm run test
# What was done
  Date validation and timezone, daylight saving handling using date-fns and date-fns-tz
    Dailylight saving is automatically handled based on the provided date
  Configured typescript and used it in the project
  Wrote unit testing using jest
  Error handling and logging with ShiftID
# What Next
## ENV Variable Setup
  Maybe we want to save timezone in .env file but I don't see much usecase since it can vary from customer to customer
## Setup Prettier and Husky
  I wanted to setup Prettier and ESLint for better coding style configuration for team collaboration.
  Also, husky for pre-commit check like running ESLint for each commit and Unit Test for each commit push.
## Batch Processing
  Process shift data in chunks in case the JSON file is too big. 
  We can do it JSONStream and we should merge output of each chunk correctly.
## Setup HTTP Server and Web UI
  We can convert it to HTTP server and create simple UI for uploading JSON file and showing output in UI
  OR maybe we can make it as module so that it can be used in different projects as a library
## Containerization
  We can use Docker. Here is my simple docker configure.
  ```
    FROM node:20

    WORKDIR /usr/src

    COPY package*.json ./

    RUN npm install

    COPY . .

    RUN tsc

    ENV TZ=America/Chicago

    CMD [ "node", "dist/index.js" ]
  ```
