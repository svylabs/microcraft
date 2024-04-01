import express, {Request, Response} from 'express';
import { BigQuery } from '@google-cloud/bigquery';
import cors from 'cors';
import axios from 'axios';
import { authenticatedUser } from '../auth';

export const datasetRouter = express.Router();

const projectId = process.env.INFURA_PROJECT_ID;

const corsOptions = {
    origin: ["http://localhost:5173","https://microcraft.dev","http://microcraft.dev","www.microcraft.dev", "https://handycraft-415122.oa.r.appspot.com"],
    credentials: true,
  };

datasetRouter.use(cors(corsOptions));

datasetRouter.post('/bigquery', async (req: Request, res: Response) => {
    try {
        const { query } = req.body;
    
        if (!query) {
          return res.status(400).json({ error: 'Query parameter is required' });
        }
        const bigquery = new BigQuery();
    
        // Run the BigQuery query
        const options = {
          query: query,
          location: 'EU', // Specify the location of the dataset
        };
    
        const [job] = await bigquery.createQueryJob(query as string);
        const [rows] = await job.getQueryResults();
    
        // Send the query results as JSON
        res.json(rows);
      } catch (error) {
        console.error('Error executing BigQuery query:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
});

datasetRouter.post('/dune', async (req: Request, res: Response) => {
    try {
        const { query } = req.body;
    
        if (!query) {
          return res.status(400).json({ error: 'Query parameter is required' });
        }
        const bigquery = new BigQuery();
    
        // Run the BigQuery query
        const options = {
          query: query,
          location: 'EU', // Specify the location of the dataset
        };
    
        const [job] = await bigquery.createQueryJob(query as string);
        const [rows] = await job.getQueryResults();
    
        // Send the query results as JSON
        res.json(rows);
      } catch (error) {
        console.error('Error executing BigQuery query:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
});

datasetRouter.post('/infura', authenticatedUser, async (req: Request, res: Response) => {
    try {
        const { requests } = req.body;
        console.log("Infura: ", requests);
        // Make batch request
        const response = await axios.post(`https://mainnet.infura.io/v3/${projectId}`, requests, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Process response
        const results = response.data;
        res.json(results);
    } catch (error) {
        console.error('Error executing Infura batch request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});