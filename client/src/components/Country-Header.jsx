// CountryHeader.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { countryCodes } from "../utils/countryCodes";

const CountryHeader = () => {
  const [selectedCountry, setSelectedCountry] = useState("USA");
  const navigate = useNavigate();

  const handleCountryClick = (countryCode) => {
    setSelectedCountry(countryCode);
    navigate(`/homepage/${countryCode}`); // Navigate to the selected country
  };

  return (
    <div className="flex py-1.5 px-2 justify-start">
      {countryCodes().map((country, index) => (
        <button
          className={`mr-1 ${country.code === selectedCountry ? "font-bold" : ""}`}
          key={index}
          onClick={() => handleCountryClick(country.code)}
        >
          {country.code3}
        </button>
      ))}
    </div>
  );
};

export default CountryHeader;
