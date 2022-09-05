'use strict';  // always start with this 

// Endpoint for video data
const VIDEO_DATA_ENDPOINT = "/videoData";

// POST a request with body = data to url.
async function sendPostRequest(url, data) {
  let response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data
  });

  if (response.ok) {
    return await response.text();
  } else {
    throw Error(response.status);
  }
}

// Click listener for continue button
document.getElementById("continueButton").addEventListener("click", async () => {
  // Grab all text field values
  let username = document.getElementById("UName").value;
  let tiktokUrl = document.getElementById("URL").value;
  let nickname = document.getElementById("VNName").value;

  // Send a POST to videoData endpoint with a
  // text body in the form username:tiktokUrl:nickname
  await sendPostRequest(VIDEO_DATA_ENDPOINT, JSON.stringify({ username, tiktokUrl, nickname }));

  // await sendPostRequest(VIDEO_DATA_ENDPOINT, `${username}:${tiktokUrl}:${nickname}`);

  // save nickname to session storage under key "nickname"
  sessionStorage.setItem("nickname", nickname);

  // redirect to finished page
  location = "./videopreview.html";
});

// Click listener for myVideos button
document.getElementById("videoButton").addEventListener("click", async () => {

  // redirect to my videos page
  location = "./myvideos.html";
});