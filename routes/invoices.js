const express = require("express");
const router = express.Router();
const db = require('../db');

router.get('/', async(req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM invoices`);
        return res.json(results.rows);
    } catch (error) {
        next(error);
    }
})

router.get('/:id', async(req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM invoices INNER JOIN companies ON (comp_code = code) WHERE id=$1`, [req.params.id]);
        return res.json(results.rows);
    } catch (error) {
        next(error);
    }
})

router.post('/', async(req, res, next) => {
    try {
        const { comp_code, amt } = req.body;
        const results = await db.query(`INSERT INTO invoices (comp_code, amt) VALUES($1, $2) RETURNING *`, [comp_code, amt]);

        return res.status(201).json(results.rows);
    } catch (error) {
        next(error);
    }
})

router.put('/:id', async(req, res, next) => {
    try {
        const { amt } = req.body;
        const results = await db.query(`UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING *`, [amt, req.params.id]);
        return res.json(results.rows);
    } catch (error) {
        next(error);
    }
})

router.delete('/:id', async(req, res, next) => {
    try {
        const results = await db.query(`DELETE FROM invoices WHERE id=$1 RETURNING 'Invoice Deleted'`, [req.params.id]);
        return res.json(results.rows);
    } catch (error) {
        next(error);
    }
})

module.exports = router;