//Display Popular Movies from TMDB
async function displayPopularMovies(){
    let movies = await getPopularMovies();
    
    displayMovies(movies);

    document.getElementById("page-title").innerHTML = 'Popular Movies';
}

//Display Now Playing Movies Function
async function displayNowPlayingMovies(){
    let movies = await getNowPlayingMovies();
    
    displayMovies(movies);

    document.getElementById("page-title").innerHTML = 'Now Playing Movies';
}

//Display the favorite movies
async function displayFavoriteMovies(){
    let movies = getFavoriteMovies();
    displayMovies(movies);

    document.getElementById("page-title").innerHTML = 'My Favorite Movies';
}

async function displaySearchResults(){
    let query = document.getElementById('movie-search').value;
    //'Captain America'
    let encodedValue = encodeURIComponent(query);

    let movies = await getMoviesByQuery(encodedValue);

    document.getElementById('page-title').innerHTML = `Search results for "${query}"`;

    displayMovies(movies);

    //uncheck the buttons
    uncheckButtons();
}

//Displays the details for a give movie.
//The Id will be passed by query string.
//Used on the movieDetails page.
async function displayMovieDetails(){
    const urlParams = new URLSearchParams(window.location.search);
    const defaultMovieId = '348350';
    let movieId = urlParams.get("id") || defaultMovieId;

    let movie = await getMovie(movieId);

    if(!movie) {
        console.log(`Movie with id ${movieId} not found. Showing default movie instead`);
        movieId = defaultMovieId;
        movie = await getMovie(movieId); 
    }

    //Set the background images
    let movieDetails = document.getElementById('movie-details');
    let backdrop_path = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
    if(movie.backdrop_path == null){
        backdrop_path = '/img/Backdrop.jpg';
    }
    movieDetails.style.background = `url(${backdrop_path}), linear-gradient(rgba(0,0,0, .5), rgba(0,0,0, .5))`;
    movieDetails.style.backgroundPosition = 'cover';
    movieDetails.style.backgroundRepeat ='no-repeat';
    movieDetails.style.backgroundBlendMode = 'overlay';

    //Set the poster image
    let poster_path = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    if(movie.poster_path == null){
        poster_path = `/img/poster.png`;
    }

    document.getElementById('movie-poster').src = poster_path;

    //Display the movie title
    document.getElementById('movie-title').innerText = movie.title;

    //Display the movie certification
    document.getElementById('movie-certification').innerText = await getMovieRating(movie.id);

    //Display the release date
    document.getElementById('movie-release').innerText = (new Date(movie.release_date)).toLocaleDateString();

    //Display movie runtime
    let minutes = movie.runtime % 60;
    let hours = (movie.runtime - minutes) / 60;
    document.getElementById('movie-runtime').textContent = `${hours}h ${minutes}m`;
}

function displayMovies(movies){
    
    //Get the Movie card template.
    const movieCardTemplate = document.getElementById("movie-card-template");
    const movieRow = document.getElementById("movie-row");
    movieRow.innerHTML = "";

    //Find the movie row element where all the movies go.
    movies.forEach(movie => {
        
        let movieCard = document.importNode(movieCardTemplate.content, true);

        //Modify the card for the current movie
        let titleElement = movieCard.querySelector(`.card-body > .card-title`);
        titleElement.textContent = movie.title;

        let descriptionElement = movieCard.querySelector(`.card-text`);
        let date = new Date(movie.release_date);
        descriptionElement.textContent = date.toLocaleDateString(undefined, {month: `short`, day: `numeric`, year:`numeric`});
        
        let movieImageElement = movieCard.querySelector(".card-img-top");
        let poster_path = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        if (movie.poster_path == null){
            poster_path = "/img/poster.png";
        }
        movieImageElement.setAttribute('src',poster_path);

        //Set the buttons correctly
        //Find favorite button
        let removeFavButton = movieCard.querySelector('[data-fav="true"]');
        removeFavButton.setAttribute('data-movieId', movie.id);

        //
        let addFavButton = movieCard.querySelector('[data-fav="false"]');
        addFavButton.setAttribute('data-movieId', movie.id);

        if(isFavoriteMovie(movie.id)){
            addFavButton.style.display = 'none';
            removeFavButton.style.display = 'block';
        } else {
            addFavButton.style.display = 'block';
            removeFavButton.style.display = 'none';
        }

        let infoButton = movieCard.querySelector('[data-detail]');
        infoButton.href = `/movieDetails.html?id=${movie.id}`;

        movieRow.appendChild(movieCard);
    });
}

//Uncheck all the buttons in the button bar
function uncheckButtons(){
    let buttons = document.querySelectorAll('#btnBar .btn-check');

    let checkedButton = Array.from(buttons).find(button => button.checked);

    if(checkedButton){
        checkedButton.checked = false;
    }
}

/* #region favorite movies */
async function addFavoriteMovie(btn){
    let movieId = btn.getAttribute('data-movieId');

    let favorites = getFavoriteMovies();

    let duplicateMovie = favorites.find(movie => movie.id == movieId);

    if (duplicateMovie == undefined){
        let newFavorite = await getMovie(movieId);

        if (newFavorite != undefined){
            favorites.push(newFavorite);
            saveFavoriteMovies(favorites);
        }
    }  
    selectAndClickMovieCategory();                                          
}

async function removeFavoriteMovie(btn){
    let movieId = btn.getAttribute('data-movieId');

    let favorites = getFavoriteMovies();

    if(favorites){
        favorites = favorites.filter(movie => movie.id != movieId );
        saveFavoriteMovies(favorites);
    }
    selectAndClickMovieCategory();
}

function getFavoriteMovies(){
    let favoriteMovies = localStorage.getItem("ss-favorite-movies");

    if(favoriteMovies == null){
        favoriteMovies = [];
        saveFavoriteMovies(favoriteMovies);
    }
    else{
        favoriteMovies =JSON.parse(favoriteMovies);
    }

    return favoriteMovies;
}

//Save favorite movies to Local Storage.
function saveFavoriteMovies(movies){
    let movieJSON = JSON.stringify(movies);
    localStorage.setItem("ss-favorite-movies", movieJSON);

}

function isFavoriteMovie(movieId){
    let favoriteMovies = getFavoriteMovies();

    if(!favoriteMovies){
        return false;
    }

    return favoriteMovies.some(movie => movie.id == movieId);
}
//Find the button bar. Locate the selected item and click it again.
function selectAndClickMovieCategory(){
    //Get all the buttons in the Button Bar.
    let buttons = document.querySelectorAll('#btnBar .btn-check');

    //Find the currently selected button.
    let checkedButton = Array.from(buttons).find(button => button.checked );

    //Call the click event on the checked button.
    if (checkedButton){
        checkedButton.click();
    }
}
/* #endregion favorite movies */