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

    async getCourseLevel(req) {
        if (!req.session.email) {
            throw new Error('User not logged in');
        }

        const email = req.session.email;
        const result = await pool.query('SELECT capitals_course FROM users WHERE email = $1', [email]);
        
        if (result.rows.length > 0) {
            return result.rows[0].capitals_course;  
        } else {
            throw new Error('User not found');
        }
    }
};

module.exports = UserModel;
