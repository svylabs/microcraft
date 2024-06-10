import express, { Router, Request, Response } from "express";
import { getDatastore } from "../../database";
import cors from 'cors';
import { CustomSession, HttpError, authenticatedUser, onlyAdmin } from "../auth";
import * as mcutils from '../../utils';

const corsOptions = {
    origin: ["http://localhost:5173","https://microcraft.dev","http://microcraft.dev","www.microcraft.dev", "https://handycraft-415122.oa.r.appspot.com"],
    credentials: true,
};

const contractRegistryRouter = Router();

contractRegistryRouter.use(cors(corsOptions));

const CONTRACT_TABLE = "Contract";
const CONTRACT_VERSION_TABLE = "ContractVersion";
const CONTRACT_INSTANCE_TABLE = "ContractInstance";

class Contract {
    id: string | undefined;
    name: string | undefined;
    description: string | undefined;
    type: string | undefined; // cosmos, cosmwasm, eth, solana, near etc...
    latest_version?: string;
    team?: string;
    created_at?: Date;
    updated_at?: Date;
    constructor(id: string, name: string, description: string, type: string, team: string, version: string="v1") {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
        this.team = team;
        this.created_at = new Date();
        this.updated_at = new Date();
    }
}

class ContractVersion {
    contract_id: string | undefined;
    version: string | undefined;
    properties: any; // ABI, protobuf, etc.
    created_at?: Date;
    updated_at?: Date;
}

class ContractInstance {
    contract_id: string | undefined;
    version: string | undefined;
    deployed_address: string | undefined;
    network: any | undefined; // eth_mainnet, eth_sepollia, etc..
    created_at?: Date;
    updated_at?: Date;
}

contractRegistryRouter.get("/list", authenticatedUser, async (req: Request, res: Response) => {
    const datastore = getDatastore();
    const session = req.session as CustomSession;
    const query = datastore.createQuery(CONTRACT_TABLE)
        .filter("team", "IN", session?.user?.teams)
    const [contracts] = await datastore.runQuery(query);
    res.json(contracts);
});

contractRegistryRouter.get("/get/:id", authenticatedUser, async (req: Request, res: Response) => {
    const datastore = getDatastore();
    const key = datastore.key([CONTRACT_TABLE, req.params.id]);
    const [contract] = await datastore.get(key);
    if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
    }
    const version = req.query.version || contract.latest_version;
    const network = req.query.network;
    const contractVersionQuery = datastore.createQuery(CONTRACT_VERSION_TABLE)
        .filter("contract_id", "=", req.params.id)
        .filter("version", "=", version);
    const [contractVersion] = await datastore.runQuery(contractVersionQuery);
    contract.data = contractVersion;
    let contractInstanceQuery = datastore.createQuery(CONTRACT_INSTANCE_TABLE)
        .filter("contract_id", "=", req.params.id)
        .filter("version", "=", version);
    if (network) {
        contractInstanceQuery = contractInstanceQuery.filter("network", "=", network);
    }
    const [contractInstances] = await datastore.runQuery(contractInstanceQuery);
    if (contractInstances.length > 0) {
        contract.instances = contractInstances;
    }
    res.json(contract);
});

contractRegistryRouter.put("/new", authenticatedUser, async (req: Request, res: Response) => {
    const datastore = getDatastore();
    const contract_id = mcutils.getId(req.body.name);
    const key = datastore.key([CONTRACT_TABLE, contract_id]);
    const entity = {
        key,
        data: [
            {
                name: "name",
                value: req.body.name,
            },
            {
                name: "description",
                value: req.body.description,
                excludeFromIndexes: true,
            },
            {
                name: "type",
                value: req.body.type,
            },
            {
                name: "team",
                value: req.body.team,
            },
            {
                name: "created_at",
                value: new Date()
            },
            {
                name: "updated_at",
                value: new Date(),
            }
        ],
    };
    await datastore.save(entity);
    res.json(entity);
});

contractRegistryRouter.put("/version/new", authenticatedUser, async (req: Request, res: Response) => {
    const datastore = getDatastore();
    const contract_id = req.body.contract_id;
    const version = req.body.version;
    const contractKey = datastore.key([CONTRACT_TABLE, req.body.contract_id]);
    const [contract] = await datastore.get(contractKey);
    if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
    }
    if (!contract_id || !version) {
        return res.status(400).json({ error: "Contract ID and version are required" });
    }
    const key = datastore.key([CONTRACT_VERSION_TABLE, req.body.contract_id, req.body.version]);
    const contractVersion = {
        key,
        data: [
            {
                name: "contract_id",
                value: req.body.contract_id,
            },
            {
                name: "version",
                value: req.body.version,
            },
            {
                name: "properties",
                value: req.body.properties,
                excludeFromIndexes: true,
            },
            {
                name: "created_at",
                value: new Date(),
            },
            {
                name: "updated_at",
                value: new Date(),
            },
        ]
    };
    if (contract.latest_version) {
        contractVersion.data.push({
            name: "previous_version",
            value: contract.latest_version,
        });
    }
    await datastore.save(contractVersion);
    contract.latest_version = req.body.version;
    contract.updated_at = new Date();
    await datastore.update(contract);
    res.json(contractVersion);
});

contractRegistryRouter.put("/instance/new", authenticatedUser, async (req: Request, res: Response) => {
    const datastore = getDatastore();
    const key = datastore.key([CONTRACT_INSTANCE_TABLE, req.body.contract_id, req.body.version, req.body.network]);
    const contract = {
        key,
        data: [
            {
                name: "contract_id",
                value: req.body.contract_id,
            },
            {
                name: "version",
                value: req.body.version,
            },
            {
                name: "deployed_address",
                value: req.body.deployed_address,
            },
            {
                name: "network",
                value: req.body.network,
            },
            {
                name: "created_at",
                value: new Date(),
            },
            {
                name: "updated_at",
                value: new Date(),
            },
        ]
    };
    await datastore.save(contract);
});
