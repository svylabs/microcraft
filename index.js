"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const database_1 = require("./lib/database");
const path_1 = __importDefault(require("path"));
const PORT = process.env.PORT || 8080;
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Imports the Google Cloud client library
const { Datastore } = require('@google-cloud/datastore');
// Creates a client
const datastore = new Datastore();
(0, database_1.setDatastore)(datastore);
const dynamic_component_1 = require("./lib/routes/dynamic-component");
const auth_1 = require("./lib/routes/auth");
app.use('/dynamic-component', dynamic_component_1.dynamicComponentRouter);
app.use('/auth', auth_1.githubRouter);
app.get('/', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, '/index.html'));
});
function printAvailableAPIs() {
    console.log('Available APIs:');
    app._router.stack.forEach((middleware) => {
        console.log(middleware);
        if (middleware.route) {
            console.log(`${Object.keys(middleware.route.methods)} -> ${middleware.route.path}`);
        }
    });
}
const server = app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    //printAvailableAPIs();
});
module.exports = server;
