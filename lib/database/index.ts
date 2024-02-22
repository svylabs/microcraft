import { Datastore } from "@google-cloud/datastore";

let datastore: Datastore;

export function setDatastore(db: Datastore) {
    if (!datastore) {
        datastore = db;
    }
}

export function getDatastore() {
    return datastore;
}