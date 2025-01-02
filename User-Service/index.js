const express = require('express');
const session = require('express-session');
const path = require('path');
const UserModel = require('./src/database/user_model'); 
const bcrypt = require('bcrypt');
require('dotenv').config();
const port = process.env.PORT;  
const port_courses = process.env.PORT_COURSES;
const port_gateway = process.env.PORT_GATEWAY;


const app = express();

app.use(session({
    secret: 'ceva-cheie-secreta',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,           
        maxAge: 24 * 60 * 60 * 1000 // 1 zi
    }
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public')); 
app.set('views', path.join(__dirname, 'public', 'views'));
app.set('view engine', 'ejs');

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Eroare la distrugerea sesiunii:', err);
            return res.status(500).send('A apărut o eroare.');
        }
        // res.redirect('/login'); 
        res.render('start_page.ejs');
    });
});

app.get('/create_account', (req, res) => {
    res.render('create_account.ejs');
});

app.get('/to_main_menu', (req, res) => {
    res.redirect(`http://localhost:${port_gateway}/courses/main_menu`);
});

app.get('/profile', (req, res) => {
    if (!req.session.user_name) {
        return res.redirect('/start_page');
    }
    res.render('profile.ejs', { nume: req.session.user_name });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email și parola sunt obligatorii.');
    }

    try {
        const user = await UserModel.findUserByEmail(email);

        if (!user) {
            return res.status(400).send('Email sau parolă greșite.');
        }

        if (await bcrypt.compare(password, user.password)) {
            req.session.user_name = user.username;
            req.session.email = user.email; //check if right later 
            res.redirect('/profile');
        } else {
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
        if (await UserModel.checkEmailExists(email)) { 
            return res.status(400).send('Contul cu acest email există deja.');
        }

        await UserModel.createUser(email, username, password); 
        res.redirect('/login');
    } catch (err) {
        console.error('Eroare la salvarea în baza de date:', err);
        res.status(500).send('A apărut o eroare.');
    }
});

app.get('/', (req, res) => {
    res.render('start_page.ejs');
});

app.listen(port, () => {
    console.log(`User-service listening to port ${port}`);
});
