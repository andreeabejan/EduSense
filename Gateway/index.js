const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
require('dotenv').config();
const port = process.env.PORT;  
const port_user_service = process.env.PORT_USER;
const port_courses_service = process.env.PORT_COURSES;
const port_exam_service = process.env.PORT_EXAM;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use((req, res, next) => {
    console.log('Content-Type:', req.headers['content-type']);
    next();
});

app.use('/courses', proxy(`http://localhost:${port_courses_service}`));

app.use('/exam', proxy(`http://localhost:${port_exam_service}`));

app.use('/', proxy(`http://localhost:${port_user_service}`));

app.listen(port, () => {
    console.log(`Gateway listening to port ${port}`);
});
