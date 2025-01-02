const express = require('express');
require('dotenv').config();
const path = require('path');
const analyzeSentiment = require('./analyse_sentiment.js');
const processFeedback = require('./controllers/process-feedback');
const XLSX = require('xlsx');
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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
    }
    return array;
}

app.get('/questions', (req, res) => {
    const filePath = path.join(__dirname, 'src', 'database', 'worldcities.xlsx');
    
    const workbook = XLSX.readFile(filePath);
    
    const sheet = workbook.Sheets[workbook.SheetNames[0]]; 
    
    const citiesData = XLSX.utils.sheet_to_json(sheet);
    
    //here will set the population accordingly to the user's set level of the course in the database
    const minPopulation = 5000011; //5000000 max
    const filteredCities = citiesData.filter(city => city.population > minPopulation);
    
    const questions = [];
    
    filteredCities.forEach(city => {
        if (city.capital && city.capital.toLowerCase() === "primary") {
            questions.push({
                question: `What is the capital of ${city.country}?`,  
                answer: city.city  
            });
        }
    });
    const randomQuestions = shuffleArray(questions).slice(0, 10);

    res.json(randomQuestions);
});


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