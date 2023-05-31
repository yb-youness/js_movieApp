const global = { curentPage: window.location.pathname };

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = "5a2ffd81b33bc004f6cc414f79d7f774";
  const API_URL = "https://api.themoviedb.org/3/";

  showSpinner();

  const resp = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );
  const data = await resp.json();
  hideSpinner();
  return data;
}

// Highlight active nav link
function highlightActiveLink() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.curentPage) {
      link.classList.add("active");
    }
  });
}

// Init App
function init() {
  switch (global.curentPage) {
    case "/":
    case "/index.html":
      displayPopularMovie();
      break;
    case "/shows.html":
      displayPopularTvShow();
      break;
    case "/movie-details.html":
        displayMovieDetails();
      break;
    case "/tv-details.html":
      displayShowDetails();
      break;
    case "/search.html":
      console.log("Search");
      break;
  }
  highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);

async function displayPopularMovie() {
  const { results } = await fetchAPIData("movie/popular");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `<div>
   <a href="movie-details.html?id=${movie.id}">
     ${
       movie.poster_path
         ? `<img 
     src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
     class="card-img-top"
     alt="${movie.title}"
   />`
         : `<img
   src="../images/no-image.jpg"
   class="card-img-top"
   alt="${movie.title}"
  />`
     } 
   </a>
   <div class="card-body">
     <h5 class="card-title">${movie.title}</h5>
     <p class="card-text">
       <small class="text-muted">Release: ${movie.release_date}</small>
     </p>
   </div>
   </div>`;
    document.querySelector("#popular-movies").appendChild(div);
  });
}

async function displayPopularTvShow() {
    const { results } = await fetchAPIData("tv/popular");
  
    results.forEach((show) => {
      const div = document.createElement("div");
      div.classList.add("card");
      div.innerHTML = `<div>
     <a href="tv-details.html?id=${show.id}">
       ${
         show.poster_path
           ? `<img 
       src="https://image.tmdb.org/t/p/w500${show.poster_path}"
       class="card-img-top"
       alt="${show.name}"
     />`
           : `<img
     src="../images/no-image.jpg"
     class="card-img-top"
     alt="${show.name}"
    />`
       } 
     </a>
     <div class="card-body">
       <h5 class="card-title">${show.name}</h5>
       <p class="card-text">
         <small class="text-muted">Air : ${show.first_air_date}</small>
       </p>
     </div>
     </div>`;
      document.querySelector("#popular-shows").appendChild(div);
    });
  }





async function displayMovieDetails(){
    const showId = window.location.search.split("=")[1];
    const movie = await fetchAPIData(`movie/${showId}`);
    
     // Add Backround Image
     displayBackgroundImage('movie',movie.backdrop_path);
     

    const div = document.createElement("div");
    div.innerHTML = ` <div class="details-top">
    <div>
    ${
        movie.poster_path
          ? `<img 
      src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
      class="card-img-top"
      alt="${movie.title}"
    />`
          : `<img
    src="../images/no-image.jpg"
    class="card-img-top"
    alt="${movie.title}"
   />`
      } 
    </div>
    <div>
      <h2>${movie.title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${movie.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${movie.release_date}</p>
      <p>
        ${movie.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${movie.genres.map((g)=>`<li>${g.name}</li>`).join(' ')}
      </ul>
      <a href="${movie.homePage}" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(movie.budget)}</li>
      <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(movie.revenue)}</li>
      <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
      <li><span class="text-secondary">Status:</span> ${movie.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${movie.production_companies.map((comp)=>`<span>${comp.name}</span>`).join(" ")}</div>
  </div>`;
  document.querySelector("#movie-details").appendChild(div);
} 



async function displayShowDetails(){
  const showId = window.location.search.split("=")[1];
  const show = await fetchAPIData(`tv/${showId}`);
  
   // Add Backround Image
   displayBackgroundImage('tv',show.backdrop_path);
   

  const div = document.createElement("div");
  div.innerHTML = ` <div class="details-top">
  <div>
  ${
      show.poster_path
        ? `<img 
    src="https://image.tmdb.org/t/p/w500${show.poster_path}"
    class="card-img-top"
    alt="${show.name}"
  />`
        : `<img
  src="../images/no-image.jpg"
  class="card-img-top"
  alt="${show.name}"
 />`
    } 
  </div>
  <div>
    <h2>${show.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${show.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${show.last_air_date}</p>
    <p>
      ${show.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${show.genres.map((g)=>`<li>${g.name}</li>`).join(' ')}
    </ul>
    <a href="${show.homePage}" target="_blank" class="btn">Visit show Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>show Info</h2>
  <ul>
    <li><span class="text-secondary">Number Of Episodes: </span> ${show.number_of_episodes}</li>
    <li><span class="text-secondary">Last Episode To Air: </span> ${show.last_episode_to_air}}</li>
    <li><span class="text-secondary">Status:</span> ${show.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">${show.production_companies.map((comp)=>`<span>${comp.name}</span>`).join(" ")}</div>
</div>`;
document.querySelector("#show-details").appendChild(div);
} 



// Display Backdrop On Details Page 
function displayBackgroundImage(type,backroundpath){
   const overlayDiv = document.createElement("div");
   overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backroundpath})`;
   overlayDiv.style.backgroundPosition = "center";
   overlayDiv.style.backgroundRepeat   = "no-repeat";
   overlayDiv.style.height='100vh';
   overlayDiv.style.width = '100vw';
   overlayDiv.style.position = 'absolute';
   overlayDiv.style.top = '0';
   overlayDiv.style.left= '0';
   overlayDiv.style.zIndex ='-1';
   overlayDiv.style.opacity ='0.1';

   if(type === 'movie'){
    document.querySelector("#movie-details").appendChild(overlayDiv);
   }else{
    document.querySelector("#show-details").appendChild(overlayDiv);
   }

}

function addCommasToNumber(number){
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}
