const express = require('express')
const app = express();
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors');
const router= require('./Router/nodemailer');


app.use(cors());
dotenv.config();

const port = process.env.PORT || 5002

mongoose.connect(process.env.Mongo_URL).then((data)=> {
    console.log("database connected");
}).catch((err) => {
    console.log("error", err);
})


app.use(express.json());
app.use('/nodemailer', router)

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})
console.log('data');