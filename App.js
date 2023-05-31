const newsContainer = document.querySelector("#newsContainer");
const saveButton = document.querySelector("#saveButton");
const loadSavedButton = document.querySelector("#loadSavedButton");
const loadNewsButton = document.querySelector("#loadNewsButton");
const categorySelect = document.querySelector("#categorySelect");

function loadNews() {
  document.querySelector('#hidden').style.display = "block";
}

const savedNews = [];

const handleSavedNews = (savedItem) => {
  savedNews.push(savedItem);
  console.log(savedNews);
  alert("News Saved");
}

const displaySavedNews = () => {
  newsContainer.innerHTML = "";
  if (!savedNews) {
    return;
  }
  savedNews.forEach((newsItem, index) => {
    const div = document.createElement("div");
    div.classList.add("newsItem");
    div.innerHTML = `
      <h2>${newsItem.title}</h2>
      <p>${newsItem.content}</p>
    `;
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function () {
      deleteSavedNews(index);
    };
    div.appendChild(deleteButton);
    newsContainer.appendChild(div);
  });
};

const deleteSavedNews = (index) => {
  savedNews.splice(index, 1);
  displaySavedNews();
}

const getNews = (category = "All") => {
  newsContainer.innerHTML = "";
  fetch(`https://inshorts.deta.dev/news?category=${category}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Data", data)
      data.data.forEach((newsItem) => {
        const div = document.createElement("div");
        div.classList.add("newsItem");
        div.innerHTML = `
          <p>By <strong>${newsItem.author}</strong></p>
          <h2>${newsItem.title}</h2>
          <img src="${newsItem.imageUrl}" alt="${newsItem.title}">
          <p>${newsItem.content} <a href="${newsItem.readMoreUrl}">Read more</a></p>
          <div class="like-section" style="display: flex; align-items: center;">
            <button class="like-button" style="font-size: 2.5em; background-color: transparent; border: none; cursor: pointer;" data-likes="0">&#9825;</button>
            <span class="like-count" style="margin-left: 10px; font-weight: bold;">0</span>
          </div>
          <br>
        `;
        const button = document.createElement("button");
        button.innerHTML = "Save"
        button.onclick = function (event) {
          event.stopPropagation(); // Prevent event bubbling to parent elements
          handleSavedNews(newsItem)
        }
        div.appendChild(button);
        newsContainer.appendChild(div);

        // Get the like button and like count elements
        const likeButton = div.querySelector('.like-button');
        const likeCount = div.querySelector('.like-count');

        // Add an event listener to the like button
        likeButton.addEventListener('click', () => {
          // Get the current number of likes
          let likes = parseInt(likeButton.dataset.likes);

          // Toggle the like button state and update the count accordingly
          if (likeButton.classList.contains('liked')) {
            likes--;
            likeButton.classList.remove('liked');
          } else {
            likes++;
            likeButton.classList.add('liked');
          }

          // Update the like button and count
          likeButton.dataset.likes = likes;
          likeCount.textContent = likes;
        });
      });
    });
};

const loadSavedNews = () => {
  displaySavedNews();
};

loadSavedButton.addEventListener("click", loadSavedNews);
loadNewsButton.addEventListener("click", () => {
  getNews(categorySelect.value);
});

getNews();
