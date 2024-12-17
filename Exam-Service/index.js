const express = require('express');
require('dotenv').config();
const port = process.env.PORT;  

const app = express();

app.use(express.json());

app.use('/', (req, res, next) => {

    return res.status(200).json({"msg" :"Exam-Service running"})

})

app.listen(port, () => {
    console.log(`Exam-Service listening to port ${port}`)
})