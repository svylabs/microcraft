import express, { Router, Request, Response } from "express";
import { getDatastore } from "../../database";
import { CustomSession, HttpError, authenticatedUser, onlyAdmin } from "../auth";
const cors = require("cors");
const cookieParser = require("cookie-parser");

export const dynamicComponentRouter: Router = express.Router();

const corsOptions = {
  origin: ["http://localhost:5173","https://microcraft.dev","http://microcraft.dev","www.microcraft.dev", "https://handycraft-415122.oa.r.appspot.com"],
  credentials: true,
};
dynamicComponentRouter.use(cors(corsOptions));
dynamicComponentRouter.use(cookieParser());

dynamicComponentRouter.post("/new", authenticatedUser, async (req: Request, res: Response) => {
    const kind: string = "DynamicComponent";
    const id: string = crypto.randomUUID();
    const datastore = getDatastore();
    const creator = (req.session as CustomSession).user?.id;
    const key = datastore.key([kind, id]);
    const [existing_record] = await datastore.get(key);
    if (existing_record) {
        res.status(400).send({ status: "error", message: "Dynamic component already exists" });
        return;
    }
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
            name: "creator",
            value: creator,
        },
        {
          name: "approval_status",
          value: "pending",
        }
      ],
    };
    await datastore.save(entity);
    res.send({
      status: "success",
      message: "Dynamic component created successfully",
      id: id,
    });
  }
);

dynamicComponentRouter.post("/approve", authenticatedUser, onlyAdmin, async (req: Request, res: Response) => {
  const datastore = getDatastore();
  const key = datastore.key(["DynamicComponent", req.body.id]);
  const [entity] = await datastore.get(key);
  if (entity) {
    entity.approval_status = "approved";
    entity.approved_on = new Date().toISOString();
    entity.approved_by = (req.session as CustomSession).user?.id;
    if (req.body.is_authentication_required) {
        entity.is_authentication_required = req.body.is_authentication_required;
    }
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


dynamicComponentRouter.post("/suggest", authenticatedUser, async (req, res) => {
    try {
      const datastore = getDatastore();
      const { title, description } = req.body;
      const id = crypto.randomUUID();
      const entity = {
         key: datastore.key(["DynamicComponentSuggestion", id]),
         data: [
            {
                name: "title",
                value: title,
                excludeFromIndexes: true,
            },
            {
                name: "description",
                value: description,
                excludeFromIndexes: true
            },
            {
                name: "created_on",
                value: new Date().toISOString(),
            },
            {
                name: "creator",
                value: (req.session as CustomSession).userid,
            }
        ]
      };
      await datastore.save(entity);
      // console.log("Data fetched successfully:", dynamicComponents);
      res.send(entity);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });


  dynamicComponentRouter.post("/suggestion-feedback", authenticatedUser, async (req, res) => {
    try {
      const datastore = getDatastore();
      const { id, feedback } = req.body;
      const entity = {
         key: datastore.key(["DynamicComponentSuggestionFeedback", id + ":" + (req.session as CustomSession).userid]),
         data: [
            {
                name: "feedback",
                value: feedback
            },
            {
                name: "created_on",
                value: new Date().toISOString(),
            },
            {
                name: "creator",
                value: (req.session as CustomSession).userid,
            }
        ]
      };
      await datastore.save(entity);
      // console.log("Data fetched successfully:", dynamicComponents);
      res.send(entity);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });


  dynamicComponentRouter.get("/suggestion-list", authenticatedUser, async (req, res) => {
    try {
      const datastore = getDatastore();
      let query = datastore.createQuery("DynamicComponentSuggestion");
      const [suggestions] = await datastore.runQuery(query);
      // console.log("Data fetched successfully:", dynamicComponents);
      res.send(suggestions);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });


dynamicComponentRouter.get("/all", async (req, res) => {
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

  dynamicComponentRouter.get("/:id", async (req, res) => {
    try {
      const componentId = req.params.id;
      const datastore = getDatastore();
      let result = await datastore.get(datastore.key(["DynamicComponent", componentId]));
      if (result[0] === null || result[0] === undefined) {
        res.status(404).send({ error: "Dynamic component not found" });
        return;
      } else {
      // console.log("Data fetched successfully:", dynamicComponents);
        res.send(result[0]);
      }
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  });

/*
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
*/


