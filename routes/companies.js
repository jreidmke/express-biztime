const express = require("express");
const router = express.Router();
const db = require('../db');
const ExpressError = require("../expressError");
const slugify = require('slugify');

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
        if(results.rows.length === 0) {
            throw new ExpressError(`Can't find company with code ${req.params.code}`, 404)
        }
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

router.put('/:code', async(req, res, next) => {
    try {
        const {name, description} = req.body;
        const code = slugify(name).toLowerCase();
        const results = await db.query(`UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING *`, [name, description, req.params.code]);
        return res.json(results.rows[0]);
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