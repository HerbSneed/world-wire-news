import  { useEffect, useRef, useState } from "react";
import { getHeadlines } from "../utils/news-api";
import { getCountryHeadlines } from "../utils/news-api";  
import MarqueeText from "react-marquee-text";

const CountryHeader = () => {
  const [selectedCountry, setSelectedCountry] = useState("USA");
const countryCodes = [
  "USA", "CHN","RUS", "IND", "IDN", "BRA", "PAK", "NGA", "BGD", "MEX", "JPN", "DEU", "FRA", "GBR", "ITA", "ZAF", "CAN", "AUS", "ARG", "SAU", "EGY", "TUR", "IRN", "THA", "KOR", "VNM", "MYS", "PHL", "POL", "UKR", "ESP", "GRC", "CHE", "SWE", "AUT", "CZE", "HUN", "PRT","ROU", "DNK", "FIN", "NOR", "IRL", "NZL", "SGP",
];


  return (
    <>
      <div className="flex py-1.5 px-2 justify-start">
        {countryCodes.map((countryCode, index) => (
          <a className="mr-1" key={index} href={`#/${countryCode}`}>
            {countryCode}
          </a>
        ))}
      </div>
    </>
  );

};

export default CountryHeader;