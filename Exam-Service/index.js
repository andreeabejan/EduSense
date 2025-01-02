const express = require('express');
require('dotenv').config();
const path = require('path');
const analyzeSentiment = require('./analyse_sentiment.js');
const processFeedback = require('./controllers/process-feedback');
const port = process.env.PORT;  

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


app.set('views', path.join(__dirname, 'public', 'views'));
app.set('view engine', 'ejs');

app.get('/capitals-exam', (req, res) => {
    res.render('capitals_exam');
});

app.get('/feedback', (req,res) => {
    res.render('feedback');
})


app.post('/process-feedback', (req, res) => {
    const userFeedback = req.body.feedback; 

    if (userFeedback) {
        const result = processFeedback(userFeedback);

        res.json(result);
    } else {
        res.json({
            success: false,
            error: "Nu ai furnizat niciun feedback."
        });
    }
});


app.use('/', (req, res, next) => {

    return res.status(200).json({"msg" :"Exam-Service running"})

});

app.listen(port, () => {
    console.log(`Exam-Service listening to port ${port}`)
})