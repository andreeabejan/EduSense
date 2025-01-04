const express = require('express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const XLSX = require('xlsx');
const port = process.env.PORT;  
const UserModel = require('./src/database/models/User');
const port_gateway = process.env.GATEWAY_PORT;

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const filePath = path.join(__dirname, 'src', 'database', 'worldcities.xlsx');

app.set('views', path.join(__dirname, 'public', 'views'));
app.set('view engine', 'ejs');

app.use('/main_menu', (req, res, next) => {
    res.render('main_menu.ejs');
});

const countries = require('i18n-iso-countries');

const fallbacks = {
    'Kosovo': 'xk',
    'Palestine': 'ps',
};

const generateFlagUrl = (countryName) => {
    const isoCode = countries.getAlpha2Code(countryName, 'en') || fallbacks[countryName];
    if (!isoCode) return '';
    return `https://flagcdn.com/w320/${isoCode.toLowerCase()}.png`;
};

app.get('/capitals', (req, res) => {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // const excludedCountries = ['Korea, South', 'Congo (Kinshasa)', 'Burma', 'Côte d’Ivoire', 'Korea, North', 'Syria', 'Congo (Brazzaville)', 
    //     'Burma', 'Laos', 'Moldova', 'Gaza Strip',' Gambia, The', 'Bahamas, The', 'Praia', 'Brunei', 'Côte d’Ivoire', 'Saint Martin', 'Saint Barthelemy',
    //     'Falkland Islands (Islas Malvinas)','Sint Maarten', 'Svalbard', 'Cabo Verde', 'Vatican City', 'Saint Helena, Ascension, and Tristan da Cunha',
    //      'South Georgia And South Sandwich Islands', 'U.S. Virgin Islands', 'Gambia, The'];  // tari pentru care nu a gasit steag
    const excludedCountries = [];
    const capitals = data
        .filter(row => row.capital === 'primary' && !excludedCountries.includes(row.country))
        .map(row => ({
            country: row.country || 'Unknown',
            capital: row.city || 'Unknown',
            flagUrl: generateFlagUrl(row.country || 'Unknown'),
        }));

    res.render('capitals_course', { capitals, port_gateway });
});

app.get('/user-level', async (req, res) => {
    try {
        const course = 'capitals'; 
        const level = await UserModel.getCourseLevel(req, course);
        res.json({ level });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


app.listen(port, () => {
    console.log(`Courses-Service listening to port ${port}`);
});
