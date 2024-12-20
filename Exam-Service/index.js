const express = require('express');
require('dotenv').config();
const path = require('path');
const analyzeSentiment = require('./analyse_sentiment.js');
const port = process.env.PORT;  

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


app.set('views', path.join(__dirname, 'public', 'views'));
app.set('view engine', 'ejs');

app.get('/capitals-exam', (req, res) => {
    res.render('capitals_exam');
});

// app.post('/analyze', (req, res) => {
//     const text = req.body.text;
//     if (!text) {
//         return res.status(400).send({ error: 'Text is required for sentiment analysis' });
//     }

//     const sentiment = analyzeSentiment(text);
//     console.log(sentimet);
//     res.json({ response : sentiment});
// });


app.use('/', (req, res, next) => {

    return res.status(200).json({"msg" :"Exam-Service running"})

});

app.listen(port, () => {
    console.log(`Exam-Service listening to port ${port}`)
})