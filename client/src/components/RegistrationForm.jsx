import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";

import { REGISTER_USER } from "../utils/mutations";
import { useCurrentUserContext } from "../context/CurrentUser";

const RegistrationForm = () => {
  const { loginUser } = useCurrentUserContext();
  const navigate = useNavigate();

  const countryNames = [ "World", "United States", "China", "Russia", "India", "Indonesia", "Brazil", "Pakistan", "Nigeria", "Bangladesh", "Mexico",
      "Japan", "Germany", "France", "United Kingdom", "Italy", "South Africa", "Canada", "Australia", "Argentina", "Saudi Arabia",
      "Egypt", "Turkey", "Iran", "Thailand", "South Korea", "Vietnam", "Malaysia", "Philippines", "Poland", "Ukraine",
      "Spain", "Greece", "Switzerland", "Sweden", "Austria", "Czech Republic", "Hungary", "Portugal", "Romania", "Denmark",
      "Finland", "Norway", "Ireland", "New Zealand", "Singapore" ];

  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userDefaultNews: "World",
  });

  const [selectedCountry, setSelectedCountry] = useState("World");

  const [errors, setErrors] = useState({});

  const [register, { error }] = useMutation(REGISTER_USER);

  const handleRegistrationResponse = (
    alreadyRegistered,
    currentUser,
    token,
    error
  ) => {
    if (alreadyRegistered) {
      // User is already in the database, display an alert or error message
      alert("User is already registered. Please login.");
      navigate("/login");
    } else if (currentUser && token) {
      // User is successfully registered
      loginUser(currentUser, token);
      navigate("/dashboard");
    }

    // Log any errors
    if (error) {
      console.log(error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const requiredFields = ["firstName", "lastName", "email", "password"];
    const fieldErrors = {};

    requiredFields.forEach((field) => {
      if (!formState[field]) {
        fieldErrors[field] = `${field} is required`;
      }
    });

    // Set errors if any required field is missing
    setErrors(fieldErrors);

    if (Object.keys(fieldErrors).length > 0) {
      return;
    }

    try {
      let variables = {
        firstName: formState.firstName,
        lastName: formState.lastName,
        email: formState.email,
        password: formState.password,
        userDefaultNews: formState.userDefaultNews,
      };

      if (formState.userDefaultNews === "Select a country") {
        variables.selectedCountry = formState.selectedCountry;
      }

      const mutationResponse = await register({
        variables: variables,
      });

      const { token, currentUser, alreadyRegistered } =
        mutationResponse.data.register;

      handleRegistrationResponse(alreadyRegistered, currentUser, token);
    } catch (error) {
      if (error.message.includes("E11000 duplicate key error collection")) {
        handleRegistrationResponse(true, null, null, error);
      } else {
        handleRegistrationResponse(false, null, null, error);
      }
    }
  };

  return (
    <>
      <form
        id="registration-form"
        onSubmit={handleFormSubmit}
        className="bg-newsGray p-6 rounded mx-4 h-5/6 my-5"
      >
        <h2 className="text-2xl text-center mb-5 font-bold mt-4">Register</h2>

        <label htmlFor="firstName" className="block mb-2">
          First name:
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formState.firstName}
            onChange={handleChange}
            className={`mt-1 p-2 w-full border rounded ${
              errors.firstName ? "border-red-500" : ""
            }`}
          />
          {errors.firstName && (
            <p className="text-red-500">{errors.firstName}</p>
          )}
        </label>
        <label htmlFor="lastName" className="block mb-2">
          Last name:
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formState.lastName}
            onChange={handleChange}
            className={`mt-1 p-2 w-full border rounded ${
              errors.lastName ? "border-red-500" : ""
            }`}
          />
          {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
        </label>
        <label htmlFor="email" className="block mb-2">
          Email:
          <input
            placeholder="youremail@test.com"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            className={`mt-1 p-2 w-full border rounded ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </label>
        <label htmlFor="password" className="block mb-2">
          Password:
          <input
            placeholder="******"
            name="password"
            type="password"
            value={formState.password}
            onChange={handleChange}
            className={`mt-1 p-2 w-full border rounded ${
              errors.password ? "border-red-500" : ""
            }`}
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
        </label>

        <label htmlFor="userDefaultNews" className="block relative mb-2">
          Default Country:
          <select
            name="userDefaultNews"
            value={formState.userDefaultNews}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded appearance-none"
          >
            {countryNames.map((countryName) => (
              <option key={countryName} value={countryName}>
                {countryName}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="bg-newsBlue text-white p-2 rounded hover:bg-blue-600 mt-4 w-full mb-5"
        >
          Sign Up
        </button>
        <p className="mt-4">
          Already have an account? Login{" "}
          <Link to="/login" className="text-blue-600">
            here
          </Link>
        </p>
      </form>
    </>
  );
};

export default RegistrationForm;
