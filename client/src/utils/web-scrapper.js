import axios from 'axios';
import cheerio from 'cheerio';

// Function to fetch HTML content from a URL
const fetchHtmlContent = async (url) => {
 try {
  const response = await axios.get(url);
  return response.data;
 } catch (error) {
  console.error('Error fetching HTML content:', error);
  throw error;
 }
};

// Function to extract image URLs from HTML content
const extractImagesFromHtml = (htmlContent) => {
 const $ = cheerio.load(htmlContent);
 const imageUrls = [];

 // Replace 'img' with the appropriate selector for the images on the webpage
 $('img').each((index, element) => {
  const imageUrl = $(element).attr('src');
  if (imageUrl) {
   imageUrls.push(imageUrl);
  }
 });

 return imageUrls;
};

// Example usage
const url = 'https://example.com';
fetchHtmlContent(url)
 .then((htmlContent) => {
  const imageUrls = extractImagesFromHtml(htmlContent);
  console.log('Image URLs:', imageUrls);
 })
 .catch((error) => {
  console.error('Error:', error);
 });
