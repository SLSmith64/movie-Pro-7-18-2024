const apiKey = `eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MTMzMWRhZTEyNWM0NTc4NjBmZDEzMzFhYTYzYWY4MiIsIm5iZiI6MTcyMTMzNTA4OC42MjQ5MTksInN1YiI6IjY2OTk2Yzc2ZDE4ZTk4YzgwNzhiZjA2YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gibXy44W1l5PX76nG-w0PoR6TM94jmEuOMdps2aVq6c`;

/**
 * Fetches and returns a list of popular movies currently playing in the theaters.
 * @returns {Object} A list of currently playing movies as a javascript object
 * @throws {Error} If the network response is not ok.
 */
async function getPopularMovies(){
    const popularMoviesURL = `https://api.themoviedb.org/3/movie/popular`;

    try{
        let response = await fetch(popularMoviesURL,{
            headers:{
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if(!response.ok) throw new Error("Network response was not ok.");

        let popularMovies = await response.json();
        return popularMovies.results;
    } catch (error){
        console.error(`Fetch Error:  ${error}`);
        return [];
    }
}

async function getNowPlayingMovies(){
    const getNowPlayingMovies = `https://api.themoviedb.org/3/movie/now_playing`;

    
    try{
        let response = await fetch(getNowPlayingMovies,{
            headers:{
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if(!response.ok) throw new Error("Network response was not ok.");

        let nowPlayingMovies = await response.json();
        return nowPlayingMovies.results;
    } catch (error){
        console.error(`Fetch Error:  ${error}`);
        return [];
    }


}
async function getMoviesByQuery(query){
    
    const searchMoviesUrl = `https://api.themoviedb.org/3/search/movie?query=${query}`;
    
    try{
        let response = await fetch(searchMoviesUrl,{
            headers:{
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if(!response.ok) throw new Error("Network response was not ok.");

        let foundMovies = await response.json();
        return foundMovies.results;
    } catch (error){
        console.error(`Get Movies Fetch Error:  ${error}`);
        return [];
    }
}

/**
 * 
 * @param {number} movieId 
 * @returns return an movie object from TMDB API
 */
async function getMovie(movieId){
    
    const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}`;
    
    try{
        let response = await fetch(movieUrl,{
            headers:{
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if(!response.ok) throw new Error("Network response was not ok.");

        let movie = await response.json();
        return movie;
    } catch (error){
        console.error(`Get Movies Fetch Error:  ${error}`);
        return null;
    }
}

async function getMovieRating(movieId){
      const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}/release_dates`;
    
    try{
        let response = await fetch(movieUrl,{
            headers:{
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if(!response.ok) throw new Error("Network response was not ok.");

        let releaseDates = await response.json();

        let usReleaseDates = releaseDates.results.find( rd => rd.iso_3166_1 == 'US');

        if(!usReleaseDates) return "NR";

        let releaseDate = usReleaseDates.release_dates.find( rd => rd.certification != '');

        //(?) Ternary operator 
        return releaseDate ? releaseDate.certification : "NR";

    } catch (error){
        console.error(`Get Movies Fetch Error:  ${error}`);
        return "NR";
    }
}

async function getMovieVideos(movieId){    

    const videosUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos`;
    
    try {
        let response = await fetch(videosUrl,{
            headers:{
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if(!response.ok) throw new Error("Network response was not ok.");

        let videos = await response.json();
        return videos.results;
    } catch (error){
        console.error(`Get Movies Fetch Error:  ${error}`);
        return null;
    }
}