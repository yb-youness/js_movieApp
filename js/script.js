const global = { curentPage: window.location.pathname,
  search : {
    term : '',
    type : '',
    page : 1,
    totalPages:1,
    totalResults:0
  },
  api :{
    apiKey:"5a2ffd81b33bc004f6cc414f79d7f774",
    apiUrl:"https://api.themoviedb.org/3/"
  }
};

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY =  global.api.apiKey;
  const API_URL = global.api.apiUrl;

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
      displaySlider();
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
      search();
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

async function displayMovieDetails() {
  const showId = window.location.search.split("=")[1];
  const movie = await fetchAPIData(`movie/${showId}`);

  // Add Backround Image
  displayBackgroundImage("movie", movie.backdrop_path);

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
        ${movie.genres.map((g) => `<li>${g.name}</li>`).join(" ")}
      </ul>
      <a href="${
        movie.homepage
      }" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
        movie.budget
      )}</li>
      <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
        movie.revenue
      )}</li>
      <li><span class="text-secondary">Runtime:</span> ${
        movie.runtime
      } minutes</li>
      <li><span class="text-secondary">Status:</span> ${movie.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${movie.production_companies
      .map((comp) => `<span>${comp.name}</span>`)
      .join(" ")}</div>
  </div>`;
  document.querySelector("#movie-details").appendChild(div);
}

async function displayShowDetails() {
  const showId = window.location.search.split("=")[1];
  const show = await fetchAPIData(`tv/${showId}`);

  // Add Backround Image
  displayBackgroundImage("tv", show.backdrop_path);

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
      ${show.genres.map((g) => `<li>${g.name}</li>`).join(" ")}
    </ul>
    <a href="${
      show.homepage
    }" target="_blank" class="btn">Visit show Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>show Info</h2>
  <ul>
    <li><span class="text-secondary">Number Of Episodes: </span> ${
      show.number_of_episodes
    }</li>
    <li><span class="text-secondary">Last Episode To Air: </span> ${
      show.last_episode_to_air.name
    }</li>
    <li><span class="text-secondary">Status:</span> ${show.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">${show.production_companies
    .map((comp) => `<span>${comp.name}</span>`)
    .join(" ")}</div>
</div>`;
  document.querySelector("#show-details").appendChild(div);
}

// Display Backdrop On Details Page
function displayBackgroundImage(type, backroundpath) {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backroundpath})`;
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.1";

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
}
async function displaySlider() {
  const { results } = await fetchAPIData("movie/now_playing");
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `<div class="swiper-slide">
    <a href="movie-details.html?id=${movie.id}">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
    </a>
    <h4 class="swiper-rating">
      <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
    </h4>
  </div> `;
  document.querySelector(".swiper-wrapper").appendChild(div);
  });
  
  // this function to Setup Swipper
  initSwiper();
}

// Search For Movies/Shows
async function search(){
   // get the data from the Url 
  const queryString = window.location.search;
  const urlPrams    = new URLSearchParams(queryString);
  global.search.type = urlPrams.get('type');
  global.search.term = urlPrams.get('search-term');

  if(global.search.term !== '' && global.search.term !==null){
      // make request and display results
      const {results,total_pages,page,total_results} = await serachApiData();
        
        global.search.page =page;
        global.search.totalResults =total_results;
        global.search.totalPages =total_pages;

      if(results.length==0){
        showAlert("Element Not Found  ","alert-error");
        return;
      }
        displaySearchResults(results);
        document.querySelector("#search-term").value ="";
  }else{
      showAlert("Please Enter A Search Term ","alert-error");
  }
}
function displaySearchResults(results){
  // Clear prev results 
  document.querySelector("#search-results").innerHTML =""; 
  document.querySelector("#search-results-heading").innerHTML ="";
  document.querySelector("#pagination").innerHTML ="";  
  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `<div>
   <a href="${global.search.type}-details.html?id=${result.id}">
     ${
       result.poster_path
         ? `<img 
     src="https://image.tmdb.org/t/p/w500${result.poster_path}"
     class="card-img-top"
     alt="${global.search.type === 'movie' ? result.title : result.name}"
   />`
         : `<img
   src="../images/no-image.jpg"
   class="card-img-top"
   alt="${global.search.type === 'movie' ? result.title : result.name}"
  />`
     } 
   </a>
   <div class="card-body">
     <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
     <p class="card-text">
       <small class="text-muted">Release: ${global.search.type === 'movie' ? result.release_date : result.first_air_date}</small>
     </p>
   </div>
   </div>`;
    
    document.querySelector("#search-results-heading").innerHTML =`
       <h2>${results.length} of ${global.search.totalResults}  Results for ${global.search.term} </h2>
    `;
    document.querySelector("#search-results").appendChild(div);
   
  });
   //Show pagination 
   displayPagination();
}

function displayPagination(){
  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML =`<button class="btn btn-primary" id="prev">Prev</button>
                  <button class="btn btn-primary" id="next">Next</button>
                   <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>`;

                   document.querySelector("#pagination").appendChild(div);
        // Disable prev Button if on the first page 
        if(global.search.page == 1){
          document.querySelector("#prev").disabled = true;
        }    
        // Disable Next Button If thelast Page 
        if(global.search.page == global.search.totalPages){
          document.querySelector("#next").disabled = true;
        }  
        // Next Page
        document.querySelector("#next").addEventListener("click",async()=>{
         global.search.page++;
         const {results , total_pages} = await serachApiData();
         displaySearchResults(results);
        });  
        
          // Prev Page
          document.querySelector("#prev").addEventListener("click",async()=>{
            global.search.page--;
            const {results , total_pages} = await serachApiData();
            displaySearchResults(results);
           });      
  
}

async function serachApiData(){
  const API_KEY =  global.api.apiKey;
  const API_URL = global.api.apiUrl;
  const searchTerm = global.search.term;

  showSpinner();

  const resp = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  );
  const data = await resp.json();
  hideSpinner();
  return data;
} 
// Show Alert 
function showAlert(message,className){
   const alertEl = document.createElement("div");
   alertEl.classList.add("alert",className);
   alertEl.appendChild(document.createTextNode(message));
   document.querySelector("#alert").appendChild(alertEl);
   setTimeout(()=>{
     alertEl.remove();
   },3000);
} 

function initSwiper(){
    const swiper = new Swiper('.swiper',{
      slidesPerView :1,
      spaceBetween :30,
      freeMode : true,
      loop:true,
      autoplay :{
        delay:4000,
        disableOnInteraction: false
      },
      breakpoints : {
         500:{
          slidesPerView :2
         },
         700:{
          slidesPerView :3
         },
         1200:{
          slidesPerView :4
         },
      }
    })
}
function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}
