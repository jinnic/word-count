const wordCount= (text) =>{
  const dictionary = {};
  const words = text.toLowerCase().split(/\W+/)
  const keys = [];
  
  for(let i = 0; i< words.length; i++){
    let word = words[i];

    //check if word is not a number
    if(isNaN(words[i])){
      if (dictionary[word] === undefined) {
        dictionary[word] = 1;
        keys.push(word);
      } else {
        dictionary[word]++;
      }
    }
    
  }

  // sort keys by most occuring word and alphabetically
  keys.sort((a, b)=>{
    if(dictionary[b] > dictionary[a]) return 1
    else if(dictionary[b] < dictionary[a]) return -1
    else{
      if(a > b) return 1;
      else if(a < b) return -1;
      else return 0
    }
  });
  

  // sort dictionary by sorted keys
  const sortedDic = {}
  for (let i = 0; i < keys.length; i++) {
    sortedDic[keys[i]] = dictionary[keys[i]]
  }
  return sortedDic
}

module.exports = wordCount