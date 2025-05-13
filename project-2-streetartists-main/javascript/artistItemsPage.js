let image;

const cardsWrapper = document.querySelector(".cardsDiv");

const newItemMenuElement = document.querySelector(".newItemMenu");
const menuHeading = document.querySelector(".newItemTitle");
const addNewItemInnerBtn = document.querySelector(".addNewItemBtn");
const saveItemInnerBtn = document.querySelector(".saveItemBtn");

const newItemTitleInput = document.querySelector("#title");
const newItemDescriptionInput = document.querySelector("#desc");
const newItemTypeInput = document.querySelector("#type");
const newItemPriceInput = document.querySelector("#price");
const newItemImageUrlInput = document.querySelector("#url");
const newItemIsPublishedCheckbox = document.querySelector(
  "#isPublishedCheckbox"
);

const auctionImage = document.querySelector(".auctionImage");
const auctionContent = document.querySelector(".auctionContent");
const auctionArtistName = document.querySelector(".auctionArtistName");
const auctionStartingPrice = document.querySelector(".auctionStartingPrice");
const auctionDescription = document.querySelector(".auctionDescription");
const auctionTitle = document.querySelector(".auctionTitle");

const alertRemoveCard = document.querySelector(".alert");
const alertConfirmButton = document.querySelector(".alertYes");
const alertCancelButton = document.querySelector(".alertNo");

function initArtistsItemsPage() {
  hamburgerMenu.classList.remove("d-none");
  auctionIcon.classList.add("d-none");

  currentLoggedArtist = localStorage.getItem("artistName");
  headerName.innerText = currentLoggedArtist;

  // local storage items da zimame info od items
  const items_LS = JSON.parse(localStorage.getItem("items"))
    ? JSON.parse(localStorage.getItem("items"))
    : items;
  updateCards();
  update_LS(items_LS);

  const newItemTypeInput = document.querySelector("#type");
  itemTypes.forEach((type) => {
    newItemTypeInput.innerHTML += `
        <option value="${type}">${type}</option>
    `;
  });

  const newItemMenuElement = document.querySelector(".newItemMenu");
  const addNewItemMenuBtn = document.querySelector(".newItemInner");
  const addNewItemInnerBtn = document.querySelector(".addNewItemBtn");
  const cancelNewItemInnerBtn = document.querySelector(".cancelNewItemBtn");

  addNewItemMenuBtn.addEventListener("click", () => {
    newItemMenuElement.classList.add("newItemMenuActive");
    menuHeading.innerText = "Add new item";
    addNewItemInnerBtn.classList.remove("d-none");
    saveItemInnerBtn.classList.add("d-none");
    canvas.classList.add("d-none");
    document.querySelector(".canvasRemove").classList.remove("d-none");
  });

  cancelNewItemInnerBtn.addEventListener("click", () => {
    newItemMenuElement.classList.remove("newItemMenuActive");

    previewCapture.src = "";
    newItemIsPublishedCheckbox.checked = false;
    newItemTitleInput.value = "";
    newItemDescriptionInput.value = "";
    newItemTypeInput.value = "";
    newItemPriceInput.value = "";
    newItemImageUrlInput.value = "";
  });

  // ova za kamerata i za dijagramot
  const openCamera = document.querySelector(".openCamera");
  const cameraMenu = document.querySelector(".cameraMenu");
  const takePhoto = document.querySelector(".takePhoto");
  const canvas = document.querySelector("#canvas");
  const context = canvas.getContext("2d");
  const video = document.querySelector("#video");
  const previewCapture = document.querySelector("#previewCapture");

  openCamera.addEventListener("click", () => {
    openCameraMenu();
  });

  previewCapture.addEventListener("click", () => {
    openCameraMenu();
  });

  function openCameraMenu() {
    cameraMenu.classList.add("cameraMenuActive");

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: {
            ideal: "environment",
          },
        },
      })
      .then((stream) => {
        video.srcObject = stream;
      });

    video.addEventListener("canplay", function () {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    });
  }

  takePhoto.addEventListener("click", () => {
    cameraMenu.classList.remove("cameraMenuActive");

    // ova da nacrtame diagramot ama ne znam kako da go potpolnam.
    context.drawImage(video, 0, 0);
    image = canvas.toDataURL();
    previewCapture.src = image;

    const activeStream = video.srcObject;
    const tracks = activeStream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });

    document.querySelector(".canvasRemove").classList.add("d-none");
  });

  addNewItemInnerBtn.addEventListener("click", (ev) => {
    ev.preventDefault();
    addNewItem();
  });

  function addNewItem() {
    newItemMenuElement.classList.remove("newItemMenuActive");
    canvas.classList.add("d-none");
    document.querySelector(".canvasRemove").classList.remove("d-none");

    if (
      !newItemTitleInput.value ||
      !newItemDescriptionInput.value ||
      !newItemPriceInput.value ||
      !newItemTypeInput.value
    ) {
      return;
    }

    if (!newItemImageUrlInput.value && !previewCapture.src) {
      alert("Take a photo or add image url.");
      return;
    }

    const newItem = {
      id: "",
      title: newItemTitleInput.value,
      description: newItemDescriptionInput.value,
      type: newItemTypeInput.value,
      image: newItemImageUrlInput.value ? newItemImageUrlInput.value : image,
      price: +newItemPriceInput.value,
      artist: localStorage.getItem("artistName"),
      dateCreated: Date.now(),
      isPublished: newItemIsPublishedCheckbox.checked,
    };

    items_LS.unshift(newItem);
    items_LS.forEach((item, index) => {
      item.id = index;
    });

    update_LS(items_LS);

    previewCapture.src = "";
    newItemIsPublishedCheckbox.checked = false;
    newItemTitleInput.value = "";
    newItemDescriptionInput.value = "";
    newItemTypeInput.value = "";
    newItemPriceInput.value = "";
    newItemImageUrlInput.value = "";

    updateCards();
  }
}

alertConfirmButton.addEventListener("click", () => {
  alertRemoveCard.classList.remove("alert-active");

  const removingItem = items_LS.findIndex((item) => item.isRemoved);
  items_LS.splice(removingItem, 1);

  update_LS(items_LS);
  updateCards();
});

alertCancelButton.addEventListener("click", () => {
  alertRemoveCard.classList.remove("alert-active");
  const toBeRemoved = items_LS.findIndex((item) => item.isRemoved);
  items_LS[toBeRemoved].isRemoved = false;
});

function renderCards(
  id,
  imageInput,
  titleInput,
  dateInput,
  priceInput,
  descInput,
  published,
  auctioning
) {
  const cardsDiv = document.querySelector(".cardsDiv");
  const card = document.createElement("div");

  card.classList.add("cardDiv");
  card.setAttribute("id", id);

  const imageDiv = document.createElement("div");
  const img = document.createElement("img");

  img.setAttribute("src", imageInput);
  img.setAttribute("class", "imageDiv");
  img.setAttribute("width", "100%");

  const contentDiv = document.createElement("div");
  contentDiv.setAttribute("class", "p-3 font-color-dark-brown");

  const contentFlexDiv = document.createElement("div");
  contentFlexDiv.setAttribute(
    "class",
    "d-flex align-items-center justify-content-between"
  );

  const titleDateDiv = document.createElement("div");
  const title = document.createElement("h6");
  title.innerText = titleInput;

  const date = document.createElement("p");
  date.setAttribute("class", "date");
  date.innerText = new Date(dateInput).toLocaleDateString("en-GB");

  const price = document.createElement("p");
  price.innerText = "$" + priceInput;
  price.setAttribute("class", "bg-color-dark price font-color-light");

  const desc = document.createElement("p");
  desc.setAttribute("class", "mt-2");
  desc.innerText = descInput;

  const buttonsDiv = document.createElement("div");
  buttonsDiv.setAttribute(
    "class",
    "buttons d-flex justify-content-between flex-nowrap bg-color-dark p-3"
  );

  const auctionBtn = document.createElement("button");

  auctionBtn.innerText = "Send to Auction";
  auctionBtn.classList.add("auctionBtn");

  if (auctioning) {
    auctionBtn.classList.remove("auctionBtn");
    auctionBtn.innerText = "On Auction";
    auctionBtn.style.backgroundColor = "darkblue";
  } else {
    auctionBtn.innerText = "Send to Auction";
    auctionBtn.classList.add("auctionBtn");
  }

  auctionBtn.addEventListener("click", () => {
    const auctionAlert = document.querySelector(".auctionAlert");
    const auctioningItem = items_LS.filter((item) => item.isAuctioning);
    update_LS(items_LS);
    updateCards();

    if (auctioningItem.length > 0) {
      auctionAlert.classList.add("auctionAlert-active");
      setTimeout(() => {
        auctionAlert.classList.remove("auctionAlert-active");
      }, 3000);
      return;
    } else {
      location.hash = "#auction";

      const auctioningItemIndex = items_LS.findIndex((item) => item.id === id);
      items_LS[auctioningItemIndex].isAuctioning = true;

      auctionBtn.innerText = "On Auction";
      auctionBtn.style.backgroundColor = "darkblue";

      auctionImage.src = items_LS[auctioningItemIndex].image;
      auctionArtistName.innerText = items_LS[auctioningItemIndex].artist;
      auctionStartingPrice.innerText = Math.floor(
        items_LS[auctioningItemIndex].price / 2
      );
      auctionDescription.innerText = items_LS[auctioningItemIndex].description;
      auctionTitle.innerText = items_LS[auctioningItemIndex].title;

      update_LS(items_LS);
      startTimer();
    }
  });

  const unPublishBtn = document.createElement("button");

  if (published) {
    unPublishBtn.innerText = "Unpublish";
    unPublishBtn.classList.add("unPublishBtn");
  } else {
    unPublishBtn.innerText = "Publish";
    unPublishBtn.classList.add("publishBtn");
  }

  unPublishBtn.addEventListener("click", () => {
    const isPublishedItemIndex = items_LS.findIndex((item) => item.id === id);

    if (items_LS[isPublishedItemIndex].isPublished === true) {
      items_LS[isPublishedItemIndex].isPublished = false;
    } else {
      items_LS[isPublishedItemIndex].isPublished = true;
    }

    update_LS(items_LS);
    updateCards();
  });

  const removeBtn = document.createElement("button");
  removeBtn.innerText = "Remove";
  removeBtn.classList.add("removeBtn");

  removeBtn.addEventListener("click", () => {
    alertRemoveCard.classList.add("alert-active");
    const isRemoved = items_LS.findIndex((item) => item.id === id);
    items_LS[isRemoved].isRemoved = true;
    update_LS(items_LS);
  });

  const editBtn = document.createElement("button");
  editBtn.innerText = "Edit";
  editBtn.setAttribute("class", "editBtn bg-color-light");

  editBtn.addEventListener("click", () => {
    const openCameraIcon = document.querySelector(".canvasRemove");
    openCameraIcon.classList.remove("d-none");

    const editingItemIndex = items_LS.findIndex((item) => item.id === id);
    items_LS[editingItemIndex].isEditing = true;

    newItemMenuElement.classList.add("newItemMenuActive");

    if (items_LS[editingItemIndex].isEditing) {
      menuHeading.innerText = "Edit item";
      addNewItemInnerBtn.classList.add("d-none");
      saveItemInnerBtn.classList.remove("d-none");
    }

    newItemTitleInput.value = items_LS[editingItemIndex].title;
    newItemDescriptionInput.value = items_LS[editingItemIndex].description;
    newItemTypeInput.value = items_LS[editingItemIndex].type;
    newItemPriceInput.value = items_LS[editingItemIndex].price;
    newItemImageUrlInput.value = items_LS[editingItemIndex].image;

    if (newItemImageUrlInput.value.includes("data:image/png;base64")) {
      image = newItemImageUrlInput.value;
      previewCapture.src = image;
      canvas.classList.add("d-none");
      openCameraIcon.classList.add("d-none");
      newItemImageUrlInput.value = "";
    }
    update_LS(items_LS);
  });

  cardsDiv.append(card);
  card.append(imageDiv, contentDiv, buttonsDiv);
  imageDiv.append(img);
  contentDiv.append(contentFlexDiv, desc);
  contentFlexDiv.append(titleDateDiv, price);
  titleDateDiv.append(title);
  buttonsDiv.append(auctionBtn, unPublishBtn, removeBtn, editBtn);
}

saveItemInnerBtn.addEventListener("click", (ev) => {
  ev.preventDefault();
  newItemMenuElement.classList.remove("newItemMenuActive");
  const previewCapture = document.querySelector("#previewCapture");
  canvas.classList.add("d-none");
  document.querySelector(".canvasRemove").classList.remove("d-none");

  const isEditing = items_LS.findIndex((item) => item.isEditing);

  items_LS[isEditing] = {
    id: items_LS[isEditing].id,
    title: newItemTitleInput.value,
    description: newItemDescriptionInput.value,
    type: newItemTypeInput.value,
    image: newItemImageUrlInput.value ? newItemImageUrlInput.value : image,
    price: +newItemPriceInput.value,
    artist: localStorage.getItem("artistName"),
    dateCreated: Date.now(),
    isPublished: newItemIsPublishedCheckbox.checked,
    isEditing: false,
  };

  update_LS(items_LS);
  updateCards();
});

function updateCards() {
  currentLoggedArtist = localStorage.getItem("artistName");
  const items_LS = JSON.parse(localStorage.getItem("items"))
    ? JSON.parse(localStorage.getItem("items"))
    : items;

  cardsWrapper.innerHTML = "";

  const artistCards = items_LS.filter(
    (item) => item.artist === currentLoggedArtist
  );
  artistCards.forEach((card) => {
    renderCards(
      card.id,
      card.image,
      card.title,
      card.dateCreated,
      card.price,
      card.description,
      card.isPublished,
      card.isAuctioning
    );
  });
}
