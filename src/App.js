import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MovieList from "./components/MovieList";
import MovieListHeadings from "./components/MovieListHeading";
import SearchBox from "./components/SearchBox";
import AddFavourites from "./components/AddFavourites";
import RemoveFavourite from "./components/RemoveFavourite";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const getMovieRequest = async (searchValue) => {
    const url = `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}&s=${searchValue}`;

    const response = await fetch(url);
    const responseJson = await response.json();

    //for testing in console
    console.log(responseJson);

    //if we have any search results
    if (responseJson.Search) {
      setMovies(responseJson.Search);
    }
  };

  //Rendering the search movies
  useEffect(() => {
    getMovieRequest(searchValue);
  }, [searchValue]);

  //Re-rendering the movie list that was stored in local storage using JSON.parse
  useEffect(() => {
    const movieFavouriteList = JSON.parse(
      localStorage.getItem("react-movie-app-favourite")
    );
    setFavourites(movieFavouriteList);
  }, []);

  //Saving to Local Storage for persistency
  const saveToLocalStorage = (items) => {
    localStorage.setItem("react-movie-app-favourite", JSON.stringify(items));
  };

  //Adding movie to Favourite List
  const AddFavouriteMovie = (movie) => {
    const newFavouriteList = [...favourites, movie];
    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  };

  //Removing movie from Favourite List
  const removeFromFavourite = (movie) => {
    const newFavouriteList = favourites.filter(
      (favourite) => favourite.imdbID !== movie.imdbID
    );
    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  };

  return (
    <div className='container-fluid movie-app'>
      {/* Movie List */}
      <div className='row d-flex align-items-center mt-4 mb-4'>
        <MovieListHeadings heading='Movies' />
        <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>
      <div className='row'>
        <MovieList
          movies={movies}
          handleFavouritesClick={AddFavouriteMovie}
          favouriteComponent={AddFavourites}
        />
      </div>

      {/* Favourite List */}
      <div className='row d-flex align-items-center mt-4 mb-4'>
        <MovieListHeadings heading='Favourites' />
      </div>
      <div className='row'>
        <MovieList
          movies={favourites}
          handleFavouritesClick={removeFromFavourite}
          favouriteComponent={RemoveFavourite}
        />
      </div>
    </div>
  );
};

export default App;
