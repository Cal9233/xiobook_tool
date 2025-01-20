const mysql = require('mysql2');
require('dotenv').config();
const bcrypt = require('bcrypt');

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

con.connect(function(err) {
    if(err) {
        console.log(`connection error: ${err}`)
    } else {
        console.log("Connected")
    }
})

async function updateAdminPassword() {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash('test123', 10);
        
        // Update the admin user's password
        const sql = "UPDATE users SET password = ? WHERE email = ?";
        
        con.query(sql, [hashedPassword, 'user1@company.com'], (err, result) => {
            if (err) {
                console.error('Error updating password:', err);
                process.exit(1);
            }
            console.log('Admin password updated successfully');
            process.exit(0);
        });
        
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

//updateAdminPassword();

module.exports = con;