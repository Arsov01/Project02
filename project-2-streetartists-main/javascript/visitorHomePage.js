function initVisitorHomePage() {
  auctionIcon.classList.remove("d-none");
  hamburgerMenu.classList.add("d-none");
}

findArtBtn = document.querySelector(".find-art-btn");
findArtBtn.addEventListener("click", () => {
  location.hash = "#visitorListingPage";
});
