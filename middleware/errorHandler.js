function errorHandler(err, req, res, next) {
    console.error('handler: ',err.stack); 
    res.status(500).send('Что-то сломалось!');
}

module.exports = errorHandler;
