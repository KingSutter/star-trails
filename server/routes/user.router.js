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
  const queryText = `SELECT "id","username","save_id","admin" FROM "accounts";`
  pool.query(queryText)
  .then((response) => {
      res.send(response.rows);
  }).catch((error)=>{
      res.sendStatus(500);
  })
})

// gets all scenarios for editing purposes if admin desires
router.get('/scenarios', rejectUnauthenticated, (req,res) => {
  const queryText = `SELECT * FROM "scenarios" ORDER BY "id" ASC;`
  pool.query(queryText)
  .then((response) => {
      res.send(response.rows);
  }).catch((error)=>{
      res.sendStatus(500);
  })
})

// gets all scenario outcomes and sorts by id
router.get('/outcomes', rejectUnauthenticated, (req,res) => {
  const queryText = `SELECT * FROM "outcome_type" ORDER BY "id" ASC;`
  pool.query(queryText)
  .then((response) => {
      res.send(response.rows);
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

module.exports = router;