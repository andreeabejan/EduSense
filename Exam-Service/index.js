const express = require('express');
require('dotenv').config();
const path = require('path');
const port = process.env.PORT;  

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


app.set('views', path.join(__dirname, 'public', 'views'));
app.set('view engine', 'ejs');

app.get('/capitals-exam', (req, res) => {
    res.render('capitals_exam');
});

app.use('/', (req, res, next) => {

    return res.status(200).json({"msg" :"Exam-Service running"})

});

app.listen(port, () => {
    console.log(`Exam-Service listening to port ${port}`)
})