const express = require('express');

const app = express();

app.use(express.json());

app.use('/', (req, res, next) => {

    return res.status(200).json({"msg" :"User-Service running"})

})

app.listen(8004, () => {
    console.log('User-Service listening to port 8004')
})