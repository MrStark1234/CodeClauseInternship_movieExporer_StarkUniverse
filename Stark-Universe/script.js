const movieSearchBox = document.getElementById("search-box");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");

async function loadMovies(searchTerm) {
  const res = await fetch(
    `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=ed87287d`
  );
  const data = await res.json();
  if (data.Response === "True") displayMovieList(data.Search);
}

function findMovies() {
  const searchTerm = movieSearchBox.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.toggle("hide-search-list", false);
    loadMovies(searchTerm);
  } else {
    searchList.classList.toggle("hide-search-list", true);
  }
}

function displayMovieList(movies) {
  searchList.innerHTML = movies
    .map(
      (movie) => `
    <div class="search-list-item" data-id="${movie.imdbID}">
      <div class="search-item-thumbnail">
        <img src="${
          movie.Poster !== "N/A" ? movie.Poster : "image_not_found.png"
        }">
      </div>
      <div class="search-item-info">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
      </div>
    </div>`
    )
    .join("");
  loadMovieDetails();
}

async function loadMovieDetails() {
  for (const movie of searchList.querySelectorAll(".search-list-item")) {
    movie.addEventListener("click", async () => {
      const res = await fetch(
        `https://omdbapi.com/?i=${movie.dataset.id}&apikey=ed87287d`
      );
      const movieDetails = await res.json();
      displayMovieDetails(movieDetails);
      searchList.classList.toggle("hide-search-list", true);
      movieSearchBox.value = "";
    });
  }
}

function displayMovieDetails(details) {
  resultGrid.innerHTML = `
    <div class="movie-poster">
      <img src="${
        details.Poster !== "N/A" ? details.Poster : "image_not_found.png"
      }" alt="movie poster">
    </div>
    <div class="movie-info">
      <h3 class="movie-title">${details.Title}</h3>
      <ul class="movie-misc-info">
        <li class="year">Year: ${details.Year}</li>
        <li class="rated">Ratings: ${details.Rated}</li>
        <li class="released">Released: ${details.Released}</li>
      </ul>
      <p class="genre"><b>Genre:</b> ${details.Genre}</p>
      <p class="writer"><b>Writer:</b> ${details.Writer}</p>
      <p class="actors"><b>Actors: </b>${details.Actors}</p>
      <p class="plot"><b>Plot:</b> ${details.Plot}</p>
      <p class="language"><b>Language:</b> ${details.Language}</p>
      <p class="awards"><b><i class="fas fa-award"></i></b> ${
        details.Awards
      }</p>
    </div>`;
}

window.addEventListener("click", (event) => {
  if (!event.target.classList.contains("form-control")) {
    searchList.classList.toggle("hide-search-list", true);
  }
});
