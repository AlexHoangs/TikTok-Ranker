let script, videoUrl;

let reloadButton = document.getElementById("reload");
let divElmt = document.getElementById("tiktokDiv");
// let reloadButton = document.getElementById("reload");
// // set up button
reloadButton.addEventListener("click",reloadVideo);

// Click listener for reload button
// document.getElementById("reload").addEventListener("click", () => {
//   reloadVideo;
// });

// parses the video id from url
function tiktokVideoIdFromUrl(url) {
  let videoUrl = url.split("video/")[1];
  let qMark = videoUrl.indexOf("?");

  if (qMark === -1)
    return videoUrl;

  return videoUrl.slice(0, qMark);
}

// adds video 
async function addVideo(tiktokurl,divElmt) {
  let videoNumber = tiktokurl.split("video/")[1];

  let block = document.createElement('blockquote');
  block.className = "tiktok-embed";
  block.cite = tiktokurl;
  // have to be formal for attribute with dashes
  block.setAttribute("data-video-id",videoNumber);
  block.style = "width: 325px; height: 563px;"

  let section = document.createElement('section');
  block.appendChild(section);
  divElmt.appendChild(block);
}

// Ye olde JSONP trick; to run the script, attach it to the body
function loadTheVideos() {
  body = document.body;
  script = newTikTokScript();
  body.appendChild(script);
}

// makes a script node which loads the TikTok embed script
function newTikTokScript() {
  let script = document.createElement("script");
  script.src = "https://www.tiktok.com/embed.js"
  script.id = "tiktokScript"
  return script;
}

// Run scripts on page load
window.addEventListener("DOMContentLoaded", async () => {
  let recent = await (await  fetch("./getMostRecent")).json();
  
  console.log(recent);
  document.getElementById("nickname").innerText = recent.nickname;
  example = recent.url;
  
  addVideo(example, divElmt);
  loadTheVideos()
});


// Click listener for continue button
document.getElementById("continueButton").addEventListener("click", () => {
  location = "./myvideos.html";
});

sendGetRequest("/getMostRecent").then(function(response) {
  console.log(response, "get most recent worked for URL");
  example = response.url;
  // add the blockquote element that TikTok wants to load the video into
  addVideo(example, divElmt);
  // on start-up, load the videos
  loadTheVideos();
  }).catch(function (response) {
  console.log("get most recent failed for URL"); 
  addVideo(example, divElmt);
  loadTheVideos();
  });

// the reload button; takes out the blockquote and the scripts, and puts it all back in again.
// the browser thinks it's a new video and reloads it
function reloadVideo () {
  // get the two blockquotes
  let blockquotes = document.getElementsByClassName("tiktok-embed");

  // and remove the indicated one
    block = blockquotes[0];
    console.log("block",block);
    let parent = block.parentNode;
    parent.removeChild(block);

  // remove both the script we put in and the
  // one tiktok adds in
  let script1 = document.getElementById("tiktokScript");
  let script2 = script.nextElementSibling;

  let body = document.body; 
  body.removeChild(script1);
  body.removeChild(script2);

  addVideo(example,divElmt);
  loadTheVideos(); 
}

