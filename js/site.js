
//Function Calls
//displayPopularMovies();
displayNowPlayingMovies();

//Display Popular Movies Function
async function displayPopularMovies(){
    let movies = await getPopularMovies();
    
    displayMovies(movies);
}

//Display Now Playing Movies Function
async function displayNowPlayingMovies(){
    let movies = await getNowPlayingMovies();
    
    displayMovies(movies);
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

        movieRow.appendChild(movieCard);
    });
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
    localStorage.setItem("np-favorite-movies", movieJSON);

}

function isFavoriteMovie(movieId){
    let favoriteMovies = getFavoriteMovies();

    if(!favoriteMovies){
        return false;
    }

    return favoriteMovies.some(movie => movie.id == movieId);
}

/* #endregion favorite movies */