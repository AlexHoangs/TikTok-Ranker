// when this page is opened, get the most recently added video and show it.
// function is defined in video.js
let divElmt = document.getElementById("tiktokDiv");
let winningUrl;

let reloadButton = document.getElementById("reload");
// set up button to reload video in "tiktokDiv"
reloadButton.addEventListener("click",function () {
  reloadVideo(tiktokDiv);
});

document.addEventListener("DOMContentLoaded", async () => {
  let winner = await sendGetRequest("/getWinner");
  document.getElementById("nickname").innerText = winner.nickname;
  showWinningVideo(winner.url);
});

function showWinningVideo(winnerUrl) {
  addVideo(winnerUrl, divElmt);
  loadTheVideos();
}
