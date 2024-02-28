import express, {Router, Request, Response, NextFunction} from 'express';
import {getDatastore} from '../../database';
import axios from 'axios';
import {encode} from 'url-safe-base64';
export const githubRouter: Router = express.Router();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export class HttpError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export type User = {
    login: string;
    id: number;
    avatar_url: string;
    created_on: string;
}

const addUserToCookie = (res: Response, user: any) => {
    res.cookie('userid', user.id, { maxAge: 900000, secure: true });
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
}

githubRouter.get('/user', (req, res) => {
    if (req.cookies.userid) {
        const userid = req.cookies.userid;
        const datastore = getDatastore();
        const key = datastore.key(['User', userid]);
        datastore.get(key).then((result: any) => {
            if (result[0]) {
                res.send(result[0]);
            } else {
                res.status(401).send({message: 'User not found'});
            }
        });
    }
    res.status(401).send({message: 'User not found'});
});


githubRouter.get('/github/callback', async (req, res) => {

    // The req.query object has the query params that were sent to this route.
    const requestToken = req.query.code
    
    let result = await axios({
      method: 'post',
      url: `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${requestToken}`,
      // Set the content type header, so that we get the response in JSON
      headers: {
           accept: 'application/json'
      }
    });
    let accessToken = result.data.access_token;
    let userData = await axios({
        method: 'get',
        url: `https://api.github.com/user`,
        headers: {
          Authorization: 'bearer ' + accessToken
        }
      });
    console.log(userData.data);
    const userDetail = {
       login: userData.data.login,
       id: userData.data.id,
       avatar_url: userData.data.avatar_url,
      created_on: new Date().toISOString()
    }
    addUserToCookie(res, userDetail);
    addUserToDatastore(userDetail);
    res.redirect('/');
  })

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
  }
  