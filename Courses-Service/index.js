const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const XLSX = require('xlsx');
const port = process.env.PORT;  

const app = express();

app.use(express.json());

const filePath = path.join(__dirname, 'src', 'database', 'worldcities.xlsx');

app.set('views', path.join(__dirname, 'public', 'views'));
app.set('view engine', 'ejs');

app.use('/main_menu', (req, res, next) => {
    res.render('main_menu.ejs');
});

app.get('/capitals', (req, res) => {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; 
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
    const capitals = data.filter(row => row.capital === 'primary'); // doar capitale
    res.status(200).json(capitals);
});

app.listen(port, () => {
    console.log(`Courses-Service listening to port ${port}`);
});
