import React,  { useState } from "react";
import { useNavigate } from "react-router-dom";
import { countryCodes } from "../utils/countryCodes";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CountryHeader = () => {
  const [selectedCountry, setSelectedCountry] = useState("WLD"); // Set to "World" initially
  const navigate = useNavigate();

  const handleCountryClick = (countryCode) => {
    setSelectedCountry(countryCode);
    navigate(`/homepage/${countryCode}`); // Include country code in the navigation
  };

    const sliderSettings = {
      className: "slider",
      centerPadding: "",
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 7, // Set the number of slides to show
      slidesToScroll: 7,
      arrows: false,
    };

  return (
    <div className="">
      <Slider {...sliderSettings}>
        {countryCodes.map((country, index) => (
          <button
            className={`${country.code === selectedCountry ? "font-bold" : ""}`}
            key={index}
            onClick={() => handleCountryClick(country.code)}
          >
            {country.code3} 
          </button>
        ))}
      </Slider>
    </div>
  );
};

export default CountryHeader;