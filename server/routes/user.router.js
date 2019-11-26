const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {  
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);

  const queryText = 'INSERT INTO "accounts" (username, password) VALUES ($1, $2) RETURNING id';
  pool.query(queryText, [username, password])
    .then(() => res.sendStatus(201))
    .catch(() => res.sendStatus(500));
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

// --- admin routes ---

// gets all users from the DB without passwords
router.get('/users', rejectUnauthenticated, (req,res) => {
  // check if user is an admin
  if (!req.user.admin){
    req.sendStatus(401) // unauthorized error
  }else{
    const queryText = `SELECT "id","username","save_id","admin" FROM "accounts";`
    pool.query(queryText)
    .then((response) => {
        res.send(response.rows);
    }).catch((error)=>{
        res.sendStatus(500);
    })
  }
});

// gets all scenarios for editing purposes if admin desires
router.get('/scenarios', rejectUnauthenticated, (req,res) => {
  const queryText = `SELECT * FROM "scenarios" ORDER BY "id" ASC;`
  pool.query(queryText)
  .then((response) => {
      res.send(response.rows);
  }).catch((error)=>{
      res.sendStatus(500);
  })
});

// gets all scenario outcomes and sorts by id
router.get('/outcomes', rejectUnauthenticated, (req,res) => {
  const queryText = `SELECT * FROM "outcomes" ORDER BY "id" ASC;`
  pool.query(queryText)
  .then((response) => {
      res.send(response.rows);
  }).catch((error)=>{
      res.sendStatus(500);
  })
});

// adds a scenario to DB
router.post('/scenario', rejectUnauthenticated, (req,res) => {
  if (!req.user.admin){
    req.sendStatus(401) // unauthorized error
  }else{
    const queryText = `
    INSERT INTO "scenarios" ("prompt","option1","option2","good_outcome","good_outcome_id","bad_outcome","bad_outcome_id","neutral_outcome","neutral_outcome_id","non_neutral_outcome","non_neutral_outcome_id","option1_outcomes","option2_outcomes")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
    `
    pool.query(queryText, [req.body.prompt, req.body.option1, req.body.option2, req.body.good_outcome, req.body.good_outcome_id, req.body.bad_outcome, req.body.bad_outcome_id, req.body.neutral_outcome, req.body.neutral_outcome_id, req.body.non_neutral_outcome, req.body.non_neutral_outcome_id, req.body.option1_outcomes, req.body.option2_outcomes])
    .then((response) => {
        res.send(response.rows);
    }).catch((error)=>{
        console.log(error);
        res.sendStatus(500);
    })
  }
});

// deletes a scenario by id
router.delete('/scenario/:id', rejectUnauthenticated, (req,res) => {
  if (!req.user.admin){
    req.sendStatus(401) // unauthorized error
  }else{
    const queryText = `
    DELETE FROM "scenarios"
    WHERE id = $1;
    `
    
    pool.query(queryText, [req.params.id])
    .then(() => {
        res.sendStatus(200);
    }).catch((error)=>{
        console.log(error);
        res.sendStatus(500);
    })
  }
});

// edits a scenario on the DB by id
router.put('/scenario', rejectUnauthenticated, (req,res) => {
  if (!req.user.admin){
    req.sendStatus(401) // unauthorized error
  }else{
    const queryText = `
    UPDATE "scenarios" 
    SET "prompt" = $1, "option1" = $2, "option2" = $3, "good_outcome" = $4, "good_outcome_id" = $5, "bad_outcome" = $6, "bad_outcome_id" = $7, "neutral_outcome" = $8, "neutral_outcome_id" = $9, "non_neutral_outcome" = $10, "non_neutral_outcome_id" = $11, "option1_outcomes" = $12, "option2_outcomes" = $13
    WHERE id = $14;
    `
    pool.query(queryText, [req.body.prompt, req.body.option1, req.body.option2, req.body.good_outcome, req.body.good_outcome_id, req.body.bad_outcome, req.body.bad_outcome_id, req.body.neutral_outcome, req.body.neutral_outcome_id, req.body.non_neutral_outcome, req.body.non_neutral_outcome_id, req.body.option1_outcomes, req.body.option2_outcomes, req.body.id])
    .then((response) => {
        res.send(response.rows);
    }).catch((error)=>{
        console.log(error);
        res.sendStatus(500);
    })
  }
});

// adds an outcome to DB
router.post('/outcome', rejectUnauthenticated, (req,res) => {
  if (!req.user.admin){
    req.sendStatus(401) // unauthorized error
  }else{
    const queryText = `
    INSERT INTO "outcomes" ("day","distance","food","money","phaser_energy","warp_coils","antimatter_flow_regulators","magnetic_constrictors","plasma_injectors","crew_lost")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
    `
    pool.query(queryText, [req.body.day, req.body.distance, req.body.food, req.body.money, req.body.phaser_energy, req.body.warp_coils, req.body.antimatter_flow_regulators, req.body.magnetic_constrictors, req.body.plasma_injectors, req.body.crew_lost])
    .then((response) => {
        res.send(response.rows);
    }).catch((error)=>{
        console.log(error);
        res.sendStatus(500);
    })
  }
});

// edits an outcome on the DB by id
router.put('/outcome', rejectUnauthenticated, (req,res) => {
  if (!req.user.admin){
    req.sendStatus(401) // unauthorized error
  }else{
    const queryText = `
    UPDATE "outcomes" 
    SET "day" = $1,"distance" = $2,"food" = $3,"money" = $4,"phaser_energy" = $5,"warp_coils" = $6,"antimatter_flow_regulators" = $7,"magnetic_constrictors" = $8,"plasma_injectors" = $9,"crew_lost" = $10
    WHERE id = $11;
    `
    pool.query(queryText, [req.body.day, req.body.distance, req.body.food, req.body.money, req.body.phaser_energy, req.body.warp_coils, req.body.antimatter_flow_regulators, req.body.magnetic_constrictors, req.body.plasma_injectors, req.body.crew_lost, req.body.id])
    .then((response) => {
        res.send(response.rows);
    }).catch((error)=>{
        console.log(error);
        res.sendStatus(500);
    })
  }
});

// deletes an outcome by id
router.delete('/outcome/:id', rejectUnauthenticated, (req,res) => {
  if (!req.user.admin){
    req.sendStatus(401) // unauthorized error
  }else{
    const queryText = `
    DELETE FROM "outcomes"
    WHERE id = $1;
    `
    
    pool.query(queryText, [req.params.id])
    .then(() => {
        res.sendStatus(200);
    }).catch((error)=>{
        console.log(error);
        res.sendStatus(500);
    })
  }
});

// deletes a user by id
router.delete('/user/:id', rejectUnauthenticated, (req,res) => {
  if (!req.user.admin){
    req.sendStatus(401) // unauthorized error
  }else{
    const queryText = `
    DELETE FROM "accounts"
    WHERE id = $1;
    `
    
    pool.query(queryText, [req.params.id])
    .then(() => {
        res.sendStatus(200);
    }).catch((error)=>{
        console.log(error);
        res.sendStatus(500);
    })
  }
});

// --- game-related routes -- 

// adds a save to DB and sets that save to the user who created the save
router.post('/save', rejectUnauthenticated, (req,res) => {
  // checks if the user already has a save
  if (req.user.save_id === null){
    // creates a new save
    const saveQueryText = `
    INSERT INTO "save" ("food","money","phaser_energy","warp_coils","antimatter_flow_regulators","magnetic_constrictors","plasma_injectors","captain","medic","engineer","helm","tactical")
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    RETURNING "id";
    `
    pool.query(saveQueryText, [req.body.food, req.body.available, req.body.phaser_energy, req.body.warp_coils, req.body.antimatter_flow_regulators, req.body.magnetic_constrictors, req.body.plasma_injectors, req.body.captain, req.body.medic, req.body.engineer, req.body.helm, req.body.tactical])
    .then((response) => {
        const newSaveID = response.rows[0].id
        // set that new save to the user who created it
        const userQueryText = `
        UPDATE "accounts"
        SET "save_id" = $1
        WHERE "id" = $2;
        `;
        pool.query(userQueryText, [newSaveID,req.user.id])
        .then(() => {
            res.sendStatus(200);
        }).catch((error)=>{
            console.log(error);
            res.sendStatus(500);
        });
    }).catch((error)=>{
        console.log(error);
        res.sendStatus(500);
    })
  }else{
    // will edit the current save
    const queryText = `
    UPDATE "save"
    SET "day"=$1, "distance"=$2, "food"=$3, "money"=$4, "phaser_energy"=$5, "warp_coils"=$6, "antimatter_flow_regulators"=$7, "magnetic_constrictors"=$8, "plasma_injectors"=$9, "captain"=$10, "captain_status"=$11, "medic"=$12, "medic_status"=$13, "engineer"=$14, "engineer_status"=$15, "helm"=$16, "helm_status"=$17, "tactical"=$18, "tactical_status"=$19
    FROM "accounts"
    WHERE "accounts".save_id = "save".id
    AND "accounts".id = $20;`
    console.log(req.body)
    pool.query(queryText,[0, 0, req.body.food, req.body.money, req.body.phaser_energy, req.body.warp_coils, req.body.antimatter_flow_regulators, req.body.magnetic_constrictors, req.body.plasma_injectors, req.body.captain, "healthy", req.body.medic, "healthy", req.body.engineer, "healthy", req.body.helm, "healthy", req.body.tactical, "healthy", req.user.id])
    .then(() => {
      res.sendStatus(200);
    }).catch((error)=>{
      console.log(error);
      res.sendStatus(500);
    })
  }
});

// gets save data by user ID
router.get('/save', rejectUnauthenticated, (req,res) => {
  const queryText = `
  SELECT "save".*
  FROM "save"
  JOIN "accounts" ON "accounts".save_id = "save".id
  WHERE "accounts".id=$1;`;

  pool.query(queryText,[req.user.id])
  .then((response) => {
    res.send(response.rows[0]);
  }).catch((error)=>{
    console.log(error);
    res.sendStatus(500);
  })
});

// change save data by user ID
router.put('/save', rejectUnauthenticated, (req,res) => {
  const queryText = `
  UPDATE "save"
  SET "day"=$1, "distance"=$2, "food"=$3, "money"=$4, "phaser_energy"=$5, "warp_coils"=$6, "antimatter_flow_regulators"=$7, "magnetic_constrictors"=$8, "plasma_injectors"=$9, "captain_status"=$10, "medic_status"=$11, "engineer_status"=$12, "helm_status"=$13, "tactical_status"=$14
  FROM "accounts"
  WHERE "accounts".save_id = "save".id
  AND "accounts".id = $15
  RETURNING "save".*;`;

  pool.query(queryText,[req.body.day, req.body.distance, req.body.food, req.body.money, req.body.phaser_energy, req.body.warp_coils, req.body.antimatter_flow_regulators, req.body.magnetic_constrictors, req.body.plasma_injectors, req.body.captain_status, req.body.medic_status, req.body.engineer_status, req.body.helm_status, req.body.tactical_status, req.user.id])
  .then((response) => {
    res.send(response.rows[0]);
  }).catch((error)=>{
    console.log(error);
    res.sendStatus(500);
  })
});

// gets all scenario data
router.get('/scenarios', rejectUnauthenticated, (req,res) => {
  const queryText = `SELECT * FROM "scenarios";`;

  pool.query(queryText)
  .then((response) => {
    res.send(response.rows);
  }).catch((error)=>{
    console.log(error);
    res.sendStatus(500);
  })
});

// gets all outcomes. Only needs to be called once for the duration of the game
// because these never change.
router.get('/outcomes', rejectUnauthenticated, (req,res) => {
  const queryText = `SELECT * FROM "outcomes";`
  pool.query(queryText)
  .then((response) => {
    res.send(response.rows);
  }).catch((error)=>{
    console.log(error);
    res.sendStatus(500);
  })
});

module.exports = router;