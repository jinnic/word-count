const mongoose = require('mongoose')
const {isValidUrl, getUrlData} = require('../helpers')

const urlSchema =  new mongoose.Schema({
  address: {
    type: String,
    trim: true,
    required: true,
    validate(value){
      try{
        isValidUrl(value)
      }catch(e){
        throw new Error('Invalid URL address: ', e )
      }
    }
  },
  words: {
    type: mongoose.Schema.Types.Mixed
  },
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
},{timestamps: true})

// scrape text from url 
// count the words
// before .save()
urlSchema.pre('save', async function(next){
  const url = this
  if(url.isModified('address')){
    url.words = await getUrlData(url.address)
  }
  next()
})



const Url = mongoose.model('Url', urlSchema)


module.exports = Url