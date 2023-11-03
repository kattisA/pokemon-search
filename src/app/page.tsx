"use client";
import React, {useState} from 'react';
import SearchBar from "@/components/SearchBar";
import Alert from "@/components/Alert"

interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

interface PokemonSpriteVersions {
  'official-artwork': {
    front_default: string;
  };
}

interface PokemonSprites {
  front_default: string;
  other: PokemonSpriteVersions;
}


interface PokemonDetails {
  name: string;
  types: PokemonType[];
  sprites: PokemonSprites;
  abilities: PokemonAbility[];
}

interface PokemonState {
  basic: PokemonDetails | null;
  description: string;
}

export default function Home() {
  const [pokemon, setPokemon] = useState<PokemonState>({
    basic: null,
    description:"",
  });
  const [searchValue, setSearchValue] = useState("");
  const [errorMessage, setErrorMessage] = useState('');

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
      const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${searchValue.toLowerCase()}`;
      const [response, speciesResponse] = await Promise.all([
        fetch(url),
        fetch(speciesUrl)
      ]);

      const [pokemonDetails, speciesDetails] = await Promise.all([
        response.json(),
        speciesResponse.json()
      ]);

      const descriptionTextEntry = speciesDetails.flavor_text_entries.find(entry => entry.language.name === 'en');
      const descriptionText = descriptionTextEntry ? descriptionTextEntry.flavor_text : "No description available.";

      const newPokemonData = {
        basic: pokemonDetails,
        description: descriptionText
      };

      setPokemon(newPokemonData);

      localStorage.setItem(searchValue, JSON.stringify({
        timestamp: new Date().getTime(),
        data: newPokemonData
      }));
    } catch (error) {
      setErrorMessage("The Pokemon was not found. Try again!")
      console.error("Failed to fetch Pokémon data:", error);
      setPokemon({
        basic: null,
        description: "",
      });
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setErrorMessage('');
    fetchCharacter(searchValue);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
      <main className="bg-pokemon-theme bg-no-repeat bg-cover bg-center relative flex min-h-screen flex-col items-center justify-center">
        <h1 className="pt-4 pb-8 bg-white shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full text-center text-4xl font-medium tracking-tight text-pokemon-dark-purple md:text-7xl ">
          Pokemon Search App
        </h1>
        <div className="bg-white p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full min-h-[200px] flex items-center justify-center">
          <div className="max-w-sm rounded overflow-hidden shadow-lg">
           <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} handleSearch={handleSearch}/>
            {errorMessage && (
                <Alert message={errorMessage} title={"Error"}/>
            )}

            {pokemon.basic && (
                <div className="max-w-sm rounded overflow-hidden shadow-lg">
                  <img className="w-full" src={pokemon.basic.sprites.other["official-artwork"].front_default} alt={pokemon.basic.name} />
                  <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{capitalizeFirstLetter(pokemon.basic.name)} </div>
                    <div className="px-6 pt-4 pb-2">
                      {pokemon.basic.types.map(typeInfo => (
                          <span key={typeInfo.type.name}
                                className="inline-block bg-pokemon-purple rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">
                              {typeInfo.type.name}
                        </span>
                      ))}
                    </div>
                    {pokemon.description && (
                        <p className="text-gray-700 text-base">
                          {pokemon.description.replace(/[\f]/g, ' ')}
                        </p>
                    )}
                  </div>
                  <div className="px-6 pt-4 pb-2">
                    {pokemon.basic.abilities.map(abilityInfo => (
                        <span key={abilityInfo.ability.name}
                              className="inline-block bg-pokemon-purple rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">
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
