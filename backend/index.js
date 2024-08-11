const express = require('express')
const app = express()
require('dotenv').config()
const db = require('./db')
const authRoute = require('./routes/auth.route')
const bodyParser = require('body-parser')
const cors = require('cors')


app.use(bodyParser.json())
app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
  res.send('Hello Welcome to my blog')
})
app.use('/api/auth',authRoute)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})

app.use((err,req,res,next) => {
  const stauscode = err.stauscode || 500;
  const message = err.message || "Internal server error";

  res.status(stauscode).json({
    scuccess : false,
    stauscode,
    message
  })
})