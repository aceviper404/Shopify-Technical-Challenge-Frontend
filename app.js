const navigationLike = document.getElementById("navigation-like");
const navigationFavorite = document.getElementById("navigation-favorite");
const imageContainer = document.querySelector(".image-container");
const saved = document.querySelector(".saved");
const loader = document.querySelector(".loader");

//NASA API
const c = 10;
const apiKey = "H2FTiTpaAzD3hrbDYsLintJo0xnf6VpoaK887xOo";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${c}`;

let InfoRes = [];
let fav = {};

function createHere(page) {
  const arrTemp =
    page === "results" ? InfoRes : Object.values(fav);
  arrTemp.forEach((val) => {
    //card
    const card = document.createElement("div");
    card.classList.add("card");
    //link
    const link = document.createElement("a");
    link.href = val.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";
    //image
    const image = document.createElement("img");
    image.src = val.url;
    image.alt = "NASA Picture of day";
    image.loading = "lazy";
    image.classList.add("card-img-top");
    //card container
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");
    //card title
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = val.title;
    //text
    const text = document.createElement("p");
    text.classList.add("likebutton");
    text.setAttribute("id", val.url);
    if (page === "results") {
      text.textContent = "💙";
      text.setAttribute("onclick", `saveFavorate('${val.url}')`);
    } else {
      text.textContent = "Remove from Liked";
      text.setAttribute("onclick", `removeFavorate('${val.url}')`);
    }
    //card text
    const cardText = document.createElement("p");
    cardText.textContent = val.explanation;
    //footer container
    const footer = document.createElement("small");
    footer.classList.add("text-muted");
    //date
    const date = document.createElement("strong");
    date.textContent = val.date;
    //copyright
    const copyrightResult =
    val.copyright === undefined ? "" : val.copyright;
    const copyright = document.createElement("span");
    copyright.textContent = `  ${copyrightResult}`;
    //append
    footer.append(date, copyright);
    cardContainer.append(cardTitle, text, cardText, footer);
    link.appendChild(image);
    card.append(link, cardContainer);
    imageContainer.appendChild(card);
  });
}

function changeHere(page) {
  //get fav from localstorage
  if (localStorage.getItem("nasaFavorates")) {
    fav = JSON.parse(localStorage.getItem("nasaFavorates"));
  }
  imageContainer.textContent = "";
  createHere(page);
  showDetails(page);
}

function showDetails(page) {
  window.scrollTo({
    top: 0,
    behavior: "instant",
  });
  if (page === "results") {
    navigationLike.classList.remove("hidden");
    navigationFavorite.classList.add("hidden");
  } else {
    navigationLike.classList.add("hidden");
    navigationFavorite.classList.remove("hidden");
  }
  loader.classList.add("hidden");
}

//add result to fav
function saveFavorate(itemUrl) {
  //loop

  InfoRes.forEach((item) => {
    let liked = document.getElementById(itemUrl);
    setTimeout(() => {
      if (liked.innerText == "❤️") {
        liked.textContent = "💙";
        removeFavorate(itemUrl, false);
      }
    }, 1000);

    if (item.url.includes(itemUrl) && !fav[itemUrl]) {
      fav[itemUrl] = item;
      console.log(fav);

      console.log("called");
      //show save confirmation for 2 seconds
      let like = document.getElementById(itemUrl);
      saved.hidden = false;
      setTimeout(() => {
        saved.hidden = true;
        console.log(like.innerText);

        like.textContent = "❤️";
      }, 2000);
      //set favorate in localStorage
      localStorage.setItem("nasaFavorates", JSON.stringify(fav));
    }
  });
}

//remove result from fav
function removeFavorate(itemUrl, update = true) {
  console.log(itemUrl, update);
  if (fav[itemUrl]) {
    delete fav[itemUrl];
    //set favorate in localStorage
    localStorage.setItem("nasaFavorates", JSON.stringify(fav));
    console.log(update);
    if (update) {
      changeHere("fav");
    }
  }
}

//get 10 images from api
async function getNasaPictures() {
  //show loader
  loader.classList.remove("hidden");
  try {
    const response = await fetch(apiUrl);
    InfoRes = await response.json();
    console.log(InfoRes);
    changeHere("results");
  } catch (error) {
    //catche error here
    console.log(error);
  }
}

//onload
getNasaPictures();
