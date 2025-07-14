import React, { useState, useEffect } from 'react';

function MovieCard({movie: 
    {title, vote_average, poster_path, release_date, original_language}
}) {
    return (  
        <div className="movieCard">
            <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : 'https://github.com/adrianhajdin/react-movies/blob/main/public/no-movie.png?raw=true'} alt={title}/>

            <div className="mt-4">
                <h3>{title}</h3>

                <div className="content">
                    <div className="rating">
                        <img src="https://raw.githubusercontent.com/adrianhajdin/react-movies/d4790df5a4017c56ba368c4d4dd3307cdc29feea/public/star.svg" alt="star-rating" />
                        <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                    </div>

                    <span>•</span>
                    <p className='lang'>{original_language}</p>

                    <span>•</span>
                    <p className="year">
                        {release_date ? release_date.split('-')[0] : 'N/A'}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default MovieCard;