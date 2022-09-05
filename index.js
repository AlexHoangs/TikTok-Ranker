'use strict';
//index.js
// This is our main server file

const database = require("./database");
const express = require("express");
const bodyParser = require("body-parser");
const win = require("./pickWinner");

// create object to interface with express
const app = express();

// BEGIN EXPRESS PIPELINE:

// debug logging
app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
})

// make all the static files in 'public' available 
app.use(express.static("public"));

app.use(bodyParser.json());

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/tiktokvideos.html");
});

app.get("/getTwoVideos", async (req, res) => {
  console.log("getting two videos");
  res.send(await database.getTwoVideos());
});

// serve acknowledgment page
app.get("/acknowledged", (request, response) => {
  response.sendFile(__dirname + "/public/temp.html");
});

app.post("/insertPref", async (req, res) => {
  let data = req.body;
  console.log("data:", data);
  await database.insertPrefTable(data);

  // check for number of elements in prefTable
  let count = await database.countPrefTable();
  if (count >= 15) {
    res.send("pick winner");
  } else {
    res.send("continue");
  }
});

// POST endpoint for video data in the text form
// username:tiktokUrl:videoNickname
app.post("/videoData", async (req, res) => {
  let videoInfo = req.body;
  let username = videoInfo.username;
  let tiktokUrl = videoInfo.tiktokUrl;
  let videoNickname = videoInfo.nickname;

  console.log("/videoData POST Request Received");
  console.log(`\tUsername: ${username}`);
  console.log(`\tTiktok URL: ${tiktokUrl}`);
  console.log(`\tVideo Nickname: ${videoNickname}`);
  console.log();

  if (await database.insertVideo({ url: tiktokUrl, userid: username, nickname: videoNickname })) {
    res.send("Successfuly inserted video.");
    console.log("Video received, inserted into database.");
  } else {
    res.send("Database is full.");
    console.log("Video received but database is full, did not insert.");
  }
});

app.get("/getWinner", async function(req, res) {
  console.log("getting winner");
  // change parameter to "true" to get real winner based on PrefTable 
  // with parameter="false", uses fake prefdata and gets a random result.
  // winner should contain the rowId of the winning video.
  let winner = await win.computeWinner(8, false);
  res.json(await database.getVideoById(winner));
});

app.get("/getMostRecent", async (req, res) => {
  res.send(await database.getMostRecentVideo());
});

app.get("/getList", async (req, res) => {
  res.send(await database.getAllRows());
});

app.post("/deleteVideo", async (req, res) => {
  console.log("Delete for video requested: " + req.body.videoId);
  await database.deleteVideo(req.body.videoId);
  res.send("Video deleted.");
})

// Need to add response if page not found!
app.use((req, res) => {
  res.status(404);
  res.send(`404 - File ${req.url} not found`);
});

// END EXPRESS PIPELINE

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, () => {
  console.log("The static server is listening on port " + listener.address().port);
});
