const express = require("express");
const router = express.Router();
const db = require('../db');
const now = new Date().toLocaleDateString('en-CA');

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
        const { amt, paid } = req.body;
        const paidData = (await db.query(`SELECT paid, paid_date FROM invoices WHERE id=$1`, [req.params.id])).rows[0];
        const isPaid = paidData["paid"];
        const currDate = paidData["paid_date"];
        console.log(now)
        let payDate;
        if(req.body.paid && !isPaid) {
            payDate = now;
        } else if(isPaid && !req.body.paid) {
            payDate = null;
        } else {
            payDate = currDate;
        }
        console.log(payDate);
        const results = await db.query(`UPDATE invoices SET amt=$1, paid=$3, paid_date=$4 WHERE id=$2 RETURNING *`, [amt, req.params.id, paid, payDate]);
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