import { Link } from 'react-router-dom';
import { useCurrentUserContext } from '../context/CurrentUser';
import logo from '../../src/assets/WorldWire-Icon.png';
import { Accordion } from 'flowbite-react';
import { useQuery } from '@apollo/client';
import { QUERY_CURRENT_USER } from '../utils/queries';

function Header() {
  const countryCodesList = [
  { code: "World", name: "World", code3: "WORLD" },
  { code: "US", name: "United States", code3: "USA" },
  { code: "CN", name: "China", code3: "CHN" },
  { code: "RU", name: "Russia", code3: "RUS" },
  { code: "IN", name: "India", code3: "IND" },
  { code: "ID", name: "Indonesia", code3: "IDN" },
  { code: "BR", name: "Brazil", code3: "BRA" },
  { code: "PK", name: "Pakistan", code3: "PAK" },
  { code: "NG", name: "Nigeria", code3: "NGA" },
  { code: "BD", name: "Bangladesh", code3: "BGD" },
  { code: "MX", name: "Mexico", code3: "MEX" },
  { code: "JP", name: "Japan", code3: "JPN" },
  { code: "DE", name: "Germany", code3: "DEU" },
  { code: "FR", name: "France", code3: "FRA" },
  { code: "GB", name: "United Kingdom", code3: "GBR" },
  { code: "IT", name: "Italy", code3: "ITA" },
  { code: "ZA", name: "South Africa", code3: "ZAF" },
  { code: "CA", name: "Canada", code3: "CAN" },
  { code: "AU", name: "Australia", code3: "AUS" },
  { code: "AR", name: "Argentina", code3: "ARG" },
  { code: "SA", name: "Saudi Arabia", code3: "SAU" },
  { code: "EG", name: "Egypt", code3: "EGY" },
  { code: "TR", name: "Turkey", code3: "TUR" },
  { code: "IR", name: "Iran", code3: "IRN" },
  { code: "TH", name: "Thailand", code3: "THA" },
  { code: "KR", name: "South Korea", code3: "KOR" },
  { code: "VN", name: "Vietnam", code3: "VNM" },
  { code: "MY", name: "Malaysia", code3: "MYS" },
  { code: "PH", name: "Philippines", code3: "PHL" },
  { code: "PL", name: "Poland", code3: "POL" },
  { code: "UA", name: "Ukraine", code3: "UKR" },
  { code: "ES", name: "Spain", code3: "ESP" },
  { code: "GR", name: "Greece", code3: "GRC" },
  { code: "CH", name: "Switzerland", code3: "CHE" },
  { code: "SE", name: "Sweden", code3: "SWE" },
  { code: "AT", name: "Austria", code3: "AUT" },
  { code: "CZ", name: "Czech Republic", code3: "CZE" },
  { code: "HU", name: "Hungary", code3: "HUN" },
  { code: "PT", name: "Portugal", code3: "PRT" },
  { code: "RO", name: "Romania", code3: "ROU" },
  { code: "DK", name: "Denmark", code3: "DNK" },
  { code: "FI", name: "Finland", code3: "FIN" },
  { code: "NO", name: "Norway", code3: "NOR" },
  { code: "IE", name: "Ireland", code3: "IRL" },
  { code: "NZ", name: "New Zealand", code3: "NZL" },
  { code: "SG", name: "Singapore", code3: "SGP" },
  // Add more countries as needed
];
  const { isLoggedIn, logoutUser } = useCurrentUserContext();
  const { currentUser } = useCurrentUserContext();

  const { loading, data } = useQuery(QUERY_CURRENT_USER, {
    variables: { email: currentUser.email },
  });
  const userData = data?.currentUser || null;

const handleHomepageClick = (event) => {
  event.preventDefault();
  let userCountryCode;

  if (isLoggedIn() && userData.userDefaultNews) {
    userCountryCode = countryCodesList.find(
      (country) => country.name === userData.userDefaultNews
    );

    if (userCountryCode) {
      console.log("User country code:", userCountryCode.code);
      console.log(
        "User default news:",
        userData.userDefaultNews.name +
          " " +
          userData.userDefaultNews.code
      );

      // Navigate to the homepage with the user's country code
      window.location.href = `/homepage/${userCountryCode.code}`;
    } else {
      console.error("User country code not found");
    }
  } else {
    // Navigate to the default homepage if not logged in or no default news
    window.location.href = "/homepage";
  }
};

  return (
    <nav className="relative border-b-2 border-newsBlue w-full bg-[#FBFBFB] h-20 text-neutral-500 shadow-lg hover:text-neutral-700 focus:text-neutral-700 dark:bg-neutral-600 lg:py-2">
      <div className="flex w-full justify-between items-center ">
        <div className="">
          <Link to={`/homepage/`}>
            <img src={logo} className="w-10 sm:w-14" alt="WorldWire Icon" />
            <h1 className="ml-3 text-lg hidden font-bold">WORLD WIRE</h1>
          </Link>
        </div>


        {isLoggedIn() ? (
          <div className="mt-1 mr-1">
            <Link
              to="/homepage"
              className="text-blue-600 ml-3"
              onClick={handleHomepageClick}
            >
              Home
            </Link>
            <Link to="/dashboard" className="text-blue-600 ml-3">
              Dashboard
            </Link>
            <button
              type="button"
              className="text-blue-600 ml-3"
              onClick={logoutUser}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="py-2 mr-3">
            <Link to="/login" className="text-blue-600 mr-3">
              Login
            </Link>
            <Link to="/register" className="text-blue-600">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Header;
