"use client";
import React, {useState} from 'react';

export default function Home() {
  const [pokemon, setPokemon] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const CACHE_DURATION = 86400000; // e.g., 24 hours in milliseconds

  const fetchCharacter = async (searchValue) => {
    const currentTime = new Date().getTime();
    const storedData = localStorage.getItem(searchValue.toLowerCase());

    if (storedData) {
      const { data, timestamp } = JSON.parse(storedData);

      // If data is still valid, use it.
      if (currentTime - timestamp < CACHE_DURATION) {
        setPokemon(data);
        return;
      }
    }

    try {
      const url = `https://pokeapi.co/api/v2/pokemon/${searchValue.toLowerCase()}`;
      const response = await fetch(url);
      const responseJson = await response.json();

      if (responseJson) {
        const dataToStore = {
          data: responseJson,
          timestamp: currentTime
        };
        localStorage.setItem(searchValue.toLowerCase(), JSON.stringify(dataToStore));

        setPokemon(responseJson);
      } else {
        setPokemon(null);
      }
    } catch (error) {
      setPokemon(null);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchCharacter(searchValue);
  };

  return (
      <main className="relative flex min-h-screen flex-col items-center justify-center">
        <h1 className="pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
          Pokemon Search App</h1>
        <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full min-h-[200px]">
          <div className="max-w-sm rounded overflow-hidden shadow-lg">
            <form onSubmit={handleSearch}>
              <label htmlFor="default-search"
                     className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                       xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <input
                    type="search"
                    id="default-search"
                    className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search Pokémon..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    required
                />
                <button type="submit"
                        className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Search
                </button>
              </div>
            </form>
            {pokemon && (
                <div className="max-w-sm rounded overflow-hidden shadow-lg">
                  <img className="w-full" src={pokemon.sprites.other["official-artwork"].front_default} alt={pokemon.name} />
                  <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{pokemon.name} </div>
                    <p className="text-gray-700 text-base">
                      {pokemon.types.map(typeInfo => typeInfo.type.name).join(", ")}
                    </p>
                  </div>
                  <div className="px-6 pt-4 pb-2">
                    {pokemon.abilities.map(abilityInfo => (
                        <span key={abilityInfo.ability.name}
                              className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                              {abilityInfo.ability.name}
                        </span>
                    ))}
                  </div>
                </div>
            )}
          </div>
        </div>
      </main>

  );
}
