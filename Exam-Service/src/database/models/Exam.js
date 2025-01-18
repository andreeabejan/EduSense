const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',    
    host: 'localhost',
    database: 'EduSense',
    password: 'student', 
    port: 5432,
});

const ExamModel = {

    async insertFeedback(courseTable, userId, compound, level) {
        try {
            const result = await pool.query(
                //${courseTable}
                `INSERT INTO "Capitals_record" (id, sentiment, level) VALUES ($1, $2, $3) RETURNING *`,
                [userId, compound, level]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error inserting feedback:', error);
            throw new Error('Could not insert feedback');
        }
    },

    async getUserCourseLevel(email, course) {
        try {
            const result = await pool.query(
                `SELECT ${course}_record AS level FROM users WHERE email = $1`,
                [email]
            );

            if (result.rows.length > 0) {
                return result.rows[0].level;
            } else {
                throw new Error('User not found');
            }
        } catch (error) {
            console.error('Error getting user course level:', error);
            throw new Error('Could not fetch user course level');
        }
    }
};

module.exports = ExamModel;
