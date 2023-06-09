const newsContainer = document.querySelector("#newsContainer");
const loadSavedButton = document.querySelector("#loadSavedButton");
const loadNewsButton = document.querySelector("#loadNewsButton");
const categorySelect = document.querySelector("#categorySelect");

function loadNews() {
  document.querySelector("#hidden").style.display = "block";
}

const savedNews = [];

// Display Sved News 
const displaySavedNews = () => {
  newsContainer.innerHTML = "";
  if (!savedNews) {
    return;
  }
  savedNews.forEach((newsItem, index) => {
    const div = createNewsItemElement(
      newsItem.title,
      newsItem.description,
      newsItem.articleUrl
    );
    const deleteButton = createDeleteButton(index);
    div.appendChild(deleteButton);
    newsContainer.appendChild(div);
  });
};

const createNewsItemElement = (title, description, imageUrl, articleUrl) => {
  const div = document.createElement("div");
  div.classList.add("newsItem");
  div.innerHTML = `
    <h2>${title}</h2>
    <img src="${imageUrl}" alt="${title}">
    <p>${description}</p>
    <a href="${articleUrl}" target="_blank">Read more</a>
  `;
  const readMoreLink = div.querySelector("a");
  readMoreLink.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = articleUrl;
  });
  return div;
};


// Delete button in saved news section
const createDeleteButton = (index) => {
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Delete";
  deleteButton.className = "delete-button"
  deleteButton.onclick = function () {
    deleteSavedNews(index);
  };
  return deleteButton;
};

const deleteSavedNews = (index) => {
  savedNews.splice(index, 1);
  displaySavedNews();
};


// get news from API
const getNews = (category = "all") => {
 const apiKey = '818c4c1d1bd34d11a54b8d27eba1b044'
  newsContainer.innerHTML = "";

  let url = `http://newsapi.org/v2/everything?q=${category}&apiKey=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log("Data", data);
      data.articles.forEach((newsItem) => {
        const div = createNewsItemElement(
          newsItem.title,
          newsItem.description,
          newsItem.urlToImage,
          newsItem.url
        );
        const saveButton = createSaveButton(newsItem);

        div.appendChild(saveButton);
        newsContainer.appendChild(div);
      });
    });
};

// save button in each news artices which display pop up when clicked
const createSaveButton = (newsItem) => {
  const saveButton = document.createElement("button");
  saveButton.innerHTML = "Save";
  saveButton.className = "save-button"
  saveButton.onclick = function (event) {
    event.stopPropagation();
    handleSavedNews(newsItem);
    showPopup("News saved");
  };
  return saveButton;
};

const handleSavedNews = (savedItem) => {
  savedNews.push(savedItem);
  console.log(savedNews);
};

const showPopup = (message) => {
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");
  popupMessage.textContent = message;
  popup.style.display = "flex";
  setTimeout(() => {
    popup.style.display = "none";
  }, 2000);
};


const loadSavedNews = () => {
  displaySavedNews();
};

loadSavedButton.addEventListener("click", () => {
  loadSavedNews();
});
loadNewsButton.addEventListener("click", () => {
  getNews(categorySelect.value);
});

getNews();
