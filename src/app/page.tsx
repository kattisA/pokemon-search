"use client";
import React, {useState} from 'react';
import SearchBar from "@/components/SearchBar";

export default function Home() {
  const [pokemon, setPokemon] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const CACHE_DURATION = 86400000;

  const fetchCharacter = async (searchValue) => {
    const currentTime = new Date().getTime();
    const storedData = localStorage.getItem(searchValue.toLowerCase());

    if (storedData) {
      const { data, timestamp } = JSON.parse(storedData);

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
      <main className="bg-pokemon-theme bg-no-repeat bg-cover bg-center relative flex min-h-screen flex-col items-center justify-center">

        <h1 className="pt-4 pb-8 bg-white shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full text-center text-4xl font-medium tracking-tight text-black md:text-7xl ">
          Pokemon Search App
        </h1>
        <div className="bg-white p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full min-h-[200px] flex items-center justify-center">
          <div className="max-w-sm rounded overflow-hidden shadow-lg">
           <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} handleSearch={handleSearch}/>
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
