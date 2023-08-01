const express = require("express");
const bots = require("./src/botsData");
const shuffle = require("./src/shuffle");
const path = require('path');


const playerRecord = {
  wins: 0,
  losses: 0,
};
const app = express();

//serve static files from the "public" folder
app.use(express.static("public"));

app.use(express.json());

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '01390209ad8049e5ae5623401c1dd2c1',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')



app.get('/api/robots', (req,res) =>{
    rollbar.info('user entered robots page')
    res.status(200).send(bots)
});

app.post('/api/robots', (req, res) => {
  rollbar.info('user chose robots')
  res.status(200).send(bots)
})

app.delete('/api/robots/:index', (req, res) => {
   const targetIndex = +req.params.index
   try {bots.splice(targetIndex, 1)}
   catch (error){
     rollbar.error(`The bot at ${targetIndex} was deleted, ${error}`)
   }
   res.status(200).send(bots)
})


 
// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
  robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
  robots
    .map(({ attacks }) =>
      attacks.reduce((total, { damage }) => total + damage, 0)
    )
    .reduce((total, damage) => total + damage, 0);

// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
  const compAttack = calculateTotalAttack(compDuo);
  const playerHealth = calculateTotalHealth(playerDuo);
  const playerAttack = calculateTotalAttack(playerDuo);
  const compHealth = calculateTotalHealth(compDuo);

  return {
    compHealth: compHealth - playerAttack,
    playerHealth: playerHealth - compAttack,
  };
};

app.get("/api/robots", (req, res) => {
  try {
    res.status(200).send(bots);
  } catch (error) {
    console.error("ERROR GETTING BOTS", error);
    res.sendStatus(400);
  }
});

app.get("/api/robots/shuffled", (req, res) => {
  try {
    let shuffled = shuffle(bots);
    rollbar.log("shuffle");
    res.status(200).send(shuffled);
  } catch (error) {
    console.error("ERROR GETTING SHUFFLED BOTS", error);
    res.sendStatus(400);
  }
});

app.post("/api/duel", (req, res) => {
  try {
    const { compDuo, playerDuo } = req.body;

    const { compHealth, playerHealth } = calculateHealthAfterAttack({
      compDuo,
      playerDuo,
    });

    // comparing the total health to determine a winner
    if (compHealth > playerHealth) {
      playerRecord.losses += 1;
      res.status(200).send("You lost!");
    } else {
      playerRecord.wins += 1;
      res.status(200).send("You won!");
    }
  } catch (error) {
    console.log("ERROR DUELING", error);
    res.sendStatus(400);

  }
});

app.get("/api/player", (req, res) => {
  try {
    res.status(200).send(playerRecord);
  } catch (error) {
    console.log("ERROR GETTING PLAYER STATS", error);
    res.sendStatus(400);
  }
});



app.listen(8000, () => {
  console.log(`Listening on 8000`);
})
