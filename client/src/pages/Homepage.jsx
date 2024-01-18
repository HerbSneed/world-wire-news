import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  getCountryHeadlines,
  getHeadlines,
  // getSelectedHeadlines,
} from "../utils/news-api";
import CountryHeader from "../components/Country-Header";
import { useCurrentUserContext } from "../context/CurrentUser";
import { QUERY_CURRENT_USER } from "../utils/queries";
import { SAVE_NEWS } from "../utils/mutations";
import { useParams } from "react-router-dom";

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


const Homepage = () => {
  const [newsItems, setNewsItems] = useState([]);
  const fetchNewsCalled = useRef(false);
  const { currentUser } = useCurrentUserContext();
  const { code: selectedCountry } = useParams();
  const [saveNewsMutation] = useMutation(SAVE_NEWS);

  // QUERY_CURRENT_USER
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

        let countryCode;

        if (userData.userDefaultNews === "World" && !selectedCountry) {
          // User default is World, and no selected country, fetch world headlines
          response = await getHeadlines();
        } else if (selectedCountry === "World") {
          // Selected country is World, fetch world headlines
          response = await getHeadlines();
        } else if (userData.userDefaultNews  === countryCodesList.name) {
            let userCountryCode = countryCodesList.code;
            response = await getCountryHeadlines(userCountryCode);
            
        } else {
          const selectedCountryTrimmed = selectedCountry
            ? selectedCountry.trim()
            : null;

          countryCode = selectedCountryTrimmed;

          response = await getCountryHeadlines(countryCode);
        }

        if (!response || !response.ok) {
          console.error("Error in response:", response);
          throw new Error("something went wrong!");
        }

        const headlines = await response.json();


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
              summary: news.description || "Summary not available.",
              source_country: news.source.name,
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

const handleSaveArticle = (news) => {
  // Call the mutation to save the news
  saveNewsMutation({
    variables: {
      saveNews: {
        newsId: news.newsId,
        title: news.title,
        summary: news.summary,
        source_country: news.source_country,
        url: news.url,
        image: news.image,
        language: news.language,
        latest_publish_date: news.latest_publish_date,
      },
    },
  })
    .then((response) => {
      // Handle the response, update UI, etc.
    })
    .catch((error) => {
      // Handle errors
      console.error(error);
    });
};

  

  return (
    <>
      <section
        id="country-links"
        className="bg-white h-10 flex flex-col justify-center border-b-2 border-newsBlue overflow-hidden "
      >
        <CountryHeader />
      </section>

      <section
        id="top-five-hl"
        className="grid grid-cols-1 gap-y-2 py-2 px-2 mt-3 mx-2 border-2 rounded border-newsBlue bg-gray-200"
      >
        <div>
          <h2 className="text-3xl font-semibold">Top News Headlines</h2>
        </div>

        {newsItems.slice(0, 6).map((news, index) => (
          <div key={news.newsId} className="">
            <div
              className={`border-b-2 border-newsBlue ${
                index === 5 ? "last:border-b-0" : ""
              }`}
            >
              {news.image && (
                <img
                  className="w-full"
                  src={news.image}
                  alt={`Image for ${news.title}`}
                />
              )}
              {/* Wrap the title in an anchor tag */}
              <h3 className="font-bold my-2">
                <a href={news.url} target="_blank" rel="noopener noreferrer">
                  {news.title}
                </a>
              </h3>

              <h4>
                <div className="flex justify-between mb-2">
                  <a
                    href={news.url}
                    target="_blank"
                    className="text-blue-600"
                    rel="noopener noreferrer"
                  >
                    Source
                  </a>
                  <a
                    target="_blank"
                    className="text-red-600"
                    onClick={() => handleSaveArticle(news)}
                    rel="noopener noreferrer"
                  >
                    Save Article
                  </a>
                </div>
              </h4>
            </div>
          </div>
        ))}

        {newsItems.length === 0 && (
          <p className="text-gray-500">
            There is no available news for this country.
          </p>
        )}
      </section>

      <section
        id="more-news-hl"
        className="grid grid-cols-1 gap-y-2 py-2 px-2 mt-3 mx-2 border-2 rounded border-newsBlue bg-gray-200"
      >
        <div>
          <h2 className="text-2xl font-semibold">More News Headlines</h2>
        </div>

        {newsItems.slice(5, 20).map((news, index) => (
          <div key={news.newsId}>
            <div
              className={`border-b-2 border-newsBlue ${
                index === newsItems.length - 1 ? "last:border-b-0" : ""
              }`}
            >
              {/* Wrap the title in an anchor tag */}
              <h3 className="flex justify-right font-bold p-1">
                <a href={news.url} target="_blank" rel="noopener noreferrer">
                  {news.title}
                </a>
              </h3>
              <h4>
                <div className="flex justify-between mb-2">
                  <a
                    href={news.url}
                    target="_blank"
                    className="text-blue-600"
                    rel="noopener noreferrer"
                  >
                    Source
                  </a>
                  <a
                    target="_blank"
                    className="text-red-600"
                    onClick={() => handleSaveArticle(news)}
                    rel="noopener noreferrer"
                  >
                    Save Article
                  </a>
                </div>
              </h4>
            </div>
          </div>
        ))}

        {newsItems.length === 0 && (
          <p className="text-gray-500">
            There is no available news for this country.
          </p>
        )}
      </section>
    </>
  );
};

export default Homepage;