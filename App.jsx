import React, { useState, useEffect } from 'react';
import Search from './Components/search';
import Spinner from './Components/spinner';
import MovieCard from './Components/movieCard';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}

const App = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const [moviesList, setMoviesList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchTerm, setdebouncedSearchTerm] = useState('');
    const [trendingMovies, setTrendingMovies] = useState([]);

    useDebounce(() => setdebouncedSearchTerm(searchTerm), 1000, [searchTerm])

    const fetchMovies = async (query = '') => {
        setIsLoading(true);
        setErrorMessage('');
            
        try {
            const endPoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie`;

            const response = await fetch(endPoint, API_OPTIONS);

            if(!response.ok){
                throw new Error('Failed to fetch!');
            }

            const data = await response.json();
            // console.log(data);

            if(data.response === 'false'){
                setErrorMessage(data.error || 'failed to fetch');
                setMoviesList([]);
                return;
            }

            setMoviesList(data.results || []);

            if(query && data.results.length > 0){
                await updateSearchCount(query, data.results[0]);
            }
        } catch (error) {
            console.log(`Error fetching movies: ${error}`);
            setErrorMessage('Error fetching movies. Please try again later.')
        }
        finally{
            setIsLoading(false);
        }
    }

    const loadTrendingMovies = async () => {
        try {
            const trendMovies = await getTrendingMovies();
            setTrendingMovies(trendMovies);
        } catch (error) {
            console.error(`Error fetching trending movies: ${error}`);
        }
    }

    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        loadTrendingMovies();
    }, []);

    return (
        <main>
            <div className="pattern"/>

            <div className="wrapper">
                <header>
                    <img src="https://github.com/adrianhajdin/react-movies/blob/main/public/hero.png?raw=true" alt="hero" />
                    <h1>Find <span className='text-gradient fancy-text text-7xl font-medium'>Movies</span> that interests you !!</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                </header>

                {trendingMovies.length > 0 && (
                    <section className="trending">
                        <h2>Trending Today</h2>

                        <ul>
                            {trendingMovies.map((movie, index) => (
                                <li key={movie.$id}>
                                    <p>{index+1}</p>

                                    <img src={movie.poster_URL} alt={movie.title} />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <section className="allMovies">
                    <h2 className='mb-[20px]'>All Movies</h2>

                    {isLoading ? (
                        <Spinner/>
                    ) : errorMessage ? (
                        <p className='text-red-500'>{errorMessage}</p>
                    ) : (
                        <ul>
                            {moviesList.map((movie) => (
                                <MovieCard key={movie.id} movie={movie}/>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
}
 
export default App;
