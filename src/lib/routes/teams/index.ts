import express, { Router, Request, Response } from "express";
import { getDatastore } from "../../database";
import cors from 'cors';
import { CustomSession, HttpError, authenticatedUser, onlyAdmin } from "../auth";
import * as mcutils from '../../utils';

const corsOptions = {
    origin: ["http://localhost:5173","https://microcraft.dev","http://microcraft.dev","www.microcraft.dev", "https://handycraft-415122.oa.r.appspot.com"],
    credentials: true,
};

export const teamsRouter = Router();
teamsRouter.use(cors(corsOptions));

const datastore = getDatastore();

/**
 * Get all teams
 */
teamsRouter.get("/all", authenticatedUser, async (req: Request, res: Response) => {
  const query = datastore.createQuery("Team");
  const [teams] = await datastore.runQuery(query);
  res.json(teams);
});

/**
 * Get all teams for the user
 */
teamsRouter.get("/list", authenticatedUser, async (req: Request, res: Response) => {
    const session = req.session as CustomSession;
    const teamList = session.user?.teams
    const query = datastore.createQuery("Team")
                    .filter('id', 'IN', teamList?.map((teamId: string) => datastore.key(['Team', parseInt(teamId)])) || []);
    const [teams] = await datastore.runQuery(query);
    res.json(teams);
  });


/**
 * Create a new team
 */
teamsRouter.post("/new", authenticatedUser, onlyAdmin, async (req: Request, res: Response) => {
    const name = req.body.name;
    const description = req.body.description;
    const user = (req.session as CustomSession).user;
    const entity = {
        key: datastore.key(["Team", mcutils.getId(user?.id + name)]),
        data: {
            name: name,
            description: description,
            createdBy: user?.id,
            createdAt: new Date(),
            admins: [user?.id],
        },
    };
    await datastore.save(entity);
    res.json(entity);
});


/**
 * Add a user to the team
 */
teamsRouter.post("/add-user", authenticatedUser, onlyAdmin, async (req: Request, res: Response) => {
    const teamId = req.body.teamId;
    const userIds = req.body.userIds;
    const teamKey = datastore.key(["Team", parseInt(teamId)]);
    const [team] = await datastore.get(teamKey);
    const query = datastore.createQuery("Users")
                    .filter('id', 'IN', userIds.map((userId: string) => datastore.key(['User', parseInt(userId)])));
    const [users] = await datastore.runQuery(query);
    const updatedUsers = users.map((user: any) => {
        user.teams = user.teams || [];
        user.teams.push(teamId);
        user.updatedAt = new Date();
        return user;
    });
    await datastore.save(updatedUsers);
    res.json(updatedUsers);
});