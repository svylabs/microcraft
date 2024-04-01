import express, {Request, Response} from 'express';
import { BigQuery } from '@google-cloud/bigquery';
import cors from 'cors';
import axios from 'axios';
import { CustomSession, authenticatedUser } from '../auth';
import { getDatastore } from '../../database';

export const appDataRouter = express.Router();

const corsOptions = {
    origin: ["http://localhost:5173","https://microcraft.dev","http://microcraft.dev","www.microcraft.dev", "https://handycraft-415122.oa.r.appspot.com"],
    credentials: true,
  };

appDataRouter.use(cors(corsOptions));

appDataRouter.post('/set-selected-app', authenticatedUser, async (req: Request, res: Response) => {
    try {
        const { selected_app } = req.body;
        const session = req.session as CustomSession;
        session.selectedApp = selected_app;
        res.json({ status: 'success' });
    } catch (error) {
        console.error('Error setting data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

appDataRouter.post('/unset-selected-app', authenticatedUser, async (req: Request, res: Response) => {
    try {
        const session = req.session as CustomSession;
        session.selectedApp = undefined;
        res.json({ status: 'success' });
    } catch (error) {
        console.error('Error setting data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

appDataRouter.post('/set', authenticatedUser, async (req: Request, res: Response) => {
    try {
        const { key, value } = req.body;
        const session = req.session as CustomSession;
        const datastore = getDatastore();
        const kind = 'AppData';
        const userId = session.user?.id;
        if (!session.selectedApp) {
            res.status(400).json({ error: 'No app selected' });
            return;
        }
        const entityKey = datastore.key([kind, session.selectedApp + ":" + userId + ":" + key]);
        const entity = {
            key: entityKey,
            data: [
                {
                    name: 'value',
                    value: value,
                },
                {
                    name: 'created_on',
                    value: new Date().toISOString(),
                }
            ],
        };
        await datastore.save(entity);
    } catch (error) {
        console.error('Error setting data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

appDataRouter.get('/get', authenticatedUser, async (req: Request, res: Response) => {
    try {
        const { key } = req.query;
        const session = req.session as CustomSession;
        const datastore = getDatastore();
        const kind = 'AppData';
        const userId = session.user?.id;
        const entityKey = datastore.key([kind, session.selectedApp + ":" + userId + ":" + key]);
        const result =  await datastore.get(entityKey);
        if (result[0] === null || result[0] === undefined) {
            res.json({ value: result[0].value });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error('Error setting data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});