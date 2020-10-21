const express = require("express");
const router = express.Router();
const db = require('../db');

router.get('/', async(req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM companies`);
        return res.json(results.rows);
    } catch (error) {
        next(error);
    }
})

router.get('/:code', async(req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM companies WHERE code=$1`, [req.params.code]);
        return res.json(results.rows);
    } catch (error) {
        next(error);
    }
})

router.post('/', async(req, res, next) => {
    try {
        const { code, name, description } = req.body;
        const results = await db.query(`INSERT INTO companies (code, name, description) VALUES($1, $2, $3) RETURNING *`, [code, name, description]);
        return res.status(201).json(results.rows);
    } catch (error) {
        next(error);
    }
})

router.patch('/:code', async(req, res, next) => {
    try {
        const {name, description} = req.body;
        const results = await db.query(`UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING *`, [name, description, req.params.code]);
        return res.json(results.rows);
    } catch (error) {
        next(error);
    }
})

router.delete('/:code', async(req, res, next) => {
    try {
        const results = await db.query(`DELETE FROM companies WHERE code=$1 RETURNING 'Company Deleted'`, [req.params.code]);
        return res.json(results.rows);
    } catch (error) {
        next(error);
    }
})

module.exports = router;