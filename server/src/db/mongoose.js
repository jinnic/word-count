const mongoose = require('mongoose')
//mongodb://localhost
mongoose.connect('mongodb://127.0.0.1:27017/word-count-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

