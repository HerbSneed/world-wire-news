import  { useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  getCountryHeadlines,
  getHeadlines,
  getSelectedHeadlines,
} from "../utils/news-api";
import CountryHeader from "../components/Country-Header";
import { useCurrentUserContext } from "../context/CurrentUser";
import { QUERY_CURRENT_USER } from "../utils/queries";
import { countryCodes } from "../utils/countryCodes";
import { useParams } from "react-router-dom";

const Homepage = () => {
  const [newsItems, setNewsItems] = useState([]);
  const fetchNewsCalled = useRef(false);
  const {currentUser} = useCurrentUserContext();
  const { code: selectedCountry } = useParams();

  //QUERY_CURRENT_USER  
  const { data } = useQuery(QUERY_CURRENT_USER, {
    variables: { email: currentUser.email },
  });
  const userData = data?.currentUser || null;
  

useEffect(() => {
  const fetchNews = async () => {
    try {
      let response;

      if (!userData || (!userData.userDefaultNews && !selectedCountry)) {
        // No user data or default news and no selected country, return
        return;
      }

      const countryCodesList = countryCodes().map((country) => ({
        name: country.name,
        code: country.code,
        code3: country.code3,
      }));

      let countryCode;
      console.log("Country_Code", countryCodesList); 

      if (userData.userDefaultNews === "World" && !selectedCountry) {
        // User default is World, and no selected country, fetch world headlines
        response = await getHeadlines();
      } else if (selectedCountry === "World") {
        // Selected country is World, fetch world headlines
        response = await getHeadlines();
        console.log("Select _ World_Headline", response);
      } else {
        // Fetch headlines based on user default or selected country
        const countryObject = countryCodesList.find(
          (country) =>
            country.name ===
            (userData.userDefaultNews || selectedCountry).trim()
        );

        countryCode = countryObject ? countryObject.code : "World";
        response = await getCountryHeadlines(countryCode);
        console.log("Country_Code", countryCode);
      }

      if (!response || !response.ok) {
        console.error("Error in response:", response);
        throw new Error("something went wrong!");
      }

      const headlines = await response.json();
      console.log("Headlines", headlines);

      if (Array.isArray(headlines.articles)) {
        const newsData = headlines.articles
          .filter((news) => {
            return (
              news.title !== "[Removed]" &&
              news.status !== "410" &&
              news.status !== "404"
            );
          })
          .map((news) => ({
            newsId: news.publishedAt + news.title,
            title: news.title,
            image: news.urlToImage,
            url: news.url,
            description: news.description,
          }));

        setNewsItems(newsData);
      } else {
        console.error("Headlines is not an array:", headlines);
      }
    } catch (err) {
      console.error(err);
    } finally {
      fetchNewsCalled.current = true;
    }
  };

  fetchNews();
}, [userData, selectedCountry]);


  return (
    <>
      <section
        id="country-links"
        className="bg-white h-10 py-1 border-t-2 border-b-2 border-newsBlue overflow-hidden"
      >
        <CountryHeader />
      </section>

      <section id="top-five-hl" className="grid grid-cols-1 gap-y-2 px-2 mt-2">
        <div>
          <h2 className="text-2xl">Top News Headlines</h2>
        </div>

        {newsItems.slice(0, 5).map((news, index) => (
          <div key={news.newsId}>
            <div
              className={`border-b-2 border-newsGray ${
                index === 4 ? "last:border-b-0" : ""
              }`}
            >
              {news.image && (
                <img
                  className="w-full"
                  src={news.image}
                  alt={`Image for ${news.title}`}
                />
              )}
              <h3 className=" font-bold">
                {news.title}
              </h3>
            </div>
          </div>
        ))}
      </section>

      <section id="more-news-hl" className="grid grid-cols-1 gap-y-2 px-2 mt-2">
        <div>
          <h2 className="text-2xl">More News Headlines</h2>
        </div>
        {newsItems.slice(5, 20).map((news, index) => (
          <div key={news.newsId}>
            <div
              className={`border-b-2 border-newsGray ${
                index === newsItems.length - 1 ? "last:border-b-0" : ""
              }`}
            >
              <h3 className="flex justify-right font-bold p-1">
                {news.title}
              </h3>
              <a className=""> Source </a>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default Homepage;
