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
    latest_version: string | undefined;
    type: string | undefined; // cosmos, cosmwasm, eth, solana, near etc...
    owner: string | undefined;
    created_at: Date | undefined;
    updated_at: Date | undefined;
}

class ContractVersion {
    contract_id: string | undefined;
    version: string | undefined;
    properties: any | undefined; // ABI, protobuf, etc.
    created_at: Date | undefined;
    updated_at: Date | undefined;
}

class ContractInstance {
    contract_id: string | undefined;
    version: string | undefined;
    address: string | undefined;
    network: any | undefined;
    created_at: Date | undefined;
    updated_at: Date | undefined;
}

contractRegistryRouter.get("/list", authenticatedUser, async (req: Request, res: Response) => {
    const datastore = getDatastore();
    const session = req.session as CustomSession;
    const query = datastore.createQuery(CONTRACT_TABLE)
        .filter("owner", "IN", session?.user?.teams)
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
    const contractVersionQuery = datastore.createQuery(CONTRACT_VERSION_TABLE)
        .filter("contract_id", "=", req.params.id)
        .filter("version", "=", contract.latest_version);
    const [contractVersion] = await datastore.runQuery(contractVersionQuery);
    contract.data = contractVersion;
    const contractInstanceQuery = datastore.createQuery(CONTRACT_INSTANCE_TABLE)
        .filter("contract_id", "=", req.params.id)
        .filter("version", "=", contract.latest_version);
    const [contractInstance] = await datastore.runQuery(contractInstanceQuery);
    if (contractInstance.length > 0) {
        contract.instance = contractInstance;
    }
    res.json(contract);
});

contractRegistryRouter.put("/new", authenticatedUser, async (req: Request, res: Response) => {
    const datastore = getDatastore();
    const key = datastore.key("ContractRegistry");
    const contract = {
        key,
        data: req.body,
    };
    await datastore.save(contract);
});
