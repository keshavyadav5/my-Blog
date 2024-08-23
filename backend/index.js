const express = require('express')
const app = express()
require('dotenv').config()
const db = require('./db')
const authRoute = require('./routes/auth.route')
const userRoute = require('./routes/user.route')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')


app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json())

app.get('/',(req,res)=>{
  res.send('Hello Welcome to my blog')
})
app.use('/api/auth',authRoute)
app.use('/api/user',userRoute)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500; 
  const message = err.message || "Internal server error";
  
  return res.status(statusCode).json({
    success: false,
    error : true,
    statusCode,
    message,
  });
});
