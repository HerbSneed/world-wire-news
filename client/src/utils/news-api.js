var apiKey = "72854b184e9b4fb88d7b85d9362f3e4a";

export const getHeadlines = async () => {
  return fetch(`https://newsapi.org/v2/everything?q=headlines&apiKey=${apiKey}`);
};

export const getCountryHeadlines = async (countryCode) => {
  return fetch(`https://newsapi.org/v2/top-headlines?q=${countryCode}&apiKey=${apiKey}`);
}

