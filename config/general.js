require('dotenv').config();

module.exports = { 
    PORT: process.env.PORT, 
    SECRET: process.env.SECRET,
    ENV_NODE: process.env.ENV_NODE 
}