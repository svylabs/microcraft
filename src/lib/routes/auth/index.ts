import express, { Router, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { setDatastore, getDatastore } from '../../database';
import axios from 'axios';
import { encode } from 'url-safe-base64';
import { CookieOptions } from 'express';

export const githubRouter: Router = express.Router();

// const GITHUB_CLIENT_ID: string | undefined = process.env.GITHUB_CLIENT_ID;
// const GITHUB_CLIENT_SECRET: string | undefined = process.env.GITHUB_CLIENT_SECRET;

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface User {
  login: string;
  id: number;
  avatar_url: string;
  created_on: string;
}

const addUserToCookie = (res: Response, user: User) => {
  const options: CookieOptions = {
    maxAge: 900000,
    secure: true
  };
  res.cookie('userid', user.id.toString(), options);
};

const addUserToDatastore = async (user: User) => {
  const kind = 'User';
  const datastore = getDatastore();
  const key = datastore.key([kind, user.id.toString()]);
  const entity = {
    key: key,
    data: [
      {
        name: 'login',
        value: user.login
      },
      {
        name: 'id',
        value: user.id
      },
      {
        name: 'avatar_url',
        value: user.avatar_url
      },
      {
        name: 'created_on',
        value: new Date().toISOString()
      }
    ]
  };
  const [existing_user] = await datastore.get(key);
  if (!existing_user) {
    await datastore.save(entity);
  }
};

githubRouter.get('/user', (req: Request, res: Response) => {
  if (req.cookies.userid) {
    const userid: string = req.cookies.userid;
    const datastore = getDatastore();
    const key = datastore.key(['User', userid]);
    datastore.get(key).then((result: any) => {
      if (result[0]) {
        res.send(result[0]);
      } else {
        res.status(401).send({ message: 'User not found' });
      }
    });
  } else {
    res.status(401).send({ message: 'User not found' });
  }
});

githubRouter.get('/github/callback', async (req: Request, res: Response, next: NextFunction) => {
    const requestToken: string | undefined = typeof req.query.code === 'string' ? req.query.code : undefined;
  
    if (!requestToken) {
      res.status(400).send({ message: 'Bad request' });
      return;
    }
  
    try {
      const result = await axios.post(`https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${requestToken}`, null, {
        headers: {
          accept: 'application/json'
        }
      });
  
      const accessToken: string | undefined = result.data.access_token;
  
      if (!accessToken) {
        throw new HttpError('Access token not found', 500);
      }
  
      const userDataResult = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `bearer ${accessToken}`
        }
      });
  
      const userData = userDataResult.data;
  
      const userDetail: User = {
        login: userData.login,
        id: userData.id,
        avatar_url: userData.avatar_url,
        created_on: new Date().toISOString()
      };
  
      addUserToCookie(res, userDetail);
      await addUserToDatastore(userDetail);
  
      res.redirect('/');
    } catch (error) {
      next(error);
    }
  });
  

export const authenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
  if (req.cookies?.userid) {
    const userid = JSON.parse(req.cookies.userid);
    const datastore = getDatastore();
    const result = await datastore.get(datastore.key(['User', userid.toString()]));
    if (result[0]) {
      (req as any).user = result[0];
      return next();
    }
  }
  const error = new HttpError('Unauthorized', 401);
  return next(error);
};
