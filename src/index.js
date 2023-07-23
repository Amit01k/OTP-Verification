require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const route = require('./Routes/route.js')
app.use(bodyParser.json())
app.use('/', route)
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/post', (req, res) => {
    res.send(req.body)
})

//adding mongodb connection string 
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
})
.then(() => console.log("Mongo connected successfully"))
.catch(error => console.log(error))

//application is running 
port=process.env.PORT||8080

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})