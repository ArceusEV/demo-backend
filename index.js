const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const logger = require("pino")({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
});
const cors = require("cors");
require('dotenv').config();
const app = express();

// Connect to MongoDB
MongoClient.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()  =>{

  logger.info('Successfully connected to the database');
}, (error) => {
  logger.error('Could not connect to the database, error: ' + error);
})

// Express Settings
app.set("trust proxy", true);
app.use(express.json());
app.use(
    express.urlencoded({
      extended: false,
    })
);
app.use(cors());

//Routers
const chargerRoute = require("./routes/ChargertRoute");
app.use("/charger", chargerRoute);

//Listen Port
app.listen(process.env.SERVER_PORT, process.env.SERVER_HOSTNAME,() => {
  logger.info(`Express is listening at http://${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}`);
})

// Global Error Handler
const errorLogger = (err, req, res, next) => {
  logger.error(err.message); // Log error message in our server's console
  next(err); //Pass control to errorResponder
}

const errorResponder = (err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
}

const invalidPathHandler = (req, res, next) => {
  res.status(404).send('invalid path');
}

app.use(errorLogger);
app.use(errorResponder);
app.use(invalidPathHandler);