const db = require('./conn');
const bcrypt = require('bcryptjs');

class User {
    constructor(id, user_name, user_email, user_pass) {
        this.id = id;
        this.user_name = user_name;
        this.user_email = user_email;
        this.user_pass = user_pass;
    }

    checkPassword(hashedPassword) {
        console.log(this.user_pass, hashedPassword);
        return bcrypt.compareSync(this.user_pass, hashedPassword);
    }

    static async addUser(user_name, user_email, user_pass) {
        try {
            // This is a prepared statement
            // It will perform some basic sanitization for our inputs, removing any SQL injection risk
            const query = `INSERT INTO users 
                (user_name, user_email, user_pass) VALUES ('${user_name}', '${user_email}', '${user_pass}') RETURNING id;`
            const response = await db.one(query);
            return response;
        } catch (error) {
            console.error('ERROR: ', error);
            return error;
        }
    }

    async login() {
        try {
            // Lookup the user by their email address
            const query = `SELECT * FROM users WHERE user_name = '${this.user_name}';`;
            const response = await db.one(query);
            // Check the user's password based on the hash
            console.log('login response object:', response);
            const isValid = this.checkPassword(response.user_pass);
            // return a response to the controller, either valid or not
            if (!!isValid) {
                const { id, user_name, user_email } = response;
                return { isValid, user_id: id, user_name, user_email }
            } else {
                return { isValid }
            }
        } catch (error) {
            console.error('ERROR: ', error);
            return error;
        }
    }
}

module.exports = User;