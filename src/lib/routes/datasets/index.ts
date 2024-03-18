import express, {Request, Response} from 'express';
import { BigQuery } from '@google-cloud/bigquery';
import cors from 'cors';

export const datasetRouter = express.Router();

const corsOptions = {
    origin: ["http://localhost:5173","https://handycraft.io","http://handycraft.io","www.handycraft.io", "https://handycraft-415122.oa.r.appspot.com"],
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