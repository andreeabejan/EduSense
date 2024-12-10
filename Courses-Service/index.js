const express = require('express');

const app = express();

app.use(express.json());

app.use('/', (req, res, next) => {

    return res.status(200).json({"msg" :"Courses-Service running"})

})

app.listen(8001, () => {
    console.log('Courses-Service listening to port 8001')
})