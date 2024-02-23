"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicComponentRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = require("../../database");
exports.dynamicComponentRouter = express_1.default.Router();
exports.dynamicComponentRouter.post('/new', async (req, res) => {
    const kind = 'DynamicComponent';
    const name = req.body.title;
    const datastore = (0, database_1.getDatastore)();
    const key = datastore.key([kind, name]);
    const entity = {
        key: key,
        data: [
            {
                name: 'title',
                value: req.body.title
            },
            {
                name: 'description',
                value: req.body.description
            },
            {
                name: 'code',
                value: req.body.code
            },
            {
                name: 'image_url',
                value: req.body.image_url
            },
            {
                name: 'created_on',
                value: new Date().toISOString()
            },
            {
                name: 'approval_status',
                value: 'pending'
            }
        ]
    };
    await datastore.save(entity);
    res.send({ status: 'success', message: 'Dynamic component created successfully', id: req.body.title });
});
exports.dynamicComponentRouter.post('/approve', async (req, res) => {
    const datastore = (0, database_1.getDatastore)();
    const key = datastore.key(['DynamicComponent', req.body.id]);
    const [entity] = await datastore.get(key);
    if (entity) {
        entity.approval_status = 'approved';
        entity.approved_on = new Date().toISOString();
        await datastore.save({
            key: key,
            data: entity
        });
        res.send({ status: 'success', message: 'Dynamic component approved successfully' });
    }
    else {
        res.send({ status: 'error', message: 'Dynamic component not found' });
    }
});
exports.dynamicComponentRouter.get('/list', async (req, res) => {
    const datastore = (0, database_1.getDatastore)();
    let query = datastore.createQuery('DynamicComponent');
    if (req.query.approval_status === undefined) {
        query = query.filter('approval_status', '=', 'approved');
    }
    else {
        query = query.filter('approval_status', '=', req.query.approval_status);
    }
    const [dynamicComponents] = await datastore.runQuery(query);
    res.send(dynamicComponents);
});
