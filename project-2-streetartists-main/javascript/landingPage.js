const landingPage = document.querySelector("#landingPage");
const asArtistBtn = document.querySelector("#asArtist");
const asVisitorBtn = document.querySelector("#asVisitor");
const chooseArtistSelect = document.querySelector("#artistsSelect");

function initLandingPage() {
  chooseArtistSelect.addEventListener("change", handleAsArtist);
  asVisitorBtn.addEventListener("click", handleAsVisitor);
}

function handleAsArtist() {
  location.hash = "#artistsPage";
  const loggedArtist = chooseArtistSelect.value;
  localStorage.setItem("artistName", loggedArtist);
  currentLoggedArtist = localStorage.getItem("artistName");
}

function handleAsVisitor() {
  location.hash = "#visitorHomePage";
}

fetch("https://jsonplaceholder.typicode.com/users")
  .then((res) => res.json())
  .then((data) => {
    data.forEach((user) => {
      chooseArtistSelect.innerHTML += `
        <option value="${user.name}">${user.name}</option>
    `;
    });
  });
