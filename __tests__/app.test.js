const seed = require("../db/seeds");
const testData = require("../db/data/test-data")
const request = require('supertest');
const app = require('../app');
const db = require('../db');

afterAll(() => {
    if (db.end) db.end();
})

beforeEach(() => {
return seed(testData)
});

describe ("GET: /api", () => {
    test("status 200: returns a message as an JSON object", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then (({ body }) => {
            expect (body).toEqual({"message" : "all working well"})
        });
    });
});