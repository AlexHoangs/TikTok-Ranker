document.getElementById("addButton").addEventListener("click", async () => {

  // redirect to my videos page
  location = "./tiktokvideos.html";
});

document.addEventListener("DOMContentLoaded", async () => {
  let videos = await (await fetch("./getList")).json();
  let spaces = document.getElementById("videos").querySelectorAll("input");

  for (let i = 0; i < spaces.length && i < videos.length; i++) {
    spaces[i].value = videos[i].nickname;
    spaces[i].style.border = "solid";
    spaces[i].style.borderColor = "lightgrey";
    spaces[i].style.borderWidth = "2px";
    spaces[i].style.fontFamily = "Inter";
   if (videos.length == 8) {
     document.getElementById("addButton").style.visibility = "hidden";
   } spaces[i].nextElementSibling.addEventListener("click", async () => {
      let input = spaces[i];
      await fetch("./deleteVideo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ videoId: videos[i].rowIdNum })
      });
      input.value = "";
      input.style.border = "dashed";
      input.style.borderColor = "lightgrey";
      input.style.borderWidth = "2px";
document.getElementById("addButton").style.visibility = "visible";
    });
  }
});

// Click listener for play game button
document.getElementById("playButton").addEventListener("click", async () => {

  // redirect to my videos page
  location = "./compare.html";
});