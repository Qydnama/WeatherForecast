const fs = require('fs');
const path = require('path');

const languageHandler = (req, res, next) => {
    let lang = req.query.lang || 'en';
    const langFile = path.join(__dirname, '../public/languages', `${lang}.json`);
    try {
        const localeData = fs.readFileSync(langFile, 'utf8');
        res.locals.locale = JSON.parse(localeData);
        
    } catch (error) {
        console.error(`Locale file for ${lang} not found.`);
        res.locals.locale = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/languages', 'en.json'), 'utf8'));
    }
    
    next();
};

module.exports = languageHandler
