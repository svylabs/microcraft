import express, {Application, Express, Request, Response} from 'express';
import 'dotenv/config';
import { setDatastore, getDatastore } from './lib/database';
import path from 'path';
const PORT = process.env.PORT || 8080;
const app: Application = express();

app.use(express.json());

// Imports the Google Cloud client library
const {Datastore} = require('@google-cloud/datastore');

// Creates a client
const datastore = new Datastore();
setDatastore(datastore);
import {dynamicComponentRouter} from './lib/routes/dynamic-component';
import {githubRouter} from './lib/routes/auth';

app.use('/dynamic-component', dynamicComponentRouter);
app.use('/auth', githubRouter);
app.get('/', function(req: Request, res: Response) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

function printAvailableAPIs() {
  console.log('Available APIs:');
  app._router.stack.forEach((middleware: any) => {
    console.log(middleware);
    if (middleware.route) {
      console.log(`${Object.keys(middleware.route.methods)} -> ${middleware.route.path}`);
    }
  });
}

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  //printAvailableAPIs();
});

module.exports = server;
