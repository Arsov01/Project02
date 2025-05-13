const biddingsUl = document.querySelector("#biddings");
const biddingsUlOther = document.querySelector("#otherBiddings");
const yourBid = document.querySelector(".yourBids");
const otherBid = document.querySelector(".otherBids");
let yourBids = [];
let otherBids = [];

function initAuctionPage() {
  headerName.innerText = "Auction";

  auctionIcon.classList.add("d-none");
  hamburgerMenu.classList.add("d-none");

  yourBid.innerHTML += ``;

  const noAuctionElement = document.querySelector(".noAuctionInProgress");
  const auctionInnerElement = document.querySelector(".auctionInner");

  noAuctionElement.classList.add("d-none");
  auctionInnerElement.classList.remove("d-none");

  const activeAuction = items_LS.filter((item) => item.isAuctioning);
  if (activeAuction.length === 0) {
    noAuctionElement.classList.remove("d-none");
    auctionInnerElement.classList.add("d-none");
  } else {
    startTimer();
  }

  const input = document.querySelector(".bidAmount");
  const bidBtn = document.querySelector(".bidBtn");
  const backBtn = document.querySelector(".back");

  const auctioningItemIndex = items_LS.findIndex((item) => item.isAuctioning);

  if (auctioningItemIndex !== -1) {
    items_LS[auctioningItemIndex].isAuctioning = true;
    auctionImage.src = items_LS[auctioningItemIndex].image;
    auctionArtistName.innerText = items_LS[auctioningItemIndex].artist;
    auctionStartingPrice.innerText = Math.floor(
      items_LS[auctioningItemIndex].price / 2
    );
    auctionDescription.innerText = items_LS[auctioningItemIndex].description;
  }

  input.value = auctionStartingPrice.innerText;

  backBtn.addEventListener("click", () => {
    if (localStorage.getItem("artistName")) {
      location.hash = "#artistsItemsPage";
    } else {
      location.hash = "#visitorListingPage";
      auctionIcon.classList.remove("d-none");

      headerName.innerText = "StreetARTists";
    }
  });

  if (localStorage.getItem("artistName")) {
    bidBtn.disabled = true;
    bidBtn.innerText = "Disabled for artists";
    return;
  } else {
    bidBtn.disabled = false;
    bidBtn.innerText = "Place your bid";
  }

  bidBtn.removeEventListener("click", bid);
  bidBtn.addEventListener("click", bid);

  function bid() {
    const bidAmount = input.value;
    input.value = +bidAmount + 30;
    yourBid.innerHTML += `<li class="bid"><i class="fas fa-user p-2 m-2"></i>$${+bidAmount}</li>`;
    otherBid.innerHTML += `<li class="otherBid">$${
      +bidAmount + 30
    }<i class="fas fa-user p-2"></i></li>`;
    yourBids.push(+bidAmount);
    otherBids.push(+bidAmount + 30);

    fetch("https://example.com/api/bid", {
      method: "GET",

      body: JSON.stringify({
        amount: bidAmount,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!data.isBidding) {
          countDownEl.innerHTML = `You won!!!`;
        } else {
          otherBid.innerHTML += `<li class="otherBid">${data.bidAmount}<i class="fas fa-user p-2 m-2"></i></li>`;
          otherBids.push(+data.bidAmount);
          input.value = +data.bidAmount + 30;
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        alert(`Fetch error: ${error.message}`);
      });
    if (isNaN(bidAmount) || bidAmount <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }
  }
}

function startTimer() {
  // da ni go racuna vremeto vo sekundi za aukcijata
  const auctioningItemIndex = items_LS.findIndex((item) => item.isAuctioning);
  let time;

  if (+localStorage.getItem("time") > 0) {
    time = +localStorage.getItem("time");
  } else {
    time = 120;
    localStorage.setItem("time", time);
    time = +localStorage.getItem("time");
  }
  // se prikace vremeto vo local storage
  const timerInterval = setInterval(() => {
    time -= 1;
    localStorage.setItem("time", time);

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const timeElement = document.getElementById("time");
    timeElement.innerText = `${minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
    timeElement.innerText = `${minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;

    //ka ce stigne 0 time da zavrse aukcijata
    if (time === 0) {
      clearInterval(timerInterval);

      items_LS[auctioningItemIndex].dateSold = new Date().toJSON();
      if (+yourBids[+yourBids.length - 1] > +otherBids[otherBids.length - 1]) {
        items_LS[auctioningItemIndex].priceSold =
          +yourBids[yourBids.length - 1];
        timeElement.innerText = `You WON! Item sold for $${+yourBids[
          yourBids.length - 1
        ]}`;
      } else {
        items_LS[auctioningItemIndex].priceSold =
          +otherBids[otherBids.length - 1];
        timeElement.innerText = `You lost! Item sold for $${+otherBids[
          otherBids.length - 1
        ]}`;
      }

      items_LS[auctioningItemIndex].isAuctioning = false;

      update_LS(items_LS);
      updateCards();
    }
  }, 1000);
}
