function initArtistsPage() {
  hamburgerMenu.classList.remove("d-none");
  auctionIcon.classList.add("d-none");

  const items_LS = JSON.parse(localStorage.getItem("items"))
    ? JSON.parse(localStorage.getItem("items"))
    : items;

  currentLoggedArtist = localStorage.getItem("artistName");
  headerName.innerText = currentLoggedArtist;

  const soldItemsParagraph = document.querySelector(".soldItemsParagraph");
  const totalItemsParagraph = document.querySelector(".totalItemsParagraph");
  const totalIncomeParagraph = document.querySelector(".totalIncomeParagraph");

  let soldItems = 0;
  let totalIncome = 0;

  const artistArt = items_LS.filter(
    (item) => item.artist === currentLoggedArtist
  );
  artistArt.forEach((artist) => {
    if (artist.priceSold) {
      soldItems++;
      totalIncome += artist.priceSold;
    }
  });

  soldItemsParagraph.innerText = soldItems;
  totalItemsParagraph.innerText = artistArt.length;
  totalIncomeParagraph.innerText = totalIncome;

  const itemsSoldByArtist = items_LS.filter(
    (item) => item.artist === currentLoggedArtist && !!item.priceSold
  );

  const liveAuctioningItem = document.querySelector(".liveAuctioningItem");
  const auctioningItemIndex = items_LS.findIndex((item) => item.isAuctioning);

  if (
    auctioningItemIndex !== -1 &&
    items_LS[auctioningItemIndex].artist === localStorage.getItem("artistName")
  ) {
    if (!+yourBids[+yourBids.length - 1] && +other[+otherBids.length - 1]) {
      liveAuctioningItem.innerHTML = `Currently unavailable`;
    } else {
      if (+yourBids[+yourBids.length - 1] > +otherBids[otherBids.length - 1]) {
        liveAuctioningItem.innerHTML = `$${+yourBids[+yourBids.length - 1]}`;
      } else {
        liveAuctioningItem.innerHTML = `$${+otherBids[+otherBids.length - 1]}`;
      }
    }
  } else {
    liveAuctioningItem.innerHTML = `Currently unavailable`;
  }

  const canvasDiv = document.querySelector(".canvas");

  canvasDiv.innerHTML = "";
  canvasDiv.innerHTML = '<canvas id="myChart" height="260"></canvas>';

  const ctx = document.getElementById("myChart");

  const data = {
    labels: [],
    datasets: [
      {
        label: "Amount",
        data: [],
        backgroundColor: "#a16a5e",
        hoverBackgroundColor: "#d54c2e",
      },
    ],
  };

  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  const last7 = document.querySelector("#last7");
  last7.addEventListener("click", function () {
    renderChartData(7);
    last7.style.backgroundColor = "#d54c2e";
    last14.style.backgroundColor = "#a16a5e";
    last30.style.backgroundColor = "#a16a5e";
  });
  const last14 = document.querySelector("#last14");
  last14.addEventListener("click", function () {
    renderChartData(14);
    last7.style.backgroundColor = "#a16a5e";
    last14.style.backgroundColor = "#d54c2e";
    last30.style.backgroundColor = "#a16a5e";
  });
  const last30 = document.querySelector("#last30");
  last30.addEventListener("click", function () {
    renderChartData(30);
    last7.style.backgroundColor = "#a16a5e";
    last14.style.backgroundColor = "#a16a5e";
    last30.style.backgroundColor = "#d54c2e";
  });

  function renderChartData(days) {
    let labels = generateDates(days);

    const newData = labels.map((label) => {
      let sum = 0;
      itemsSoldByArtist.forEach((item) => {
        if (formatDate(item.dateSold) === label) {
          sum += item.priceSold;
        }
      });
      return sum;
    });

    labels = labels.map((label) => label.slice(0, 2));
    myChart.data.labels = labels;

    myChart.data.datasets[0].data = newData;
    myChart.update();
  }

  last7.click();
}

function generateDates(daysAgo) {
  const arr = [];

  for (let i = 0; i < daysAgo; i++) {
    const start = new Date();
    const startDate = start.getDate();
    const currentDate = start.setDate(startDate - i);
    const formatted = formatDate(currentDate);

    arr.push(formatted);
  }
  return arr;
}

function formatDate(dateNumber) {
  return new Date(dateNumber).toLocaleDateString("en-GB");
}
