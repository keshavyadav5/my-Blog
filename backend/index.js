const express = require('express')
const app = express()
require('dotenv').config()
const db = require('./db')

app.get('/',(req,res)=>{
  res.send('Hello Welcome to my blog')
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})