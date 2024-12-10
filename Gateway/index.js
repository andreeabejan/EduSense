const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy'); 

const app = express();

app.use(cors());
app.use(express.json());

app.use('/courses', proxy('http://localhost:8001'))
app.use('/exam', proxy('http://localhost:8002'))
app.use('/feedback', proxy('http://localhost8003'))
app.use('/', proxy('http://localhost:8004'))

app.listen(8000, () => {
    console.log('Gateway listening to port 8000')
})