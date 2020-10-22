process.env.NODE_ENV = "test";
const request = require('supertest');
const { response } = require('../app');
const app = require('../app')
const db = require('../db');

let testCo;

beforeEach(async () => {
    const result = await db.query(`INSERT INTO companies (code, name, description) VALUES ('pizza-zone', 'Pizza Zone', 'We make the best pizza.') RETURNING *`);
    testCo = result.rows[0];
});

afterEach(async() => {
    await db.query(`DELETE FROM companies`);
})

describe("GET /companies", () => {
    test("Returns all companies", async () => {
        const response = await request(app).get('/companies');
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual([testCo]);
    })
})

describe("GET /companies/:id", () => {
    test("Returns company by id", async () => {
        const response = await request(app).get(`/companies/${testCo.code}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([testCo]);
    });
    test("Returns 404 Error with bad company id", async () => {
        const response = await request(app).get(`/companies/fdas`);
        expect(response.statusCode).toBe(404);
    })
})

describe("Post /companies", () => {
    test("Adds new company", async () => {
        const company = {code: 'candy', name: 'Candy Co', description: 'We make the best candy'};
        const response = await request(app).post('/companies').send(company);
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual([company]);
    })
})

describe("Patch /companies/:code", () => {
    test("Patches company", async () => {
        const response = await request(app).patch(`/companies/${testCo.code}`).send({code: 'candy', name: 'Candy Co', description: 'We make the best candy'});
        console.log(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({code: 'candy', name: 'Candy Co', description: 'We make the best candy'});
    })
})

describe("DELTE /companies/:id", () => {
    test("Deletes company", async () => {
        const response = await request(app).delete(`/companies/${testCo.code}`);
        console.log(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([ {"?column?": "Company Deleted"} ]);
    })
})

afterAll(async () => {
    await db.end();
})