import React, { useState, useEffect, useCallback } from "react";
import "./University.css";
const DebouncedDropdownWithCountry = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch the data from the API
    fetch("http://universities.hipolabs.com/search")
      .then((response) => response.json())
      .then((data) => {
        // Set the items state with the fetched data
        setItems(data);
      })
      .catch((error) => {
        console.error(error);
      });

    // Set the country list state
    setCountryList([
      { id: "IN", name: "India" },
      { id: "GB", name: "United Kingdom" },
      { id: "US", name: "United States" },
      { id: "CA", name: "Canada" },
      { id: "MX", name: "Mexico" },
      { id: "CN", name: "China" },
      { id: "FR", name: "France" },
    ]);
  }, []);

  const handleSearchChange = useCallback(
    (event) => {
      const searchText = event.target.value;

      setTimeout(() => {
        const filteredItems = items.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) &&
            item.alpha_two_code === selectedCountry
        );
        setFilteredItems(filteredItems);
      }, 500);

      setSearchText(searchText);
    },
    [items, selectedCountry]
  );

  const handleCountryChange = useCallback(
    (event) => {
      const selectedCountry = event.target.value;

      // Debounce the country selection to prevent excessive filtering
      setTimeout(() => {
        const filteredItems = items.filter(
          (item) =>
            item.country === selectedCountry &&
            item.name.toLowerCase().includes(searchText.toLowerCase())
        );

        setFilteredItems(filteredItems);
      }, 500);

      setSelectedCountry(selectedCountry);
    },
    [items, searchText]
  );

  return (
    <div className="University">
      <div>
        <select value={selectedCountry} onChange={handleCountryChange}>
          <option value="">Select a country</option>
          {countryList.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Search Your University Here:</label>&nbsp;
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          disabled={!selectedCountry}
        />
        <ul>
          {filteredItems.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DebouncedDropdownWithCountry;
