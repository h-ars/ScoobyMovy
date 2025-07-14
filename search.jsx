import React from 'react';

const Search = ({searchTerm , setSearchTerm}) => {
    return (
        <div className='search'>
            <div>
                <img src="https://raw.githubusercontent.com/adrianhajdin/react-movies/d4790df5a4017c56ba368c4d4dd3307cdc29feea/public/search.svg" alt="searchIcon" />

                <input type="text" placeholder='Search the movie here..' value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)}/>
            </div>
        </div>
    );
}
 
export default Search;
