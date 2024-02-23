import express, {Router, Request, Response} from 'express';
import {getDatastore} from '../../database';
import axios from 'axios';
import {encode} from 'url-safe-base64';
export const githubRouter: Router = express.Router();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const addUserToCookie = (res: Response, user: any) => {
    res.cookie('user', JSON.stringify(user), { maxAge: 900000, secure: true });
};

const addUserToDatastore = async (user: any) => {
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
       avatar_url: userData.data.avatar_url
    }
    addUserToCookie(res, userDetail);
    addUserToDatastore(userDetail);
    res.redirect('/');
  })
  