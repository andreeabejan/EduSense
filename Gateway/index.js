const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();
const app = express();
const port = process.env.PORT;  
const port_user_service = process.env.PORT_USER;
const port_courses_service = process.env.PORT_COURSES;
const port_exam_service = process.env.PORT_EXAM;
app.use(express.static('public'));

// app.use((req, res, next) => {
//     console.log(`Received request: ${req.method} ${req.url}`);
//     next();
// });

app.use('/courses', createProxyMiddleware({ 
    target: `http://localhost:${port_courses_service}`, 
    changeOrigin: true,
    pathRewrite: {
        '^/courses': '', 
    },
}));

app.use('/exam', createProxyMiddleware({ 
    target: `http://localhost:${port_exam_service}`, 
    changeOrigin: true,
    pathRewrite: {
        '^/exam': '', 
    },
}));

app.use('/', createProxyMiddleware({ 
    target: `http://localhost:${port_user_service}`, 
    changeOrigin: true,
    pathRewrite: {
        '^/': '', 
    },
}));

app.listen(port, () => {
    console.log(`Gateway listening on port ${port}`);
});
