const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const userStrategy = require('../strategies/user.strategy');

router.get('/users', rejectUnauthenticated, (req,res) => {
    const queryText = `SELECT "id","username","save_id","admin" FROM "accounts";`
    pool.query(queryText)
    .then((response) => {
        console.log(response);
        
        res.send(response);
    }).catch((error)=>{
        res.sendStatus(500);
    })
})

// adds a scenario to DB
router.post('/scenario', rejectUnauthenticated, (req,res) => {
    const queryText = `
    INSERT INTO "scenarios" ("prompt","option1","option2","good_outcome","bad_outcome","neutral_outcome","good_outcome_type_id","bad_outcome_type_id","neutral_outcome_type_id")
    VALUES ('${req.body.prompt}','${req.body.option1}','${req.body.option2}','${req.body.good_outcome}','${req.body.bad_outcome}','${req.body.neutral_outcome}','${Number(req.body.good_outcome_type_id)}','${Number(req.body.bad_outcome_type_id)}','${Number(req.body.neutral_outcome_type_id)}');
    `
    pool.query(queryText)
    .then((response) => {
        res.send(response.rows);
    }).catch((error)=>{
        console.log(error);
        
        res.sendStatus(500);
    })
  })