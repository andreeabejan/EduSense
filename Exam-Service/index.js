const express = require('express');

const app = express();

app.use(express.json());

app.use('/', (req, res, next) => {

    return res.status(200).json({"msg" :"Exam-Service running"})

})

app.listen(8002, () => {
    console.log('Exam-Service listening to port 8002')
})