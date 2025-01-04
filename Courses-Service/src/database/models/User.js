const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
    user: 'postgres',    
    host: 'localhost',
    database: 'EduSense',
    password: 'student', 
    port: 5432,
});

const UserModel = {

    async findUserByEmail(email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0]; 
    },

    async checkEmailExists(email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows.length > 0;
    },

    async getCourseLevel(req, course) {
        // console.log("We are here");
        // console.log(req.session);
        // console.log(req.session.email);
        // if (!req.session.email) {
        //     throw new Error('User not logged in');
        // }
    
        // const email = req.session.email;

        email = "aa@a"

        // to see: shared session store, JWTs, or propagate session data through headers or cookies
        
        const result = await pool.query(
            `SELECT ${course}_course FROM users WHERE email = $1`,
            [email]
        );
        
        if (result.rows.length > 0) {
            return result.rows[0][`${course}_course`];  
        } else {
            throw new Error('User not found');
        }
    },

    async growCourseLevel(req, course) {
        if (!req.session.email) {
            throw new Error('User not logged in');
        }
    
        const email = req.session.email;
        
        const result = await pool.query(
            `UPDATE users SET ${course}_course = ${course}_course + 1 WHERE email = $1 RETURNING ${course}_course`,
            [email]
        );
    
        if (result.rows.length > 0) {
            return result.rows[0][`${course}_course`]; 
        } else {
            throw new Error('User not found');
        }
    }
};

module.exports = UserModel;
