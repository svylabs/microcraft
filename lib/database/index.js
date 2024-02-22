"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatastore = exports.setDatastore = void 0;
let datastore;
function setDatastore(db) {
    if (!datastore) {
        datastore = db;
    }
}
exports.setDatastore = setDatastore;
function getDatastore() {
    return datastore;
}
exports.getDatastore = getDatastore;
