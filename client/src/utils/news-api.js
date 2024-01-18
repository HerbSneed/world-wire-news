var apiKey = "72854b184e9b4fb88d7b85d9362f3e4a";
var apiKey2 = "c8b7b4b0c8b04b6e9b7b4b0c8b04b6e9";
var apiKey3 = "0aa43dd5018e4447ac45d86caf10d084";

export const getHeadlines = async () => {
  return fetch(`https://newsapi.org/v2/everything?q=headlines&apiKey=${apiKey3}`);
};

export const getCountryHeadlines = async (countryCode) => {
  return fetch(`https://newsapi.org/v2/top-headlines?country=${countryCode}&apiKey=${apiKey3}`);
}


