"use strict"

const fetch = require("cross-fetch");
const db = require('./sqlWrap');

// Insert into database. Will not insert if
// more than 8 rows already present.
// Return: If insert succeeded or not
async function insertVideo(video) {
  if (await getRowCount() >= 8)
    return false;

  const sqlUpdate = "UPDATE VideoTable SET Flag = FALSE WHERE Flag = TRUE";
  await db.run(sqlUpdate);

  const sql = "INSERT INTO VideoTable (url,nickname,userid,flag) VALUES (?,?,?,TRUE)";
  await db.run(sql, [video.url, video.nickname, video.userid]);

  return true;
}

// Get count of rows in the VideoTable
// Return: row count
async function getRowCount() {
  const sql = "SELECT COUNT(*) FROM VideoTable";
  return (await db.get(sql))["COUNT(*)"];
}
async function countPrefTable() {
  const sql = "SELECT COUNT(*) FROM PrefTable"; return (await db.get(sql))["COUNT(*)"];
}
// Get a video from the VideoTable, given a nickname.
// nickname: the nickname of the video to query for
// Return: the video
async function getVideo(nickname) {
  const sql = "SELECT * FROM VideoTable WHERE nickname = ?";
  return await db.get(sql, [nickname]);
}

// Get all rows from the database
// Return: all rows from the VideoTable
async function getAllRows() {
  const sql = "SELECT * FROM VideoTable";
  let result = await db.all(sql);
  return result;
}

async function getMostRecentVideo() {
  const sql = "SELECT * FROM VideoTable WHERE Flag = TRUE";
  return await db.get(sql);
}

async function deleteVideo(id) {
  const sql = "DELETE FROM VideoTable WHERE rowIdNum = ?";
  return await db.run(sql, [id]);
}


async function getTwoVideos() {
  const sql = "SELECT * FROM VideoTable ORDER BY RANDOM() LIMIT 2";
  let videos = await db.all(sql);
  return videos;
} async function insertPrefTable(data) {
  const sql = "INSERT INTO PrefTable(better, worse) values (?, ?)";
  await db.run(sql, [data.better, data.worse]);
}
async function getVideoById(id) {
  return await db.get("SELECT * FROM VideoTable WHERE rowIdNum = ? LIMIT 1;", [id]);
}

module.exports = {
  insertVideo,
  getRowCount,
  getVideo,
  getAllRows,
  getMostRecentVideo,
  deleteVideo, countPrefTable,
  getTwoVideos, insertPrefTable,
  getVideoById
}