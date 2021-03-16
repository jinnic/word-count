const axios = require('axios');
const cheerio = require('cheerio');
const wordCount = require('./wordCount')

const getUrlData =(url)=>{
  return axios.get(url)
              .then(res => {
                // if content is text don't scrape
                // else scrape text using cheerio
                if(res.headers['content-type'] === 'text/plain'){
                  return wordCount(res.data)
                }else{   
                  const text = getData(res.data)
                  return wordCount(text)
                }
              })
              .catch(e => console.log(e))

} 

// scrape text in 
// h1,h2,h3,h4,h5,p,li,a,span
const getData = (html) =>{
  data = [];
  const $ = cheerio.load(html)
  $("h1,h2,h3,h4,h5,p,li,a,span").each((i, ele) =>{
    data[i] = $(ele).text()
  })
  return data.join(' ')
}

module.exports = getUrlData