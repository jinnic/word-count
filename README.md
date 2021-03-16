# Overview #

This app takes a 'URL' input from the user, and returns word count.

## Client - React.js ##
After logging in, user can add 'URL' and full list of word count will appear.
When URL was added more then 10, only recent 10 will show.


## Server - Express.js & MongoDB##
User -< Url model with child referancing. Scrapping text from an URL using 'Cheerio' you can scrape words in 'h1,h2,h3,h4,h5,p,li,a,span' tags. 
CRUD for both User and Url model.

### word countinng API feature
*All url request needs user's id
GET the word count for an URL `localhost:4000/urls/:id`
GET 10 most recent urls, sorted in DESC `localhost:4000/urls?limit=10sortBy=createdAt:desc`

## Running the Project ##
1. `npm install`
2. `npm run dev` for server http://localhost:4000
3. `npm start` for client http://localhost:3000/