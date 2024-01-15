import  { useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { getCountryHeadlines, getHeadlines } from "../utils/news-api";
import CountryHeader from "../components/Country-Header";
import { useCurrentUserContext } from "../context/CurrentUser";
import { QUERY_CURRENT_USER } from "../utils/queries";
import { countryCodes } from "../utils/countryCodes";

const Homepage = () => {
  const [newsItems, setNewsItems] = useState([]);
  const fetchNewsCalled = useRef(false);
  const {currentUser} = useCurrentUserContext();

  const { data } = useQuery(QUERY_CURRENT_USER, {
    variables: { email: currentUser.email },
  });
  const userData = data?.currentUser || null;
  

useEffect(() => {
  const fetchNews = async () => {
    try {
      if (!userData || !userData.userDefaultNews) {
        return;
      }
      const countryCodesList = countryCodes().map((country) => ({
      name: country.name,
      code: country.code,
    }));

      let response;

      const countryObject = countryCodesList.find(
        (country) => country.name === userData.userDefaultNews.trim()
      );

      console.log("Found Country Object:", countryObject);

      const countryCode = countryObject ? countryObject.code : "World";
      console.log("Final Country Code:", countryCode);

      if (userData.userDefaultNews === "World") {
        response = await getHeadlines();
      } else {
        response = await getCountryHeadlines(countryCode);
      }


      if (!response || !response.ok) {
        console.error("Error in response:", response);
        throw new Error("something went wrong!");
      }

      console.log("Response:", response)

      const headlines = await response.json();


if (Array.isArray(headlines.articles)) {
  const newsData = headlines.articles
    .filter((news) => {
      // Check if the image URL is not null and does not include "410"
    return news.urlToImage !== null && news.status !== "410";
    })
    .map((news) => ({
      newsId: news.publishedAt + news.title,
      title: news.title,
      image: news.urlToImage,
      url: news.url,
    }));

  console.log("News Data:", newsData);

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

  // Trigger the news fetch only if userData is available
  if (userData) {
    fetchNews();
  }
}, [userData]);



  return (
    <>
      <section
        id="country-links"
        className="bg-white h-10 py-1 border-t-2 border-b-2 border-newsBlue overflow-hidden"
      >
        <CountryHeader/>
      </section>

      <section id="top-five-hl" className="grid grid-cols-1 gap-y-2 px-2 mt-2">
        {newsItems
          .slice(0, 5)
          .filter((news) => news.image) // Filter out items with null image
          .map((news, index) => (
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
                <h3 className="flex justify-center text-center font-medium p-1">
                  {news.title}
                </h3>
              </div>
            </div>
          ))}
      </section>

      <section id="more-news-hl" className="grid grid-cols-1 gap-y-2 px-2 mt-2">
        <div>
          <h2 className="border-t-2 border-b-2 py-1 border-newsBlue h-10 font-bold">
            {" "}
            More News Headlines
          </h2>
        </div>
        {newsItems.slice(6, 11).map((news, index) => (
          <div key={news.newsId}>
            <div
              className={`border-b-2 border-newsGray ${
                index === 4 ? "last:border-b-0" : ""
              }`}
            >
              <h3 className="flex justify-right font-medium p-1">
                {news.title}
              </h3>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default Homepage;
