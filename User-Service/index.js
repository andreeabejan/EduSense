const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
require('dotenv').config();
const port = process.env.PORT;  

const app = express();

const pool = new Pool({
    user: 'postgres',    
    host: 'localhost',
    database: 'EduSense',
    password: 'student', 
    port: 5432,  //port implicit pe care PostgreSQL acceptă conexiuni
});

app.use(express.urlencoded({ extended: false }));

app.use(express.static('public')); 
app.set('views', path.join(__dirname, 'public', 'views'));
app.set('view engine', 'ejs');


app.get('/login', (req, res) => {
    res.render('login.ejs')
});

app.get('/create_account', (req, res) => {
    res.render('create_account.ejs')
});

// app.get('/profile', (req, res) =>{
//     res.render('profile.ejs',{nume : user_name})
// })

app.post('/login', async (req, res) => { //async pt try-catch
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email și parola sunt obligatorii.');
    }

    try {

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(400).send('Email sau parolă greșite.');
        }

        const user = result.rows[0];

        if (await bcrypt.compare(password, user.password)) {
            res.send('Autentificare reușită!');
        } else{
            return res.status(400).send('Email sau parolă greșite.');
        }

    } catch (err) {
        console.error('Eroare la verificarea utilizatorului:', err);
        res.status(500).send('A apărut o eroare.');
    }
});

app.post('/create_account', async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).send('Toate câmpurile sunt obligatorii.');
    }

    try {
        const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (checkUser.rows.length > 0) {
            return res.status(400).send('Contul cu acest email există deja.');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        await pool.query('INSERT INTO users (email, username, password) VALUES ($1, $2, $3)', [email, username, hashedPassword]);
        
        res.redirect('/login');

    } catch (err) {
        console.error('Eroare la salvarea în baza de date:', err);
        res.status(500).send('A apărut o eroare.');
    }
});


app.listen(port, () => {
    console.log(`User-service listening to port ${port}`);
});

