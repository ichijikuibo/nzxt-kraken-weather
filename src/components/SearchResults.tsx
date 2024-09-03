import React, { useEffect, useState } from "react";
import { LatLng } from "../model/LatLng";
import { SearchResult } from "../model/SearchResult";
const url = "https://geocoding-api.open-meteo.com/v1/search";

interface SearchResultsProps {
  searchQuery: string;
  resultSelcted: (result: SearchResult) => void;
}

function SearchResults({ searchQuery, resultSelcted }: SearchResultsProps) {
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>();

  const fetchSearchResults = (query: string) => {
    if (query.length > 0) {
      const params = {
        name: query,
      };
      fetch(url + "?" + new URLSearchParams(params).toString(), {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          setSearchResults(data.results);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };
  useEffect(() => {
    fetchSearchResults(searchQuery);
  }, [searchQuery]);

  return (
    <table className="searchResults">
      <thead>
        <tr>
          <th>Name</th>
          <th>Country</th>
          <th>Latitude</th>
          <th>Longitude</th>
        </tr>
      </thead>
      <tbody>
        {searchResults?.map((result) => (
          <tr
            key={result.id}
            onClick={() => resultSelcted(result)}
            className="resultRow"
          >
            <td>{result.name}</td>
            <td>{result.country}</td>
            <td>{result.latitude}</td>
            <td>{result.longitude}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default SearchResults;
