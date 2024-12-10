const express = require('express');

const app = express();

app.use(express.json());

app.use('/', (req, res, next) => {

    return res.status(200).json({"msg" :"Feedback-Service running"})

})

app.listen(8003, () => {
    console.log('Feedback-Service listening to port 8003')
})