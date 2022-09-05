function getVideoElements() {
  return document.getElementsByClassName("tiktokDiv");
}


document.addEventListener("DOMContentLoaded", () => {
  let videos = [];

  let reloadButtons = document.getElementsByClassName("reload");
  let heartButtons = document.querySelectorAll("div.heart");
  for (let i = 0; i < 2; i++) {
    let reload = reloadButtons[i];
    reload.addEventListener("click", function() { reloadVideo(getVideoElements()[i]) });
    heartButtons[i].classList.add("unloved");
    heartButtons[i + 2].classList.add("unloved");
  }

  document.getElementById("emptyHeart1").addEventListener("click", () => {
    let emptyHeart1 = document.getElementById("emptyHeart1");
    let filledHeart1 = document.getElementById("filledHeart1");
    emptyHeart1.style.display = "none";
    filledHeart1.style.display = "inline";

    let emptyHeart2 = document.getElementById("emptyHeart2");
    let filledHeart2 = document.getElementById("filledHeart2");
    if (filledHeart2.style.display == "inline") {
      filledHeart2.style.display = "none";
      emptyHeart2.style.display = "inline";
    }
  });

  document.getElementById("emptyHeart2").addEventListener("click", () => {
    let emptyHeart2 = document.getElementById("emptyHeart2");
    let filledHeart2 = document.getElementById("filledHeart2");
    emptyHeart2.style.display = "none";
    filledHeart2.style.display = "inline";

    let emptyHeart1 = document.getElementById("emptyHeart1");
    let filledHeart1 = document.getElementById("filledHeart1");
    if (filledHeart1.style.display == "inline") {
      filledHeart1.style.display = "none";
      emptyHeart1.style.display = "inline";
    }
  });

  document.getElementById("nextButton").addEventListener("click", async () => {
    if (filledHeart1.style.display == "inline") {
      var liked = videos[0].rowIdNum;
      var notLiked = videos[1].rowIdNum;
    } else {
      liked = videos[1].rowIdNum;
      notLiked = videos[0].rowIdNum;
    }

    let data = { "better": liked, "worse": notLiked };

    sendPostRequest("/insertPref", data)
      .then(function(response) {
        console.log("reponse: ", response);
        if (response === "continue") {
          window.location = "/compare.html";
        } else if (response === "pick winner") {
          window.location = "/winner.html";
        }
      }).catch(function(err) {
        console.log("error, no reponse", err);
      })
  });
  sendGetRequest("/getTwoVideos")

    .then(function(response) {
      console.log(response, "get two videos");
      videos = [response[0], response[1]];

      for (let i = 0; i < 2; i++) {
        addVideo(videos[i].url, getVideoElements()[i]);
      }
      document.getElementById("nicknameLeft").innerText = videos[0].nickname;
      document.getElementById("nicknameRight").innerText = videos[1].nickname;
      // load the videos after the names are pasted in! 
      loadTheVideos();
    }).catch(function(response) {
      console.log("get two videos failed");
    })
});
