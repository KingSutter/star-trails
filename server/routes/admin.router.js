const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

router.get('/admin/users', rejectUnauthenticated, (req,res) => {
    const queryText = `SELECT "id","username","save_id","admin" FROM "accounts";`
    pool.query(queryText)
    .then((response) => {
        console.log(response);
        
        res.send(response);
    }).catch((error)=>{
        res.sendStatus(500);
    })
})