require('dotenv').config();

export default {
   url: process.env.DB_URL || 'mongodb://127.0.0.1:27017/gitlabClient',
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
};
