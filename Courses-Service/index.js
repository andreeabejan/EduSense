const express = require('express');
require('dotenv').config();
const port = process.env.PORT;  

const app = express();

app.use(express.json());

app.use('/', (req, res, next) => {

    return res.status(200).json({"msg" :"Courses-Service running"})

})

app.listen(port, () => {
    console.log(`Courses-Service listening to port ${port}`)
})