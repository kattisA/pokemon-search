import React from 'react';

interface Props {
    searchValue: string;
    setSearchValue: (value: string) => void;
    handleSearch: (event: React.FormEvent) => void;
}

const SearchBar = (props: Props) => {
    return (
        <form onSubmit={props.handleSearch}>
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
                    className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-yellow-focus focus:yellow-border dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:dark-yellow-border"
                    placeholder="Search Pokémon..."
                    value={props.searchValue}
                    onChange={(e) => props.setSearchValue(e.target.value)}
                    required
                />
                <button type="submit"
                        className="
                        text-dark absolute right-2.5 bottom-2.5 bg-yellow-custom hover:bg-yellow-custom-dark focus:ring-4 focus:outline-none focus:ring-yellow-focus font-medium rounded-lg text-sm px-4 py-2
                        dark:bg-dark-yellow-custom dark:hover:bg-dark-yellow-custom-hover dark:focus:ring-dark-yellow-focus">
                    Search
                </button>
            </div>
        </form>
    );
}

export default SearchBar;
