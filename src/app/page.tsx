"use client";
import React, {useState} from 'react';
import SearchBar from "@/components/SearchBar";
import Alert from "@/components/Alert"
import Image from 'next/image';

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
    evolutionNames: string[];
}

interface EvolutionChainLink {
    speciesName: string;
    evolvesTo: EvolutionChainLink[]; // Recursive structure for multi-stage evolutions
}

interface EvolutionChainResponse {
    chain: EvolutionChainLink;
}

export default function Home() {
    const [pokemon, setPokemon] = useState<PokemonState>({
        basic: null,
        description: "",
        evolutionNames: []

    });
    const [searchValue, setSearchValue] = useState("");
    const [errorMessage, setErrorMessage] = useState('');

    const CACHE_DURATION = 86400000;

    const MAX_CACHE_ITEMS = 20;

    const evictCache = () => {
        const keys = Object.keys(localStorage);
        if (keys.length > MAX_CACHE_ITEMS) {
            let oldestKey = keys[0];
            let oldestItem = localStorage.getItem(oldestKey);
            let oldestTimestamp = oldestItem ? JSON.parse(oldestItem).timestamp : Infinity;

            keys.forEach(key => {
                const item = localStorage.getItem(key);
                if (item) {
                    const timestamp = JSON.parse(item).timestamp;
                    if (timestamp < oldestTimestamp) {
                        oldestTimestamp = timestamp;
                        oldestKey = key;
                    }
                }
            });

            if (oldestKey) {
                localStorage.removeItem(oldestKey);
            }
        }
    };


    const fetchCharacter = async (searchValue: string) => {
        const currentTime = new Date().getTime();
        const storedData = localStorage.getItem(searchValue.toLowerCase());

        if (storedData) {
            const {data, timestamp} = JSON.parse(storedData);

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

            const descriptionTextEntry = speciesDetails.flavor_text_entries.find((entry:any) => entry.language.name === 'en');
            const descriptionText = descriptionTextEntry ? descriptionTextEntry.flavor_text : "No description available.";

            // Fetch evolution chain
            const evolutionResponse = await fetch(speciesDetails.evolution_chain.url);
            const evolutionChainData = await evolutionResponse.json();

            let evolutionNames = [];
            let currentChainLink = evolutionChainData.chain;

            while (currentChainLink && currentChainLink.species) {
                evolutionNames.push(currentChainLink.species.name);
                currentChainLink = currentChainLink.evolves_to[0]; // Assuming a single linear evolution path
            }

            const newPokemonData = {
                basic: pokemonDetails,
                description: descriptionText,
                evolutionNames: evolutionNames
            };

            setPokemon(newPokemonData);
            evictCache();

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
                evolutionNames: []
            });
        }
    };

    const handleSearch = (event:any) => {
        event.preventDefault();
        setErrorMessage('');
        fetchCharacter(searchValue);
    };

    const capitalizeFirstLetter = (string:string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <main
            className="bg-pokemon-theme bg-no-repeat bg-cover bg-center relative flex min-h-screen flex-col items-center justify-center">
            <h1 className="pt-4 pb-8 bg-white shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full text-center text-3xl font-medium tracking-tight text-pokemon-dark-purple ">
                Pokemon Search App
            </h1>
            <div
                className="bg-white p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full min-h-[200px] flex items-center justify-center">
                <div className="max-w-sm rounded overflow-hidden shadow-lg">
                    <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} handleSearch={handleSearch}/>
                    {errorMessage && (
                        <Alert message={errorMessage} title={"Error"}/>
                    )}

                    {pokemon.basic && (
                        <div className="max-w-sm rounded overflow-hidden shadow-lg">
                            <Image
                                src={pokemon.basic.sprites.other["official-artwork"].front_default}
                                alt={pokemon.basic.name}
                                width={384}
                                height={384}
                                layout="responsive"
                            />
                            <div className="px-6 py-4">
                                <h2
                                    className="font-bold text-xl mb-2">{capitalizeFirstLetter(pokemon.basic.name)} </h2>
                                <div className="px-2 pt-4 pb-2">
                                    {pokemon.basic.types.map(typeInfo => (
                                        <span key={typeInfo.type.name}
                                              className="inline-block bg-grey-blue rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">
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
                            {pokemon.evolutionNames && pokemon.evolutionNames.length > 0 && (
                                <div className="px-6 pt-4 pb-2 text-gray-700">
                                    <h2 className="font-bold text-xl mb-2">Evolutions</h2>
                                        {pokemon.evolutionNames.map((name, index) => (
                                            !(pokemon.basic) || name === pokemon.basic.name ?
                                           <span className="font-bold" key={name}> {capitalizeFirstLetter(name)}</span> :
                                                <span key={name}> {capitalizeFirstLetter(name)}</span>
                                        ))}
                                </div>
                            )
                            }
                        </div>
                    )}
                </div>
            </div>
            <footer className="bg-white border-t mt-8 py-4">
                <div className="max-w-xl mx-auto px-4 text-center">
                    <p className="text-sm text-gray-600">
                        Created by
                        {' '}
                        <a href="https://kattisa.github.io/" target="_blank" rel="noopener noreferrer"
                           className="text-pokemon-dark-purple hover:text-pokemon-light-purple">
                            Kattis
                        </a>
                    </p>
                </div>
            </footer>

        </main>

    );
}
