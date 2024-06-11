import express, { Router, Request, Response } from "express";
import { getDatastore } from "../../database";
import cors from "cors";
import {
  CustomSession,
  HttpError,
  authenticatedUser,
  onlyAdmin,
} from "../auth";
import * as mcutils from "../../utils";

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://microcraft.dev",
    "http://microcraft.dev",
    "www.microcraft.dev",
    "https://handycraft-415122.oa.r.appspot.com",
  ],
  credentials: true,
};

export const teamsRouter = Router();
teamsRouter.use(cors(corsOptions));

const datastore = getDatastore();

/**
 * Get all teams
 */
teamsRouter.get(
  "/all",
  authenticatedUser,
  async (req: Request, res: Response) => {
    const query = datastore.createQuery("Team");
    const [teams] = await datastore.runQuery(query);
    res.json(teams);
  }
);

/**
 * Get all teams for the user
 */
teamsRouter.get(
  "/list",
  authenticatedUser,
  async (req: Request, res: Response) => {
    const session = req.session as CustomSession;
    console.log("Session_list:-> ", session);
    const teamList = session.user?.teams;
    console.log("teamlist_list: ", teamList);

    // Check if teamList is undefined or empty
    if (!teamList || teamList.length === 0) {
      return res.json([]);
    }

    try {
      const queries = teamList.map((teamId: string) => {
        const query = datastore
          .createQuery("Team")
          .filter("__key__", "=", datastore.key(["Team", teamId]));
        return datastore.runQuery(query);
      });

      const results = await Promise.all(queries);
      //   const teams = results.flat().map(result => result[0]);
      const teams = results
        .map((result) => result[0][0]) // Extract only the team entities
        .filter((team) => team != null)
        .map((team) => ({
          ...team,
          id: team[datastore.KEY].name, // Add the id property
        }));
      res.json(teams);
    } catch (error) {
      console.error("Error fetching teams list:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

/**
 * Create a new team
 */
teamsRouter.post(
  "/new",
  authenticatedUser,
  async (req: Request, res: Response) => {
    const name = req.body.name;
    const description = req.body.description;
    const user = (req.session as CustomSession).user;
    const userId = user?.id || 0;
    const teamId = mcutils.getId(user?.id + name);
    console.log("teamId_post: ", teamId);
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
      const userKey = datastore.key(["User", userId]);
      const [userData] = await datastore.get(userKey);
      console.log("User data before update:", userData);

      userData.teams = userData.teams || [];
      userData.teams.push(teamId);
      userData.updatedAt = new Date();
      await datastore.update(userData);
      console.log("User data after update:", userData);

      res.json(entity);
    } catch (error) {
      console.error("Error creating new team:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

/**
 * Add a user to the team
 */
teamsRouter.post(
  "/add-user",
  authenticatedUser,
  async (req: Request, res: Response) => {
    const teamId = req.body.teamId;
    const email = req.body.email;
    const teamKey = datastore.key(["Team", teamId]);
    const [team] = await datastore.get(teamKey);

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    if (team.admins.indexOf((req.session as CustomSession).user?.id) === -1) {
      return res
        .status(403)
        .json({ error: "You are not an admin of this team" });
    }

    const query = datastore.createQuery("Users").filter("email", "=", email);

    try {
      const [users] = await datastore.runQuery(query);
      const updatedUsers = users.map((user: any) => {
        user.teams = user.teams || [];
        user.teams.push(teamId);
        user.updatedAt = new Date();
        return user;
      });

      await datastore.update(updatedUsers);
      console.log("successfully added a user to the team")
      console.log("Updated users:", updatedUsers);
      res.json(updatedUsers);
    } catch (error) {
      console.error("Error adding user to team:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Delete all teams
teamsRouter.delete("/all", authenticatedUser, async (req: Request, res: Response) => {
  const session = req.session as CustomSession;
  const userId = session.user?.id;

  if (!userId) {
      return res.status(400).json({ error: "User ID not found in session" });
  }

  try {
      // Retrieve all teams associated with the user
      const query = datastore.createQuery("Team").filter('createdBy', '=', userId);
      const [teams] = await datastore.runQuery(query);

      if (teams.length === 0) {
          return res.json({ message: "No teams found to delete" });
      }

      console.log(`Found ${teams.length} teams to delete`);

      // Delete each team and its associated data
      const deletionPromises = teams.map(async (team: any) => {
          const teamKey = datastore.key(["Team", team[datastore.KEY].name]);
          console.log(`Deleting team with key: ${teamKey.path}`);
          await datastore.delete(teamKey);
      });

      // Wait for all deletion operations to complete
      await Promise.all(deletionPromises);

      res.json({ message: "All teams deleted successfully" });
  } catch (error) {
      console.error("Error deleting all teams:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});
