const express = require('express');
const router = express.Router();
const { checkAuthenticated, checkAdmin } = require('../middleware/authHandler');

router.get('/', async (req, res) => {
    res.redirect('/main');
});

router.get('/main', async (req, res) => { 
    if (req.session.user) {
        res.redirect('/forecast');
    } else {
        res.render('main');
    }
});

router.get('/sign', async (req, res) => {
    res.render('sign/sign');
});

router.get('/forecast', checkAuthenticated, async (req, res) => { 
    let isAdmin = req.session.user.isAdmin;
    res.render('forecast/forecast', { data: null, isAdmin: isAdmin });
});





module.exports = router;