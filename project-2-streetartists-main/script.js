const headerLogoDiv = document.querySelector(".logo-artist-header");
const landingPageHeading = document.querySelector(".landing-page-heading");
const headerName = document.querySelector(".headerName");
const auctionIcon = document.querySelector(".auctionIcon");
const headerLogo = document.querySelector("#headerLogo");
const backBtn = document.querySelector(".back");

const items_LS = JSON.parse(localStorage.getItem("items"))
  ? JSON.parse(localStorage.getItem("items"))
  : items;

let currentLoggedArtist;

headerLogo.addEventListener("click", () => {
  location.hash = "";
  localStorage.removeItem("artistName");
  chooseArtistSelect.value = "Choose";
  headerName.innerText = "Street ARTists";
  const newItemForm = document.querySelector(".newItemMenu");
  newItemForm.classList.remove("newItemMenuActive");
  hamburgerMenuDiv.classList.remove("hamburger-active");
});

auctionIcon.addEventListener("click", () => {
  location.hash = "#auction";
});

const hamburgerMenu = document.querySelector(".hamburgerMenu");
const hamburgerMenuDiv = document.querySelector(".hamburgerMenuDiv");

hamburgerMenu.addEventListener("click", () => {
  hamburgerMenuDiv.classList.toggle("hamburger-active");
});

const artistsPageLink = document.querySelector(".artistsPageLink");
const artistsItemsLink = document.querySelector(".artistsItemsLink");
const auctionPageLink = document.querySelector(".auctionPageLink");

const menuLinks = [artistsItemsLink, artistsPageLink, auctionPageLink];

menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    hamburgerMenuDiv.classList.remove("hamburger-active");
  });
});

function handleRouting() {
  let hash = location.hash;
  if (!hash) {
    hash = "#landingPage";
  }

  // za da bidat hidden site strani
  const allPages = document.querySelectorAll(".page");
  allPages.forEach((page) => {
    page.style.display = "none";
  });

  // da ni ja dade stranata sto sme.
  const currentPage = document.querySelector(hash);
  currentPage.style.display = "block";

  if (hash === "#landingPage" || hash === "") {
    initLandingPage();
    landingPageHeading.classList.remove("d-none");
    headerLogoDiv.classList.add("d-none");
  } else {
    landingPageHeading.classList.add("d-none");
    headerLogoDiv.classList.remove("d-none");
  }

  if (hash === "#visitorHomePage") {
    initVisitorHomePage();
  } else if (hash === "#visitorListingPage") {
    initVisitorListingPage();
  } else if (hash === "#artistsPage") {
    initArtistsPage();
  } else if (hash === "#artistsItemsPage") {
    initArtistsItemsPage();
  }

  if (hash === "#auction") {
    initAuctionPage();
    backBtn.classList.remove("d-none");
  } else {
    backBtn.classList.add("d-none");
  }
}
window.addEventListener("hashchange", handleRouting);
window.addEventListener("load", handleRouting);

function update_LS(array) {
  localStorage.setItem("items", JSON.stringify(array));
}
