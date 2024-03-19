import express, { Router, Request, Response } from "express";
import { getDatastore } from "../../database";
import { authenticatedUser } from "../auth";
const cors = require("cors");

export const dynamicComponentRouter: Router = express.Router();

const corsOptions = {
  origin: ["http://localhost:5173","https://handycraft.io","http://handycraft.io","www.handycraft.io", "https://handycraft-415122.oa.r.appspot.com"],
  credentials: true,
};
dynamicComponentRouter.use(cors(corsOptions));

dynamicComponentRouter.post("/new", authenticatedUser, async (req: Request, res: Response) => {
    console.log(req.body);
    const kind: string = "DynamicComponent";
    const name: string = req.body.title;
    const datastore = getDatastore();
    const key = datastore.key([kind, name]);
    const entity = {
      key: key,
      data: [
        {
          name: "title",
          value: req.body.title,
        },
        {
          name: "description",
          value: req.body.description,
        },
        {
          name: "component_definition",
          value: req.body.component_definition,
          excludeFromIndexes: true,
        },
        {
          name: "image_url",
          value: req.body.image_url,
          excludeFromIndexes: true,
        },
        {
          name: "created_on",
          value: new Date().toISOString(),
        },
        {
          name: "approval_status",
          value: "pending",
        },
      ],
    };
    await datastore.save(entity);
    res.send({
      status: "success",
      message: "Dynamic component created successfully",
      id: req.body.title,
    });
  }
);

dynamicComponentRouter.post("/approve", async (req: Request, res: Response) => {
  const datastore = getDatastore();
  const key = datastore.key(["DynamicComponent", req.body.id]);
  const [entity] = await datastore.get(key);
  if (entity) {
    entity.approval_status = "approved";
    entity.approved_on = new Date().toISOString();
    await datastore.save({
      key: key,
      data: entity,
    });
    res.send({
      status: "success",
      message: "Dynamic component approved successfully",
    });
  } else {
    res.send({ status: "error", message: "Dynamic component not found" });
  }
});

dynamicComponentRouter.get("/list", async (req: Request, res: Response) => {
  const datastore = getDatastore();
  let query = datastore.createQuery("DynamicComponent");
  if (req.query.approval_status === undefined) {
    query = query.filter("approval_status", "=", "approved");
  } else {
    query = query.filter("approval_status", "=", req.query.approval_status);
  }
  const [dynamicComponents] = await datastore.runQuery(query);
  res.send(dynamicComponents);
});

dynamicComponentRouter.get("/new", async (req, res) => {
    try {
      const datastore = getDatastore();
      let query = datastore.createQuery("DynamicComponent");
      const [dynamicComponents] = await datastore.runQuery(query);
      // console.log("Data fetched successfully:", dynamicComponents);
      res.send(dynamicComponents);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });


dynamicComponentRouter.delete(
  "/new",  async (req: Request, res: Response) => {
    try {
      const datastore = getDatastore();
      const query = datastore.createQuery("DynamicComponent");
      const [dynamicComponents] = await datastore.runQuery(query);

      // Delete all entities found by the query
      const deletePromises = dynamicComponents.map(async (entity: any) => {
        await datastore.delete(entity[datastore.KEY]);
      });

      await Promise.all(deletePromises);

      res.send({
        status: "success",
        message: "All data from /new endpoint deleted successfully",
      });
    } catch (error: any) {
    res.status(500).send({ error: error.message });
    }
  }
);


