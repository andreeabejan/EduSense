const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();
const app = express();
const port = process.env.PORT;  
const port_user_service = process.env.PORT_USER;
const port_courses_service = process.env.PORT_COURSES;
const port_exam_service = process.env.PORT_EXAM;

app.use('/courses', createProxyMiddleware({ 
    target: `http://localhost:${port_courses_service}`, 
    changeOrigin: true,
    pathRewrite: {
        '^/courses': '', 
    },
    onProxyRes: (proxyRes, req, res) => { //incerc sa rezolv identificarea fisierelor css
        if (req.url.includes('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
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
