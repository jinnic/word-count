const express = require('express')
const cors = require("cors");

require('./db/mongoose')

const userRouter = require('./router/user')
const urlRouter = require('./router/url')
const app = express()

const port = 4000

app.use(cors());

app.use(express.json())
app.use(userRouter)
app.use(urlRouter)

app.listen(port, ()=>{
  console.log('Server is up on the port '+ port)
})
