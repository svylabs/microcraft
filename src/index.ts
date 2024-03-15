import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setDatastore, getDatastore } from './lib/database';
import path from 'path';

dotenv.config();

const PORT: number = parseInt(process.env.PORT || '8080');
const app: Application = express();

app.use(cors());
app.use(express.json());

// Imports the Google Cloud client library
import { Datastore } from '@google-cloud/datastore';

// Creates a client
const datastore: Datastore = new Datastore();
setDatastore(datastore);

import { dynamicComponentRouter } from './lib/routes/dynamic-component';
import { HttpError, githubRouter } from './lib/routes/auth';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Handle the error
  if (err instanceof HttpError) {
    res.status((err as HttpError).status || 500);
  } else {
    res.status(500);
  }
  res.json({
    error: {
      message: err.message
    }
  });
};

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optionally, you can throw the error to crash the process
  // throw reason;
});

app.use(errorHandler);
app.use(express.static('public'));
app.use('/dynamic-component', dynamicComponentRouter);
app.use('/auth', githubRouter);

app.get('/', function(req: Request, res: Response) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

function printAvailableAPIs(): void {
  console.log('Available APIs:');
  (app as any)._router.stack.forEach((middleware: any) => {
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

export = server;
