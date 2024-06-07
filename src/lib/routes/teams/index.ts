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
// teamsRouter.get("/list", authenticatedUser, async (req: Request, res: Response) => {
//     const session = req.session as CustomSession;
//     const teamList = session.user?.teams
//     const query = datastore.createQuery("Team")
//                     .filter('id', 'IN', teamList?.map((teamId: string) => datastore.key(['Team', teamId])) || []);
//     const [teams] = await datastore.runQuery(query);
//     res.json(teams);
//   });

teamsRouter.get("/list", authenticatedUser, async (req: Request, res: Response) => {
    const session = req.session as CustomSession;
    const teamList = session.user?.teams;

    // Check if teamList is undefined or empty
    if (!teamList || teamList.length === 0) {
        return res.json([]);
    }

    const query = datastore.createQuery("Team")
        .filter('id', 'IN', teamList.map((teamId: string) => datastore.key(['Team', teamId])));

    try {
        const [teams] = await datastore.runQuery(query);
        res.json(teams);
    } catch (error) {
        console.error("Error fetching teams list:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


/**
 * Create a new team
 */
// teamsRouter.post("/new", authenticatedUser, async (req: Request, res: Response) => {
//     const name = req.body.name;
//     const description = req.body.description;
//     const user = (req.session as CustomSession).user;
//     const userId = user?.id;
//     const teamId = mcutils.getId(user?.id + name);
//     const entity = {
//         key: datastore.key(["Team", teamId]),
//         data: {
//             name: name,
//             description: description,
//             createdBy: user?.id,
//             createdAt: new Date(),
//             admins: [user?.id],
//         },
//     };
//     await datastore.save(entity);
//     const userKey = datastore.key(["User", userId + ""]);
//     const [userData] = await datastore.get(userKey);
//     userData.teams = userData.teams || [];
//     userData.teams.push(teamId);
//     userData.updatedAt = new Date();
//     await datastore.update(userData);
//     res.json(entity);
// });

teamsRouter.post("/new", authenticatedUser, async (req: Request, res: Response) => {
    const name = req.body.name;
    const description = req.body.description;
    const user = (req.session as CustomSession).user;
    const userId = user?.id;
    const teamId = mcutils.getId(user?.id + name);
    const entity = {
        key: datastore.key(["Team", teamId]),
        data: {
            name: name,
            description: description,
            createdBy: user?.id,
            createdAt: new Date(),
            admins: [user?.id],
        },
    };

    try {
        await datastore.save(entity);

        const userKey = datastore.key(["User", userId + ""]);
        const [userData] = await datastore.get(userKey);
        userData.teams = userData.teams || [];
        userData.teams.push(teamId);
        userData.updatedAt = new Date();
        await datastore.update(userData);

        res.json(entity);
    } catch (error) {
        console.error("Error creating new team:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


/**
 * Add a user to the team
 */
// teamsRouter.post("/add-user", authenticatedUser, async (req: Request, res: Response) => {
//     const teamId = req.body.teamId;
//     const email = req.body.email;
//     const teamKey = datastore.key(["Team", teamId]);
//     const [team] = await datastore.get(teamKey);
//     if (!team) {
//         return res.status(404).json({ error: "Team not found" });
//     }
//     if (team.admins.indexOf((req.session as CustomSession).user?.id) === -1) {
//         return res.status(403).json({ error: "You are not an admin of this team" });
//     }
//     const query = datastore.createQuery("Users")
//                     .filter('email', 'IN', [email]);
//     const [users] = await datastore.runQuery(query);
//     const updatedUsers = users.map((user: any) => {
//         user.teams = user.teams || [];
//         user.teams.push(teamId);
//         user.updatedAt = new Date();
//         return user;
//     });
//     await datastore.update(updatedUsers);
//     res.json(updatedUsers);
// });

teamsRouter.post("/add-user", authenticatedUser, async (req: Request, res: Response) => {
    const teamId = req.body.teamId;
    const email = req.body.email;
    const teamKey = datastore.key(["Team", teamId]);
    const [team] = await datastore.get(teamKey);

    if (!team) {
        return res.status(404).json({ error: "Team not found" });
    }

    if (team.admins.indexOf((req.session as CustomSession).user?.id) === -1) {
        return res.status(403).json({ error: "You are not an admin of this team" });
    }

    const query = datastore.createQuery("Users")
        .filter('email', 'IN', [email]);

    try {
        const [users] = await datastore.runQuery(query);
        const updatedUsers = users.map((user: any) => {
            user.teams = user.teams || [];
            user.teams.push(teamId);
            user.updatedAt = new Date();
            return user;
        });

        await datastore.update(updatedUsers);
        res.json(updatedUsers);
    } catch (error) {
        console.error("Error adding user to team:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});